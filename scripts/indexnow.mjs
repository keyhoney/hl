#!/usr/bin/env node
/**
 * IndexNow 제출 스크립트
 *
 * 사용법
 *   npm run indexnow                 # dist/sitemap.xml 의 모든 URL 제출
 *   npm run indexnow -- --live       # 배포된 https://howlearn.kr/sitemap.xml 기준으로 제출
 *   npm run indexnow -- --dry-run    # 실제 제출 없이 대상 URL만 확인
 *   npm run indexnow -- --check      # 키 파일 배포 여부만 확인
 *   npm run indexnow -- --url-file=urls.txt    # 파일에 담긴 URL만 제출
 *   npm run indexnow -- https://howlearn.kr/problem/20261101/ ...   # 특정 URL만 제출
 *
 * 키 파일(public/<key>.txt)은 반드시 먼저 배포되어 있어야 합니다.
 * IndexNow 응답 코드: 200/202 성공, 400 잘못된 요청, 403 키 없음,
 * 422 URL/호스트 불일치, 429 요청 과다.
 */

import fs from 'node:fs';
import path from 'node:path';

const ENDPOINT = 'https://api.indexnow.org/indexnow';
const BATCH_LIMIT = 10_000;

const args = process.argv.slice(2);
const flags = new Set(args.filter((arg) => arg.startsWith('--')));
const extraUrls = args.filter((arg) => !arg.startsWith('--'));
const dryRun = flags.has('--dry-run');
const useLive = flags.has('--live');
const checkOnly = flags.has('--check');

const urlFileArg = args.find((arg) => arg.startsWith('--url-file='));
let fileUrls = [];
if (urlFileArg) {
  const urlFile = urlFileArg.slice('--url-file='.length);
  if (!urlFile || !fs.existsSync(urlFile)) {
    console.error(`\n[ERROR] URL 목록 파일을 찾지 못했습니다: ${urlFile}\n`);
    process.exit(1);
  }
  fileUrls = fs
    .readFileSync(urlFile, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

const log = (message) => console.log(message);

class FatalError extends Error {}

// process.exit() 은 Windows에서 열린 fetch 소켓과 충돌할 수 있어 예외로 종료합니다.
function die(message) {
  throw new FatalError(message);
}

/** public/ 또는 프로젝트 루트에서 "<key>.txt" 형태의 IndexNow 키 파일을 찾습니다. */
function findKeyFile(directory) {
  if (!fs.existsSync(directory)) return null;

  for (const name of fs.readdirSync(directory)) {
    if (!name.endsWith('.txt')) continue;

    const fullPath = path.join(directory, name);
    if (!fs.statSync(fullPath).isFile()) continue;

    const key = fs.readFileSync(fullPath, 'utf8').trim();
    const keyFromName = path.basename(name, '.txt');

    // IndexNow 키는 8~128자의 영숫자/하이픈이며, 파일명과 내용이 같아야 합니다.
    if (key === keyFromName && /^[A-Za-z0-9-]{8,128}$/.test(key)) {
      return { key, file: fullPath };
    }
  }

  return null;
}

function readSiteUrl() {
  const config = fs.readFileSync('astro.config.mjs', 'utf8');
  const match = config.match(/site:\s*['"]([^'"]+)['"]/);
  if (!match) die('astro.config.mjs 에서 site URL을 찾지 못했습니다.');
  return match[1].replace(/\/+$/, '');
}

function extractUrls(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((match) =>
    match[1].replace(/&amp;/g, '&')
  );
}

function readBuiltSitemap() {
  const sitemapPath = path.join('dist', 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    die('dist/sitemap.xml 이 없습니다. 먼저 `npm run build` 를 실행하세요.');
  }
  return extractUrls(fs.readFileSync(sitemapPath, 'utf8'));
}

async function readLiveSitemap(site) {
  const sitemapUrl = new URL('/sitemap.xml', site).href;
  const response = await fetch(sitemapUrl);
  if (!response.ok) die(`라이브 sitemap 요청 실패 (HTTP ${response.status}): ${sitemapUrl}`);
  return extractUrls(await response.text());
}

async function main() {
  const found = findKeyFile('public') ?? findKeyFile('.');
  if (!found) {
    die('IndexNow 키 파일을 찾지 못했습니다. public/<key>.txt 파일을 추가하세요.');
  }

  const { key } = found;
  const site = readSiteUrl();
  const { origin, host } = new URL(site);
  const keyLocation = `${origin}/${key}.txt`;

  log(`파일      : ${found.file}`);
  log(`호스트    : ${host}`);
  log(`키 위치   : ${keyLocation}`);

  // 1) 키 파일이 실제로 배포되었는지 확인
  if (!dryRun) {
    log('\n[1/3] 키 파일 배포 확인...');
    let response;
    try {
      response = await fetch(keyLocation, { headers: { 'cache-control': 'no-cache' } });
    } catch (error) {
      die(`키 파일에 접속할 수 없습니다: ${error.message}`);
    }

    const body = response.ok ? (await response.text()).trim() : '';
    if (!response.ok || body !== key) {
      die(
        [
          `키 파일이 아직 배포되지 않았습니다. (HTTP ${response.status})`,
          `응답 앞부분: ${JSON.stringify(body.slice(0, 80))}`,
          '',
          'public/ 폴더에 키 파일이 있는지 확인하고 사이트를 다시 배포한 뒤 실행하세요.',
          '(200 응답이어도 내용이 HTML이면 SPA fallback이 키 파일을 가리고 있는 것입니다.)',
        ].join('\n')
      );
    }
    log('        OK');
  }

  // 2) 제출할 URL 수집
  log('\n[2/3] 제출 URL 수집...');
  let urls;
  try {
    if (fileUrls.length > 0 || extraUrls.length > 0) {
      urls = [...fileUrls, ...extraUrls];
    } else if (useLive) {
      urls = await readLiveSitemap(site);
    } else {
      urls = readBuiltSitemap();
    }
  } catch (error) {
    if (error instanceof FatalError) throw error;
    die(`URL 수집 실패: ${error.message}`);
  }

  urls = [...new Set(urls.map((url) => url.trim()))].filter(Boolean);

  const wrongHost = urls.filter((url) => {
    try {
      return new URL(url).host !== host;
    } catch {
      return true;
    }
  });
  if (wrongHost.length > 0) {
    die(`host(${host})와 다른 URL이 있습니다:\n- ${wrongHost.slice(0, 10).join('\n- ')}`);
  }
  if (urls.length === 0) die('제출할 URL이 없습니다.');

  log(`        ${urls.length}개`);

  if (checkOnly) {
    log('\n키 파일 확인만 수행했습니다. 제출은 하지 않았습니다.');
    return;
  }

  if (dryRun) {
    log('\n[dry-run] 실제 제출은 하지 않습니다. 대상 URL:');
    for (const url of urls) log(`  ${url}`);
    return;
  }

  // 3) 배치 제출 (IndexNow 1회 최대 10,000개)
  log('\n[3/3] IndexNow 제출...');
  let submitted = 0;

  for (let index = 0; index < urls.length; index += BATCH_LIMIT) {
    const batch = urls.slice(index, index + BATCH_LIMIT);
    let response;
    try {
      response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host, key, keyLocation, urlList: batch }),
      });
    } catch (error) {
      die(`IndexNow 요청 실패: ${error.message}`);
    }

    // 성공 시 본문이 비어 있는 경우가 많습니다.
    const detail = (await response.text().catch(() => '')).slice(0, 300);

    if (response.status !== 200 && response.status !== 202) {
      die(
        [
          `제출 실패 (HTTP ${response.status})`,
          detail,
          '',
          '403: 키 파일을 찾을 수 없음 / 422: URL-호스트 불일치 또는 키 불일치',
          '429: 요청 과다 — 잠시 후 다시 시도하세요.',
        ].join('\n')
      );
    }

    submitted += batch.length;
    log(`        ${batch.length}개 제출 완료 (HTTP ${response.status})`);
  }

  log(`\n완료: ${submitted}개 URL을 IndexNow에 제출했습니다.`);
  log('Bing·Naver 등 참여 검색엔진 반영에는 수 시간 ~ 며칠이 걸릴 수 있습니다.');
}

main().catch((error) => {
  if (error instanceof FatalError) {
    console.error(`\n[ERROR] ${error.message}\n`);
  } else {
    console.error(`\n[ERROR] ${error.stack ?? error}\n`);
  }
  process.exitCode = 1;
});
