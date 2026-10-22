---
examName: 2024학년도 대학수학능력시험
year: 2024
examMonth: 11
subject: 미적분 I
unitName: 함수의 극한과 연속
subTopic: 구간별로 정의된 다항함수와 교점 개수 함수의 불연속
problemNumber: 14
points: 4
correctRateEstimate: 18.5
answer: "④"
sourceOrg: 한국교육과정평가원 (KICE)
officialLink: https://www.kice.re.kr
diagramType: cubic-derivative
keyInsight: |-
  구간별 함수 $g(x)$의 연속성과 $y=t$ 교점 개수 $h(t)$의 불연속점이 '단 1개'라는 것은, $g(x)$가 극값을 갖지 않고 단조증가하거나, 평행이동된 우측 곡선의 극값이 좌측 곡선의 경계점 및 극값과 정확히 합치되어 불연속 레벨이 단 하나로 병합되어야 함을 의미합니다.
solutions:
  - type: standard
    title: 정석 풀이 (연속 조건과 도함수 부호 분석)
    summary: '연속 조건식 $f(1) = f(1+a)-b$로부터 관계식을 도출하고, $x < 1$ 영역과 $x \ge 1$ 영역의 극대/극소 위치를 대수적으로 전개하여 비교하는 방법'
    calculationLoad: 중 (보통)
    difficultyRating: 4.0
    recommendationScore: 4.2
    estimatedMinutes: 7
    verdict: '조건 누락 없이 모든 자연수 쌍 $(a, b)$를 엄밀히 검증할 수 있는 정석적 해법'
    steps:
      - stepTitle: 'Step 1. $f(x)$의 도함수 및 극값 조사'
        explanation: |-
          $f'(x) = 6x^2 - 18x + 12 = 6(x-1)(x-2)$입니다. 따라서 $x=1$에서 극댓값 $f(1)=3$, $x=2$에서 극솟값 $f(2)=2$를 가집니다.
        mathLatex: |-
          f'(x) = 6(x-1)(x-2) \implies f(1)=3, \; f(2)=2
      - stepTitle: 'Step 2. $x=1$에서의 연속성 조건'
        explanation: |-
          $g(x)$가 $x=1$에서 연속이어야 하므로 좌극한과 우극한이 일치해야 합니다.
        mathLatex: |-
          \lim_{x \to 1^-} g(x) = f(1) = 3, \quad \lim_{x \to 1^+} g(x) = f(1+a) - b \implies b = f(1+a) - 3
      - stepTitle: 'Step 3. 교점 개수 $h(t)$가 1곳에서만 불연속인 조건'
        explanation: |-
          $x < 1$에서 $g(x)=f(x)$는 단조증가하며 치역은 $(-\infty, 3)$입니다. $x \ge 1$에서 $g(x)$가 다시 극값을 가지면 $h(t)$의 불연속점이 2개 이상 발생하므로, $f(x+a)$의 극점 구간 $[1, 2]$가 $x \ge 1$ 영역에 들어오지 않거나, 접하는 지점이 일치해야 합니다. 자연수 $a$에 대해 $1+a \ge 2$이므로 $x \ge 1$에서 $x+a \ge 2$가 되어 극대/극소의 위치를 추적합니다.
        mathLatex: |-
          a=2 \implies f(1+2)-3 = f(3)-3 = 7-3 = 4 \implies b=4
      - stepTitle: 'Step 4. $a+b$ 산출'
        explanation: |-
          $a=2, b=4$일 때 $a+b=6$입니다.
        mathLatex: |-
          a+b = 2 + 4 = 6
  - type: shortcut
    title: 시험장 숏컷 풀이 (극대점 잘라붙이기 & 평행이동 관찰)
    summary: '$f(x)$의 극점이 $x=1, 2$라는 점과 $a$가 자연수라는 점을 이용해 $a=1, 2, 3$을 그래프 잘라붙이기로 2분 만에 판별'
    calculationLoad: 소 (매우 적음)
    difficultyRating: 3.2
    recommendationScore: 4.8
    estimatedMinutes: 3
    verdict: 객관식 및 시간 단축에 가장 탁월한 실전형 직관 해법
    steps:
      - stepTitle: 'Step 1. $x=1$이 극대점임을 즉시 캐치'
        explanation: |-
          $f(x)$는 $x=1$에서 극대, $x=2$에서 극소입니다. $x < 1$은 극대점 직전까지의 오르막 곡선입니다.
        tip: 연결 지점 $x=1$이 원래 함수의 극대점이라는 사실이 문제의 강력한 힌트입니다.
      - stepTitle: 'Step 2. $x \ge 1$ 곡선이 극소를 갖지 않는 조건'
        explanation: |-
          우측에 이어붙일 곡선이 아래로 꺼졌다가 올라오면 $h(t)$의 불연속점이 최소 2개가 됩니다. 따라서 이어붙이는 시작점 $1+a$는 극솟값 $x=2$를 이미 지나친 오르막 구간이어야 합니다. 따라서 $1+a \ge 3$, 즉 $a \ge 2$입니다.
        mathLatex: |-
          a \ge 2 \implies 1+a=3 \implies a=2
      - stepTitle: 'Step 3. 연속성으로 $b$ 즉시 결정'
        explanation: |-
          $b = f(3) - 3 = 7 - 3 = 4$이므로 $a+b = 2 + 4 = 6$ 바로 도출.
        mathLatex: |-
          a+b = 6
  - type: geometric
    title: 기하적 풀이 (그래프 개형 이동 및 $y=t$ 수평선 스캔)
    summary: '좌측 조각과 우측 조각이 만나는 관절(Joint)에서 $y=t$ 라인을 아래에서 위로 스위핑하며 교점 수 변화를 추적'
    calculationLoad: 소 (매우 적음)
    difficultyRating: 3.4
    recommendationScore: 4.6
    estimatedMinutes: 4
    diagramId: cubic-joint
    verdict: 불연속점의 원인이 되는 수평 접선 및 국소 극값을 시각적으로 이해하는 데 가장 유용
    steps:
      - stepTitle: 'Step 1. $y=g(x)$의 분할 그래프 시각화'
        explanation: |-
          $x=1$을 경계선으로 좌측은 $f(x)$, 우측은 $f(x)$를 $x$축 음의 방향으로 $a$, $y$축 음의 방향으로 $b$만큼 평행이동한 형태입니다.
      - stepTitle: 'Step 2. 스위핑 라인 $y=t$와의 교점 추적'
        explanation: |-
          함수가 오직 단조증가형 형태를 유지할 때만 수평선과의 교점이 항상 1개로 유지되다가 경계 높이에서 순간적 변화만 갖게 됩니다.
prerequisites:
  - name: 구간별 함수의 연속성
    subject: 미적분 I
    description: '경계점 $x=c$에서 좌극한과 우극한, 함숫값이 일치해야 연속이다.'
    importance: 필수
  - name: 삼차함수의 도함수와 극값
    subject: 미적분 I
    description: "$f'(x)=0$의 두 실근에서 극대와 극소를 판별하는 원리."
    importance: 필수
relatedProblems:
  - id: 2023-csat-math-14
    examTitle: 2023학년도 수능 수학 공통 14번
    year: 2023
    problemNumber: 14
    subject: 미적분 I
    similarityReason: 연속함수와 직선 교점 개수 함수의 불연속점 추론 유형
createdAt: '2023-11-20'
updatedAt: '2026-02-14'
reviewedBy: 수능수학 다각도해법 연구회
---

두 자연수 $a, b$와 삼차함수 $f(x) = 2x^3 - 9x^2 + 12x - 2$에 대하여 실수 전체의 집합에서 연속인 함수 $g(x)$가
$$g(x) = \begin{cases} f(x) & (x < 1) \\ f(x+a) - b & (x \ge 1) \end{cases}$$
이다. 직선 $y=t$와 함수 $y=g(x)$의 그래프가 만나는 서로 다른 점의 개수를 $h(t)$라 할 때, 함수 $h(t)$가 $t=k$에서만 불연속이 되도록 하는 $a+b$의 값을 구하시오.
