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
 * 환경변수
 *   DEPLOY_TIMEOUT_MS  최대 대기 시간 (기본 25분)
 *   DEPLOY_POLL_MS     폴링 간격 (기본 10초)
 */

const sha = process.argv[2];
const site = (process.argv[3] ?? 'https://howlearn.kr').replace(/\/+$/, '');

if (!sha) {
  console.error('사용법: node scripts/wait-for-deploy.mjs <commit-sha> [site-url]');
  process.exit(1);
}

const timeoutMs = Number(process.env.DEPLOY_TIMEOUT_MS ?? 25 * 60 * 1000);
const pollMs = Number(process.env.DEPLOY_POLL_MS ?? 10 * 1000);
const deadline = Date.now() + timeoutMs;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const log = (message) => console.log(message);

let unknownStreak = 0;
let lastState = '';

async function main() {
  log(`배포 대기: ${site}/api/deploy.json → ${sha.slice(0, 7)}`);

  while (Date.now() < deadline) {
    let liveSha = null;
    let state = '';

    try {
      const response = await fetch(`${site}/api/deploy.json?t=${Date.now()}`, {
        headers: { 'cache-control': 'no-cache' },
        cache: 'no-store',
      });

      if (!response.ok) {
        state = `HTTP ${response.status}`;
      } else {
        const data = await response.json();
        liveSha = typeof data?.sha === 'string' ? data.sha : null;

        if (liveSha === sha) {
          log(`배포 완료 확인 (${sha.slice(0, 7)})`);
          return;
        }

        state = liveSha ? `현재 ${liveSha.slice(0, 7)}` : 'sha 없음';

        // 엔드포인트가 아직 없는 이전 배포이거나 CF_PAGES_COMMIT_SHA가 없는 환경.
        if (liveSha === 'unknown') {
          unknownStreak += 1;
          if (unknownStreak >= 3) {
            log('경고: 배포 SHA를 확인할 수 없어 대기를 건너뜁니다. (CF_PAGES_COMMIT_SHA 미주입 환경)');
            return;
          }
        } else {
          unknownStreak = 0;
        }
      }
    } catch (error) {
      state = `연결 실패 (${error.message})`;
    }

    if (state !== lastState) {
      log(`  대기 중... ${state}`);
      lastState = state;
    }

    await sleep(pollMs);
  }

  throw new Error(
    `배포가 ${Math.round(timeoutMs / 60000)}분 안에 완료되지 않았습니다. ` +
      'Cloudflare Pages 빌드 로그를 확인하세요.'
  );
}

main().catch((error) => {
  console.error(`\n[ERROR] ${error.message}\n`);
  process.exitCode = 1;
});
