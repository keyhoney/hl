# HowLearn

**How**learn — *어떻게 풀고(How), 어떻게 익히는가(Learn)*. 수능 수학 4점 킬러·준킬러 문항을 **정석 풀이 · 스킬 숏컷 · 기하적 직관** 등 다양한 해법으로 해체해 비교하는 교육용 정적 웹 아카이브입니다.

브랜드 워드마크는 `How`(인디고)와 `Learn`(다크)을 색과 굵기로 구분합니다. 로고는 `src/components/Brand.astro` 한 곳에서 관리되어 헤더·푸터에 동일하게 적용됩니다.

문항마다 제공되는 해법의 수와 조합은 다릅니다. **정석 풀이·스킬 숏컷은 여러 개**(예: 정석 2 + 숏컷 3)가 함께 실리기도 하고, **기하적 풀이는 일부 문항에만** 선택적으로 제공됩니다.

기존 React(Vite SPA, 해시 라우팅) 앱을 **Astro 정적 사이트(SSG)** 로 전환했습니다.

## 기술 스택

| 항목 | 사용 |
| --- | --- |
| 프레임워크 | [Astro](https://astro.build) (Static SSG, 기본 JS 0) |
| 스타일 | Tailwind CSS v4 (`@tailwindcss/vite`) |
| 수식 렌더링 | [KaTeX](https://katex.org) — **빌드 타임**에 HTML로 렌더링 |
| 언어 | TypeScript |
| 폰트 | Pretendard (CDN) |

## 핵심 특징

- **빌드 타임 KaTeX**: 문제 본문·해설의 LaTeX를 빌드 시점에 KaTeX HTML로 컴파일합니다. 브라우저는 KaTeX 런타임을 내려받지 않습니다.
- **최소 자바이스크립트**: 검색 필터·모바일 메뉴 등 상호작용만 바닐라 스크립트로 점진적 향상(progressive enhancement) 처리합니다.
- **파일 기반 라우팅**: 기존 `#/problems` 형태의 해시 라우팅을 실제 URL(`/problems`, `/problem/[id]` 등)로 전환했습니다.
- **완전 정적 출력**: 서버·DB·외부 API 의존성이 없으며, `dist/`를 어떤 정적 호스팅에도 배포할 수 있습니다.
- **검색봇 지원**: 문항 본문을 포함한 HTML을 빌드 시 생성하며, canonical URL·`robots.txt`·전체 문항 sitemap을 제공합니다.
- **RSS 피드**: 전체 문항을 RSS 2.0(`/rss.xml`)으로 제공하며, 모든 페이지의 `<head>`에 자동 발견 링크를 추가합니다.

## 시작하기

```bash
npm install
npm run dev      # http://localhost:3000 개발 서버
```

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 (포트 3000) |
| `npm run build` | `dist/`에 정적 사이트 빌드 |
| `npm run preview` | 빌드 결과물 미리보기 |
| `npm run check` | TypeScript 타입 검사 (`tsc --noEmit`) |
| `npm run indexnow` | 빌드된 `dist/sitemap.xml` 기준 전체 URL을 IndexNow로 제출 |
| `npm run indexnow:live` | 배포된 `/sitemap.xml` 기준으로 제출 |
| `npm run indexnow:dry` | 실제 제출 없이 대상 URL만 확인 |
| `npm run indexnow:check` | IndexNow 키 파일 배포 여부만 확인 |

## 라우팅

| 경로 | 페이지 |
| --- | --- |
| `/` | 홈 (히어로 · 다각도 해법 · 대표 문항) |
| `/problems` | 문항 검색·목록 (학년도/과목/계산량 필터, 키워드 검색) |
| `/problem/[id]` | 문항 상세 (다각도 해법 전체 펼침, 단계별 풀이, 다이어그램) |
| `/og/[id].jpg` | 문항별 OG 이미지 (1200×1200, 네이버 정사각형 미리보기용) |
| `/years`, `/years/[year]` | 연도별 아카이브 |
| `/curriculum`, `/curriculum/[subject]` | 과목·단원별 분류 |
| `/about` | 사이트 소개 및 아키텍처 |
| `/privacy` | 개인정보처리방침 |
| `/contact` | 문의 및 오류 제보 |
| `/rss.xml` | 전체 문항 RSS 2.0 피드 |
| `/sitemap.xml` | 정적 페이지와 전체 문항 상세 페이지 사이트맵 |

> 검색 필터는 쿼리스트링으로 초기 상태를 받습니다. 예: `/problems?year=2024&subject=수학%20II&q=22번`
>
> 문항별 OG 이미지는 네이버 정사각형 미리보기에 맞춰 **1200×1200 JPEG**로 빌드 시 생성됩니다. 페이지 본문에는 이미지를 노출하지 않고, `<head>`의 `og:image`·`twitter:image` 메타데이터로만 연결합니다.

## 광고 (Google AdSense)

문항 상세의 **해법 사이**에 광고 슬롯이 들어갑니다. 해법은 탭 전환 없이 항상 전부 펼쳐 노출되므로, 해법 개수만큼 광고 지면이 확보됩니다.

`.env`에 아래 값을 넣으면 실제 광고가 로드되고, 비어 있으면 예약 영역(placeholder)만 표시됩니다. (`.env.example` 참고)

```
PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
PUBLIC_ADSENSE_SLOT=1234567890
```

## 디렉터리 구조

```
src/
├── components/          # Astro 컴포넌트
│   ├── Header.astro, Footer.astro
│   ├── Brand.astro                 # HowLearn 워드마크 (How/Learn 톤 구분)
│   ├── MathView.astro              # KaTeX 빌드 타임 렌더러
│   ├── SvgDiagram.astro           # 기하 다이어그램 SVG
│   ├── ProblemCard.astro
│   ├── AdSlot.astro               # 문항 상세 해법 사이 애드센스 광고 슬롯
│   ├── YearArchive.astro          # 연도별 페이지 공용 뷰
│   └── CurriculumArchive.astro    # 과목별 페이지 공용 뷰
├── layouts/BaseLayout.astro
├── pages/               # 파일 기반 라우트 (index, problems, problem/[id], ...)
├── content.config.ts    # Content Collection 스키마 (문항 검증)
├── content/problems/    # 문항 1개 = 마크다운 파일 1개 (frontmatter + 본문)
├── data/
│   ├── problems.ts      # Content Collection → MathProblem 변환 (getProblems)
│   └── siteData.ts      # 교육과정·연도 아카이브 데이터
├── lib/
│   ├── mdx/parse.ts     # MDX 섹션 파서
│   └── og/problemOg.ts  # 문항별 OG 이미지 SVG 렌더러
├── types/mathProblem.ts
├── utils/               # solutions, mathHelpers, filterProblems, routes
└── styles/global.css    # Tailwind 진입점 + 상태 스타일
```

## 문항 추가/수정

문항은 `src/data`의 거대한 배열이 아니라 **`src/content/problems/`의 MDX 원문과 `_metadata.json`** 으로 관리합니다. 현재 450개 문항을 개별 상세 URL로 정적 생성하며, 본문·힌트·해설은 서버에서 내려주는 HTML에 포함됩니다.

```
src/content/problems/20220601.mdx
src/content/problems/_metadata.json
```

- **파일명**(확장자 제외)이 문항 `id`가 되고, 상세 URL `/problem/<id>`이 자동 생성됩니다.
- 시험 정보·단원·정답은 `_metadata.json`에서 관리하고, 문제·힌트·해설은 각 MDX 원문에 기록합니다.
- MDX 구획과 수식은 `src/lib/mdx/parse.ts`에서 빌드 시 파싱·렌더링됩니다.

새 문항을 추가하거나 메타데이터를 수정한 뒤 `npm run build`를 실행하면 목록·상세·검색 인덱스·sitemap에 반영됩니다. 사이트 도메인은 `astro.config.mjs`의 `site` 설정을 배포 주소와 일치시켜야 합니다.

## 검색엔진 색인 (IndexNow)

`master` 브랜치에 `src/content/problems/**` 변경이 push되면 `.github/workflows/indexnow.yml`이 **변경된 문항 URL만** 골라 IndexNow(Bing·네이버 등)로 자동 제출합니다.

- 추가·수정된 문항뿐 아니라 **삭제·이름 변경된 문항의 기존 URL**도 함께 제출합니다.
- 문항이 바뀌면 목록 페이지(`/`, `/problems/`)도 제출 대상에 포함됩니다.
- GitHub Actions 화면의 **Run workflow**에서 URL을 직접 넣거나 전체 문항을 제출할 수 있습니다.
- 전체 제출은 로컬에서 `npm run indexnow`(빌드 결과 기준)를 사용하는 편이 빠릅니다.

> Cloudflare가 GitHub Actions 러너 IP의 사이트 요청을 **403**으로 차단합니다. 그래서 워크플로는 배포 완료 폴링과 키 파일 라이브 확인을 생략하고, 고정 5분 대기 후 제출합니다. `public/<key>.txt` 키 파일은 삭제하지 마세요. 배포된 커밋은 `/api/deploy.json`에서 확인할 수 있고, 로컬에서는 `node scripts/wait-for-deploy.mjs <커밋SHA>`로 배포 완료를 기다릴 수 있습니다.
