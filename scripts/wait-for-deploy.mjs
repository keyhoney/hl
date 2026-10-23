#!/usr/bin/env node
/**
 * Cloudflare Pages 배포가 끝날 때까지 기다립니다.
 *
 * 사용법
 *   node scripts/wait-for-deploy.mjs <commit-sha> [site-url]
 *
 * `/api/deploy.json` 이 빌드 시 주입된 `CF_PAGES_COMMIT_SHA`를 돌려주므로,
 * 이 값이 대상 커밋과 같아지면 배포가 완료된 것으로 봅니다.
 *
 * GitHub Actions 러너에서 Node fetch(undici)가 간헐적으로 멈추는 사례가 있어
 * curl을 우선 사용하고, curl이 없을 때만 fetch로 폴백합니다.
 *
 * 환경변수
 *   DEPLOY_TIMEOUT_MS  최대 대기 시간 (기본 25분)
 *   DEPLOY_POLL_MS     폴링 간격 (기본 10초)
 */

import { execFileSync } from 'node:child_process';

const sha = process.argv[2];
const site = (process.argv[3] ?? 'https://howlearn.kr').replace(/\/+$/, '');

if (!sha) {
  console.error('사용법: node scripts/wait-for-deploy.mjs <commit-sha> [site-url]');
  process.exit(1);
}

const timeoutMs = Number(process.env.DEPLOY_TIMEOUT_MS ?? 25 * 60 * 1000);
const pollMs = Number(process.env.DEPLOY_POLL_MS ?? 10 * 1000);
const deadline = Date.now() + timeoutMs;

const log = (message) => console.log(message);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** GitHub Actions 로그 없이도 확인할 수 있도록 체크 애노테이션을 남깁니다. */
function annotate(level, message) {
  const safe = String(message).replace(/\s+/g, ' ').trim().slice(0, 900);
  console.log(`::${level}::${safe}`);
}

function readWithCurl(url) {
  const output = execFileSync(
    'curl',
    ['-fsS', '--max-time', '15', '-H', 'cache-control: no-cache', url],
    { encoding: 'utf8', timeout: 20_000, stdio: ['ignore', 'pipe', 'pipe'] }
  );
  return JSON.parse(output);
}

async function readWithFetch(url) {
  const response = await fetch(url, {
    headers: { 'cache-control': 'no-cache' },
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function readDeployState(url) {
  try {
    return { data: readWithCurl(url), via: 'curl' };
  } catch (error) {
    if (error.code !== 'ENOENT') {
      const stderr = String(error.stderr ?? '').trim().split(/\r?\n/)[0];
      throw new Error(stderr || error.message);
    }
    // curl이 설치되지 않은 환경(로컬 등)만 fetch로 폴백
    return { data: await readWithFetch(url), via: 'fetch' };
  }
}

async function main() {
  const target = `${site}/api/deploy.json`;
  log(`배포 대기: ${target} → ${sha.slice(0, 7)}`);

  let lastState = '';
  let attempts = 0;

  while (Date.now() < deadline) {
    attempts += 1;
    let state = '';

    try {
      const { data, via } = await readDeployState(`${target}?t=${Date.now()}`);
      const liveSha = typeof data?.sha === 'string' ? data.sha : null;

      if (liveSha === sha) {
        log(`배포 완료 확인 (${sha.slice(0, 7)}, ${attempts}회 시도, ${via})`);
        annotate('notice', `배포 완료: ${sha.slice(0, 7)} (${via})`);
        return;
      }

      state = `${liveSha ? liveSha.slice(0, 7) : 'sha 없음'} (${via})`;
    } catch (error) {
      state = `요청 실패: ${error.message}`;
    }

    if (state !== lastState) {
      log(`  대기 중... ${state}`);
      annotate('notice', `배포 대기 ${attempts}회: ${state}`);
      lastState = state;
    }

    await sleep(pollMs);
  }

  annotate('error', `배포 대기 시간 초과: 마지막 상태 = ${lastState || '없음'}`);
  throw new Error(
    `배포가 ${Math.round(timeoutMs / 60000)}분 안에 완료되지 않았습니다. ` +
      'Cloudflare Pages 빌드 로그를 확인하세요.'
  );
}

main().catch((error) => {
  console.error(`\n[ERROR] ${error.message}\n`);
  process.exitCode = 1;
});
