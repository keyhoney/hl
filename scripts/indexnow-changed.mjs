#!/usr/bin/env node
/**
 * IndexNow에 제출할 문항 URL을 계산합니다.
 *
 * 사용법
 *   node scripts/indexnow-changed.mjs <base-sha> [head-sha] [--hub]
 *   node scripts/indexnow-changed.mjs --all [--hub]
 *
 * - `src/content/problems/*.mdx` 추가/수정/삭제/이름변경을 감지합니다.
 *   (문항 id는 파일명이며, `_metadata.json`의 키와 같습니다.)
 * - `_metadata.json`에서 값이 바뀐 문항도 포함합니다.
 * - `--hub` 를 주면 목록 페이지(`/`, `/problems/`)도 함께 출력합니다.
 * - `--all` 은 전체 문항 URL을 출력합니다(초기 색인·대규모 개편용).
 *
 * stdout에는 URL만 한 줄에 하나씩 출력하고, 안내 메시지는 stderr로 보냅니다.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = 'src/content/problems';
const METADATA_FILE = `${CONTENT_DIR}/_metadata.json`;

const rawArgs = process.argv.slice(2);
const flags = new Set(rawArgs.filter((arg) => arg.startsWith('--')));
const positional = rawArgs.filter((arg) => !arg.startsWith('--'));
const [base, head = 'HEAD'] = positional;

const all = flags.has('--all');
const includeHub = flags.has('--hub');

if (!all && !base) {
  console.error(
    '사용법: node scripts/indexnow-changed.mjs <base-sha> [head-sha] [--hub] | --all [--hub]'
  );
  process.exit(1);
}

const log = (message) => console.error(message);

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function readSiteOrigin() {
  const config = fs.readFileSync('astro.config.mjs', 'utf8');
  const match = config.match(/site:\s*['"]([^'"]+)['"]/);
  if (!match) {
    throw new Error('astro.config.mjs 에서 site URL을 찾지 못했습니다.');
  }
  return new URL(match[1]).origin;
}

/** JSON 키 순서에 흔들리지 않는 비교용 직렬화 */
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function readJsonAt(rev, file) {
  try {
    const text = git(['show', `${rev}:${file}`]).replace(/^\uFEFF/, '');
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function addProblemId(ids, filePath) {
  if (!filePath) return;
  if (!filePath.endsWith('.mdx')) {
    if (filePath.endsWith('.md')) {
      log(`  건너뜀(빌드 대상 아님): ${filePath}`);
    }
    return;
  }
  ids.add(path.posix.basename(filePath, '.mdx'));
}

function collectAllIds() {
  const ids = new Set();
  for (const name of fs.readdirSync(CONTENT_DIR)) {
    if (name.endsWith('.mdx')) ids.add(path.posix.basename(name, '.mdx'));
  }
  return ids;
}

function collectChangedIds() {
  let diffOutput;
  try {
    diffOutput = git([
      'diff',
      '--name-status',
      '--find-renames',
      base,
      head,
      '--',
      CONTENT_DIR,
    ]);
  } catch (error) {
    throw new Error(`git diff 실패 (${base}..${head}): ${error.message}`);
  }

  const ids = new Set();
  const changedPaths = [];

  for (const line of diffOutput.split(/\r?\n/)) {
    if (!line.trim()) continue;

    const fields = line.split('\t');
    const status = fields[0][0];
    changedPaths.push(...fields.slice(1));

    if (status === 'R' || status === 'C') {
      // 이름 변경: 새 URL은 살아 있고, 옛 URL은 404가 되므로 둘 다 알립니다.
      addProblemId(ids, fields[2]);
      if (status === 'R') addProblemId(ids, fields[1]);
    } else {
      addProblemId(ids, fields[1]);
    }
  }

  if (changedPaths.includes(METADATA_FILE)) {
    const before = readJsonAt(base, METADATA_FILE) ?? {};
    const after = readJsonAt(head, METADATA_FILE) ?? {};

    for (const id of new Set([...Object.keys(before), ...Object.keys(after)])) {
      if (canonical(before[id]) !== canonical(after[id])) ids.add(id);
    }
  }

  return ids;
}

function main() {
  const origin = readSiteOrigin();
  const ids = all ? collectAllIds() : collectChangedIds();

  const urls = [...ids]
    .sort()
    .map((id) => `${origin}/problem/${encodeURIComponent(id)}/`);

  if (includeHub && ids.size > 0) {
    urls.push(`${origin}/`, `${origin}/problems/`);
  }

  if (all) {
    log(`전체 문항 ${ids.size}개`);
  } else {
    log(`변경 문항 ${ids.size}개 (${base.slice(0, 7)}..${head.slice(0, 7)})`);
  }

  if (urls.length > 0) {
    process.stdout.write(`${urls.join('\n')}\n`);
  }
}

try {
  main();
} catch (error) {
  console.error(`[ERROR] ${error.message}`);
  process.exitCode = 1;
}
