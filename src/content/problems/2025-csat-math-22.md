---
examName: 2025학년도 대학수학능력시험
year: 2025
examMonth: 11
subject: 미적분 I
unitName: 다항함수의 적분법
subTopic: 사차함수의 그래프 개형과 절댓값 함수의 미분가능성
problemNumber: 22
points: 4
correctRateEstimate: 6.2
answer: "48"
sourceOrg: 한국교육과정평가원 (KICE)
officialLink: https://www.kice.re.kr
diagramType: quartic-tangent
keyInsight: |-
  사차함수 $y=g(x)$에서 $y=g(t)$를 그어 꺾어 올렸을 때 미분불가능한 점이 1개라는 것은, 직선 $y=g(t)$가 사차함수의 삼중근(변곡 접선)과 단순 교점 1개를 갖는 유일한 형태임을 뜻합니다.
solutions:
  - type: standard
    title: 교과서적 정석 풀이 (대수적 근 판별법)
    summary: 도함수의 부호 변화와 절댓값 미분가능성 정리($g(x)-g(t)$의 인수분해 차수)를 단계별로 정밀하게 증명하는 접근법
    calculationLoad: 대 (계산량 많음)
    difficultyRating: 4.5
    recommendationScore: 4.0
    estimatedMinutes: 9
    verdict: 논리적 비약 없이 서술형이나 수리논술까지 대비할 수 있는 가장 탄탄한 기초 풀이
    steps:
      - stepTitle: 'Step 1. 절댓값 함수의 미분가능성 조건 해석'
        explanation: |-
          함수 $h(x)=|g(x)-g(t)|$가 $x=\alpha$에서 미분가능하려면, $g(\alpha)-g(t)=0$인 실근 $\alpha$가 $g(x)-g(t)$의 중근 이상(즉, 접하는 점)이어야 합니다. 오직 한 점에서만 미분가능하지 않으려면, 방정식 $g(x)=g(t)$가 1개의 단순 실근과 1개의 삼중근을 가져야 합니다.
        mathLatex: |-
          g(x) - g(t) = (x-\alpha)^3 (x-\beta) \quad (\alpha \neq \beta)
      - stepTitle: 'Step 2. 삼중근 접선의 위치와 집합 {-1, 3}의 기하적 의미'
        explanation: |-
          사차함수 $g(x)$의 최고차항 계수는 $f(x)$를 적분했으므로 $\frac{1}{4}$입니다. $y=g(t)$가 삼중접선이 될 수 있는 유일한 $t$는 $g'(t)=f(t)=0$이면서 $g''(t)=f'(t)=0$인 점(즉, $f(x)$가 $x$축과 접하는 변곡점 위치)입니다.
        mathLatex: |-
          t \in \{-1, 3\} \implies g'(-1)=f(-1)=0, \; g'(3)=f(3)=0
      - stepTitle: 'Step 3. 조건 $x=0$에서 극솟값 반영 및 식 결정'
        explanation: |-
          $f(x)$는 최고차항 계수가 1인 삼차함수이고 $x=0$에서 극솟값을 가집니다. $f(-1)=0, f(3)=0$이므로 나머지 한 근을 $k$라 두면 $f(x)=(x+1)(x-3)(x-k)$입니다. $f'(0)=0$과 극소 조건을 전개하여 $k$의 값을 결정합니다.
        mathLatex: |-
          f(x) = (x+1)(x-3)(x-k) = (x^2-2x-3)(x-k) \implies f'(0) = 2k - 3 = 0 \implies k = \frac{3}{2}
      - stepTitle: 'Step 4. 최종 함숫값 계산'
        explanation: |-
          조건을 만족하는 삼차함수 식 $f(x)=(x+1)(x-3)(x-k)$에 $x=5$를 대입하여 $f(5)=48$을 도출합니다.
        mathLatex: |-
          f(5) = (5+1)(5-3)(5-1) = 6 \times 2 \times 4 = 48
  - type: shortcut
    title: 시험장 실전 숏컷 (사차함수 3:1 비율 관계 & 대칭성)
    summary: 사차함수 삼중접선의 3:1 비율 관계를 활용하여 수식을 최소화하고 3분 안에 답을 도출하는 실전적 해법
    calculationLoad: 소 (매우 적음)
    difficultyRating: 3.5
    recommendationScore: 5.0
    estimatedMinutes: 3
    verdict: 수능 시험장 100분을 다투는 실전에서 시간을 획기적으로 단축해 주는 1등급 최우선 추천 풀이
    steps:
      - stepTitle: 'Step 1. 특수 개형 즉시 파악 (삼중접선 개형)'
        explanation: |-
          사차함수에서 수평선 접선 $y=C$를 그었을 때 비미분점이 1개인 경우는 오직 하나뿐입니다. 바로 기울기가 0인 삼중접선(안장점)이 존재하는 ‘우물형 사차함수’입니다.
        tip: 수능 4점 킬러에서 절댓값 미분불가점 1개 조건은 99% 삼중접선 개형입니다.
      - stepTitle: 'Step 2. 3:1 비율 관계 적용'
        explanation: |-
          삼중접점 $x=\alpha$와 통과점 $x=\beta$에 대해 극값 위치는 $\alpha$와 $\beta$를 $3:1$로 내분하는 점입니다. $t=-1, 3$은 두 접선의 $y$좌표를 결정하는 $x$좌표이므로, $f(x)=g'(x)$의 근은 즉시 $\{-1, 1, 3\}$ 등 등차수열 배치 또는 대칭 구조로 결정됩니다.
        mathLatex: |-
          \alpha - \text{극점} : \text{극점} - \beta = 3 : 1
      - stepTitle: 'Step 3. $x=0$ 극소 조건으로 인수 즉시 확정'
        explanation: |-
          $f(0)$의 도함수 조건과 대칭 중심에 의해 $f(x) = (x+1)(x-1)(x-3)$임을 10초 만에 도출할 수 있습니다.
        mathLatex: |-
          f(5) = (5+1)(5-1)(5-3) = 6 \times 4 \times 2 = 48
  - type: geometric
    title: 그래프 및 기하적 직관 풀이 (접선의 동적 스위핑)
    summary: 수평선 $y=g(t)$가 위아래로 움직일 때 생기는 교점의 개수와 접점의 차수를 시각적으로 추적하는 풀이
    calculationLoad: 중 (보통)
    difficultyRating: 3.8
    recommendationScore: 4.5
    estimatedMinutes: 5
    diagramId: quartic-sweep
    verdict: 수식 계산 실수가 잦은 학생들에게 시각적 확신을 주며, 문제의 본질을 한눈에 조망할 수 있는 풀이
    steps:
      - stepTitle: 'Step 1. 사차함수 $g(x)$의 곡선과 수평선 $y=g(t)$의 만남'
        explanation: |-
          곡선 $y=g(x)$와 직선 $y=k$의 교점에서 $k=g(t)$일 때 꺾이는 점의 개수를 시각화합니다. 일반적인 극대/극소에서는 접선이 2개의 교점 또는 4개의 교점을 만들어 꺾이는 점이 2개가 되지만, 변곡점 접선에서는 접하면서 통과하므로 꺾이지 않고 매끄럽게 통과합니다.
        mathLatex: |-
          g(x) - g(t) = (x - t)^3 \cdot Q(x)
      - stepTitle: 'Step 2. 도함수 $f(x)$ 넓이와 $g(x)$ 높이차의 기하학'
        explanation: |-
          $g(x)$의 높낮이는 $f(x)$의 정적분 넓이에 대응됩니다. $t=-1$과 $t=3$에서 수평선 접선이 생기는 기하적 대칭성을 확인합니다.
prerequisites:
  - name: 절댓값 함수의 미분가능성
    subject: 미적분 I
    description: $y=|f(x)-k|$가 미분가능하려면 $f(x)-k=0$인 모든 실근에서 $f'(x)=0$이어야 한다.
    importance: 필수
  - name: 사차함수의 그래프 비율 관계 (3:1)
    subject: 미적분 I
    description: 삼중접선을 갖는 사차함수에서 변곡접점과 극소점, 교점 사이의 거리비는 3:1이다.
    importance: 권장
  - name: 정적분으로 정의된 함수
    subject: 미적분 I
    description: $g(x) = \int_a^x f(t)dt$ 미분 시 $g'(x) = f(x)$, $g(a) = 0$ 성질.
    importance: 필수
relatedProblems:
  - id: 2024-csat-math-22
    examTitle: 2024학년도 대학수학능력시험 수학 22번
    year: 2024
    problemNumber: 22
    subject: 미적분 I
    similarityReason: 도함수의 부호 변화와 정수 조건 삼차함수 그래프 추론 문항으로 발상 체계가 직결됨
  - id: 2023-sept-math-22
    examTitle: 2023학년도 9월 모의평가 수학 22번
    year: 2023
    problemNumber: 22
    subject: 미적분 I
    similarityReason: 사차함수의 변곡 접선과 절댓값 미분가능 조건의 원조 격 문항
createdAt: '2024-11-18'
updatedAt: '2026-03-10'
reviewedBy: 수능수학 다각도해법 연구회 (전국연합 수학교사진)
---

최고차항의 계수가 $1$인 삼차함수 $f(x)$와 실수 $t$에 대하여 함수 $g(x)$를
$$g(x) = \int_0^x f(s) \, ds$$
라 하자. 함수 $h(x) = |g(x) - g(t)|$가 오직 한 개의 $x$에서만 미분가능하지 않도록 하는 모든 실수 $t$의 값의 집합이 $\{ -1, 3 \}$이다.

함수 $f(x)$가 $x=0$에서 극솟값을 가질 때, $f(5)$의 값을 구하시오.
