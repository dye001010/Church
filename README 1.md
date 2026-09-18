# 개혁주의 신학 로드맵 (Expo 앱)

조직신학 96파트를 출근길에 하루 1~2파트씩 걸어가는 개인 경건생활용 앱입니다.
원래 React(웹) 프로토타입을 React Native(Expo)로 변환한 버전입니다.

## 시작하기

```bash
npm install
npx expo start
```

`npx expo start`를 실행하면 뜨는 QR코드를 휴대폰의 **Expo Go** 앱으로 스캔하면
바로 실행해볼 수 있습니다. `i`를 누르면 iOS 시뮬레이터, `a`를 누르면 Android
에뮬레이터로도 열 수 있습니다.

## 프로젝트 구조

```
reformed-theology-expo/
├── App.js                       # 화면 전환, 진도 저장, 알림 예약을 관리하는 루트 컴포넌트
├── app.json                     # Expo 앱 설정 (이름, 아이콘, 스플래시, 권한 플러그인)
├── babel.config.js
├── package.json
├── assets/                      # 앱 아이콘 · 스플래시 이미지 (직접 채워 넣어야 함)
└── src/
    ├── data/
    │   └── curriculum.js        # 96파트 전체 콘텐츠 (7대단원·24중단원)
    ├── storage/
    │   └── progress.js          # AsyncStorage 기반 진도 저장/불러오기/초기화
    ├── theme/
    │   └── colors.js            # 색상 팔레트
    ├── components/
    │   └── JourneyArc.js        # 홈 화면 상단의 여명(dawn) 진행률 시각화 (react-native-svg)
    └── screens/
        ├── HomeScreen.js
        ├── PartScreen.js
        ├── JournalScreen.js             # 나의 여정 노트 (묵상 기록)
        ├── SettingsScreen.js            # 아침 알림 설정
        ├── SectionReviewPromptScreen.js # 대단원 완주 알림
        └── SectionReviewQuizScreen.js   # 대단원 정리 퀴즈 (5문항)
```

## 웹(React) 버전과 달라진 점

- **저장소**: `window.storage` → `@react-native-async-storage/async-storage`.
  키는 `reformed_theology_progress` 하나로 완료한 파트 목록, 묵상 기록, 대단원
  정리 퀴즈 완료 여부, 알림 설정을 함께 저장합니다.
- **아이콘**: `lucide-react` → `lucide-react-native` (API가 거의 동일해서
  컴포넌트 이름만 그대로 옮겼습니다).
- **스타일**: Tailwind 클래스 → `StyleSheet.create`. 색상·간격 값은 최대한
  그대로 옮겼습니다.
- **여정 아크(SVG)**: `<svg>` → `react-native-svg`의 `Svg`/`Path`/`Circle` 등.
- **알림**: 웹 버전은 브라우저 `Notification` API를 써서 "앱이 열려있을 때만"
  동작하는 프로토타입이었지만, 이 Expo 버전은 `expo-notifications`로 **기기에
  실제로 예약된 로컬 알림**을 등록합니다. 사용자가 알림 시각을 저장하면
  `Notifications.scheduleNotificationAsync`가 매일 반복(`repeats: true`)되는
  알림을 예약하므로, 앱이 꺼져 있어도 알림이 울립니다. (알림 권한을 허용해야
  합니다.)
- **레이아웃**: 웹 버전은 "폰 목업 프레임"을 CSS로 그려서 데스크톱 브라우저
  안에 폰 화면을 흉내 냈지만, 이 앱은 실제 모바일 화면 전체를 씁니다.

## 참고 사항 / 다음 단계로 고려할 것

- `assets/icon.png`, `assets/splash.png` 등 실제 아이콘 이미지 파일은 아직
  없습니다. `app.json`이 참조하는 경로에 원하는 이미지를 넣어주세요.
- 지금은 화면 전환을 `App.js`의 `useState`로 직접 관리하는 단순한 구조입니다.
  화면이 더 늘어난다면 `@react-navigation/native`(stack navigator)로 옮기는
  것을 권장합니다.
- `gap` 스타일 속성을 사용했습니다 — React Native 0.71 이상(Expo SDK 49+)에서
  지원됩니다. 이 프로젝트의 Expo SDK 51 기준으로는 문제없이 동작합니다.
- 폰트는 시스템 `serif` 폴백을 쓰고 있습니다. 원래 웹 버전의 느낌을 더 살리고
  싶다면 `expo-font`로 별도의 세리프 폰트(예: Noto Serif KR)를 로드해서
  적용할 수 있습니다.
