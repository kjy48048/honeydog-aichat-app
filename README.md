# 허니도그 AI챗 앱

"허니도그AI챗"은 사용자들이 가상의 도시 '허니도그 시티'의 주민 AI 캐릭터들과 대화를 나눌 수 있는 채팅 어플리케이션입니다. 
각 AI 캐릭터는 동물의 모습을 하고 있으며, 자신만의 취미, 개성, 전문 지식 등을 가지고 있어 다양한 주제에 대해 대화를 나눌 수 있습니다.
다양한 AI 캐릭터들과의 대화를 통해 사용자들에게 색다른 채팅 경험을 제공하며, 사용자들은 새로운 정보를 얻을 수 있고, 재미있는 이야기를 공유하며, 자신만의 AI를 만들고 공유함으로써 창의적인 활동을 할 수 있습니다. 
또한, 사용자들은 자신의 관심사나 궁금한 사항에 대해 AI 캐릭터들과 대화할 수 있고, 자신만의 AI 캐릭터를 생성하여 앱 내에서 다른 사용자들과 대화할 수도 있습니다. 

앱은 현재 안드로이드 비공개테스트중입니다.

허니도그AI챗 앱의 프론트엔드 앱 부분입니다.
앱화면 관련 내용과 백엔드서버와 주고받기 위한 부분이 있습니다.
AI와 채팅은 OpenAI의 Assistants Api의 내용을 사용하였습니다.

원본 앱 프로젝트를 복사한 프로젝트로, 올라와서는 안되는 개인정보 등의 내용을 삭제했기 때문에 실제로 사용하기 위해서는 수정이 필요합니다.

![Screenshot_1711780856](https://github.com/kjy48048/honeydog-aichat-server/assets/55000077/4b4f001d-d74e-4d3a-9fe8-fe1aecd5da85)
![Screenshot_1711779242](https://github.com/kjy48048/honeydog-aichat-server/assets/55000077/993814fe-a526-4c8e-8acf-172d4b85ffa5)
![Screenshot_1711779254](https://github.com/kjy48048/honeydog-aichat-server/assets/55000077/4079eb13-8743-4e04-b251-b6ffcb19eda6)

## 시작하기 & 사전 조건

- Visual Studio Code
- Android Studio (안드로이드 가상 시뮬레이터 설치하려면 필요)

리액트 네이티브 공식 환경 세팅 가이드 참고
https://reactnative.dev/docs/environment-setup

1. 프로젝트 설정 및 실행

1-1) Node.js 설치(이미 설치된 사람은 스킵)

- Node.js 홈페이지에 들어가 다운받고 설치합니다.
- 설치한 후, 정상적으로 설치되었는지 확인합니다. node -v && npm -v
- 개인적으로 여러 노드버전을 설치해서 사용하는 경우 nvm을 설치하셔도 됩니다.

1-2) JDK 11 설치

- JDK 11을 다운받고 설치한다.(11인 이유는 리액트 네이티브 공식문서에서 11을 추천)
- 환경변수를 설정한다
- 내 PC > 우클릭 속성 > 고급 시스템 설정으로 들어와서 환경변수 버튼

*변수 이름 : JAVA_HOME*
*변수 값 : JDK 설치 위치*

- 이후 시스템 변수에 Path에서 편집 버튼을 누른 후 %JAVA_HOME%\bin 추가한다.

1-3) 안드로이드 스튜디오 개발환경 세팅

※ 안드로이드 스튜디오는 안드로이드 sdk 환경설치 및 앱 실행 뒤 가상 디바이스 활성화 시켜 확인 용도를 위해 설치한다. 실제 개발은 vscode.

- 안드로이드 스튜디오 다운로드 및 설치
- 설치 마법사에서 다음 항목 옆의 상자가 모두 체크되어 있는지 확인

`Android SDK`
`Android SDK Platform`
`Android Virtual Device`

- 설치 후, 안드로이드 스튜디오를 열고 "More Actions" 버튼을 클릭한 다음 "SDK Manager"를 선택
- SDK Manager 내에서 "SDK Platforms" 탭을 선택한 다음 오른쪽 하단 모서리에 있는 "Show Package Details" 옆의 확인란을 선택
- `Android 13 (Tiramisu)`항목을 찾은 후 다음 항목이 선택되어 있는지 확인합니다.

`Android SDK Platform 33`
`Intel x86 Atom_64 System Image`
`Google APIs Intel x86 Atom System Image`

- 그런 다음 "SDK Manager" 탭을 선택하고 여기서도 "Show Package Details" 옆의 확인란을 선택.
- `Android SDK Build-Tools` `33.0.0`
- `Android SDK Command-line Tools` `10.0.0`
- `Android Emulator`
- `Android SDK Platform-Tools`
- `Google Play services` 선택사항
- `Google USB Driver`선택사항
- 마지막으로 "적용"을 클릭하여 Android SDK 및 관련 빌드 도구를 다운로드하고 설치

※ 추가로 Virtual Device Manager도 설치해야 한다.

가상 디바이스가 안 켜질 때 확인해야 할 것

- Emulated Performance → Graphics → Software - GLES 2.0
- Boot Option → Cold boot
- System Image Change → Tiramisu(Android 13.0 (Google APIs)
- 시스템 환경 변수 편집: 변수 이름 / 변수 값 → ANDROID_AVD_HOME / 유저폴더\.android\avd

3-4) 안드로이드 환경변수 세팅

- 환경변수를 설정한다
- 내 PC > 우클릭 속성 > 고급 시스템 설정으로 들어와서 환경변수 버튼

*변수 이름 : ANDROID_HOME, ANDROID_SDK_ROOT*
*변수 값 : Android SDK 설치 위치(기본 설정은 유저폴더\AppData\Local\Android\Sdk)*
- 이후 환경 변수에 Path에서 편집 버튼을 누른 후 %ANDROID_HOME%\platform-tools 추가한다.

3-5) VSCode 세팅

- VSCode를 다운받고 설치한다
- VSCode를 실행
- 소스를 가져올 경로를 세팅한다. (원하는 곳 어디든)
- F1키를 누르고 Git:Clone이라고 친다.
- 복사한 url을 붙여넣기 한다.
- 엔터를 치면 내 pc에 어디에 프로젝트 폴더를 생성할지 팝업창이 뜬다.
- VSCode 터미널로 설치한 폴더로 이동한다.
- npm install
- npm install -g react-native-cli

※ 그외 비어있는 부분(env, google ad mob id) 확인 필요 ※

## 개발 환경 설정
JDK: JDK 11
Node.js(14버전 이상)
React Native CL
## 연락처 정보

kjy48048@gmail.com
