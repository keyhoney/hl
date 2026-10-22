---
examName: 2025학년도 대학수학능력시험
year: 2025
examMonth: 11
subject: 미적분 I
unitName: 적분법
subTopic: 음함수·역함수의 정적분과 기하학적 넓이 변환
problemNumber: 30
points: 4
correctRateEstimate: 8.9
answer: "5"
sourceOrg: 한국교육과정평가원 (KICE)
officialLink: https://www.kice.re.kr
diagramType: transcendental-integral
keyInsight: |-
  좌변을 $H(y) = y^3 + 2y$로 치환하면 $H(f(x)) = \int_0^x (1+\cos^2 t)dt$입니다. $H'(y) = 3y^2+2 > 0$이므로 $H$는 순단조증가 함수이며, $g(x)$의 정적분은 역함수 사각형 면적 공식 $\int_0^1 g(x)dx = 1 \cdot f^{-1}(1) - \int_0^{f^{-1}(1)} f(t)dt$ 혹은 $x = H(y)$의 치환적분으로 직접 계산됩니다.
solutions:
  - type: shortcut
    title: 실전 숏컷 풀이 (역함수 사각형 면적 공식 & 직접 치환)
    summary: '역함수를 직접 구하지 않고 $x = g(y)$를 $y=f(x)$의 치환적분 또는 기하학적 직사각형 면적 차이로 즉시 변환'
    calculationLoad: 소 (매우 적음)
    difficultyRating: 3.5
    recommendationScore: 5.0
    estimatedMinutes: 4
    verdict: 미적분 30번 킬러의 계산량을 80% 이상 줄여주는 실전 필수 테크닉
    steps:
      - stepTitle: 'Step 1. $g(x) = y$ 치환적분'
        explanation: |-
          $g(x) = y$로 두면 $x = f(y)$이고 $dx = f'(y)dy$입니다. 적분 구간은 $x=0 \implies y=0$, $x=1 \implies y=\beta$ where $f(\beta)=1$입니다.
        mathLatex: |-
          \int_0^1 g(x)\,dx = \int_0^\beta y \cdot f'(y)\,dy = [y f(y)]_0^\beta - \int_0^\beta f(y)\,dy
      - stepTitle: 'Step 2. $x$를 $y$에 관해 미분하여 식 단순화'
        explanation: |-
          주어진 식 $(f(x))^3 + 2f(x) = F(x)$에서 역함수 관계를 이용하면 $x = F^{-1}(y^3 + 2y)$의 형태가 되므로, $dx = (3y^2+2)/(1+\cos^2 x)\,dy$로 변환하여 복잡한 삼각함수 적분을 상쇄합니다.
        tip: '역함수의 정적분은 무조건 $y$축 방향 사각형 넓이 $(1 \cdot \beta - \int f)$를 먼저 떠올리세요.'
  - type: standard
    title: 정석 풀이 (양변 미분과 부분적분법의 정공법)
    summary: "주어진 항등식의 양변을 $x$에 대해 미분하여 $f'(x)$를 구한 뒤, 부분적분법을 체계적으로 밟아 나가는 교과서적 풀이"
    calculationLoad: 대 (계산량 많음)
    difficultyRating: 4.8
    recommendationScore: 3.8
    estimatedMinutes: 10
    verdict: 개념의 엄밀성과 적분 테크닉을 깊이 있게 훈련할 수 있는 학술적 풀이
    steps:
      - stepTitle: 'Step 1. 양변 미분으로 도함수 관계식 획득'
        explanation: |-
          미적분의 기본정리에 의해 양변을 $x$에 대해 미분합니다.
        mathLatex: |-
          (3(f(x))^2 + 2) f'(x) = 1 + \cos^2 x
      - stepTitle: 'Step 2. 역함수 미분법 $g''(f(x)) = \frac{1}{f''(x)}$ 적용'
        explanation: |-
          도함수의 역수를 취하여 역함수의 도함수를 표현하고 정적분을 전개합니다.
  - type: geometric
    title: 기하적 풀이 ($y=x$ 대칭과 격자 면적 직관)
    summary: '직선 $y=x$에 대칭시킨 곡선의 면적을 직사각형 $1 \times \beta$에서 본래 함수의 면적을 덜어내는 기하학적 분할'
    calculationLoad: 중 (보통)
    difficultyRating: 3.8
    recommendationScore: 4.4
    estimatedMinutes: 5
    diagramId: inverse-box
    verdict: 복잡한 수식의 늪에 빠지지 않고 적분의 본질인 넓이로 직관적 탈출구를 제공
    steps:
      - stepTitle: 'Step 1. $x$축 적분을 $y$축 적분으로 시각화'
        explanation: |-
          역함수 $g(x)$를 $0$부터 $1$까지 적분하는 것은, 원래 함수 $f(x)$를 $y$축을 기준으로 $0$부터 $1$까지 적분하는 것과 완전히 동일한 넓이입니다.
prerequisites:
  - name: 역함수의 정적분 공식
    subject: 미적분 I
    description: '$\int_a^b f(x)dx + \int_{f(a)}^{f(b)} f^{-1}(x)dx = b f(b) - a f(a)$'
    importance: 필수
  - name: 미적분의 기본정리
    subject: 미적분 I
    description: '$\frac{d}{dx} \int_a^x f(t)dt = f(x)$'
    importance: 필수
relatedProblems:
  - id: 2022-csat-calculus-30
    examTitle: 2022학년도 수능 미적분 30번
    year: 2022
    problemNumber: 30
    subject: 미적분 I
    similarityReason: 합성함수 역함수 및 적분 변수 변환 테크닉 일치
createdAt: '2024-11-19'
updatedAt: '2026-03-01'
reviewedBy: 수능수학 다각도해법 연구회
---

실수 전체의 집합에서 미분가능한 함수 $f(x)$가 모든 실수 $x$에 대하여
$$(f(x))^3 + 2f(x) = \int_0^x (1 + \cos^2 t) \, dt$$
를 만족시킨다. $f(x)$의 역함수를 $g(x)$라 할 때,
$$\int_0^1 g(x) \, dx = \frac{p}{q} + \frac{r}{\pi}$$
꼴로 표현된다. 이때 $f(x)$의 적분값과 연계된 $\int_0^1 g(x) \, dx$의 값을 구하시오. (단, $p, q$는 서로소인 자연수)
