# 📹 n8n Blog to YouTube Shorts

블로그 글을 자동으로 유튜브 숏츠로 변환하는 n8n 커스텀 노드

## 🎯 주요 기능

- ✅ 블로그 URL 또는 텍스트 입력 지원
- ✅ 자동 텍스트 정리 및 요약
- ✅ 숏츠 최적 길이로 자동 조정 (60초 기준)
- ✅ 자막용 세그먼트 자동 분할
- ✅ 다국어 지원 (한국어, 영어, 일본어)
- ✅ CSS 셀렉터로 유연한 콘텐츠 추출

## 📦 설치 방법

### 1. 환경 변수로 설치 (가장 쉬움!)

```bash
# n8n 중지 (Ctrl+C)

# 커스텀 노드 경로 지정하여 재시작
N8N_CUSTOM_EXTENSIONS="/home/user/youtube" n8n start
```

### 2. 설치 확인

1. n8n 웹 인터페이스 접속
2. 새 워크플로우 생성 → 노드 추가(+)
3. **"Blog to Shorts"** 검색
4. 노드 추가 성공! 🎉

## 🚀 빠른 시작

### 기본 워크플로우 구조

```
[Webhook/Schedule]
    ↓
[Blog to Shorts]  ← 블로그를 숏츠 스크립트로 변환
    ↓
[Google TTS]      ← 텍스트를 음성으로 변환
    ↓
[SB Render]       ← 음성 + 배경 + 자막 합성
    ↓
[YouTube Upload]  ← 유튜브에 업로드
```

### Blog to Shorts 노드 설정 예시

**URL로 블로그 가져오기:**
```
Input Type: URL
Blog URL: https://myblog.com/amazing-post
Content Selector: article, .post-content, main
Max Characters: 300
Split into Segments: Yes
Segment Length: 50
Language: 한국어
```

**직접 텍스트 입력:**
```
Input Type: Text
Blog Text: [여기에 블로그 내용 붙여넣기]
Max Characters: 300
Split into Segments: Yes
Language: 한국어
```

## 📊 출력 데이터

노드는 다음과 같은 JSON 데이터를 출력합니다:

```json
{
  "content": "변환된 최종 텍스트 (300자 이내)",
  "originalLength": 1250,
  "language": "ko",
  "metadata": {
    "maxChars": 300,
    "truncated": true
  },
  "segments": [
    {"text": "안녕하세요. 오늘은 블로그를", "order": 0},
    {"text": "유튜브 숏츠로 만드는 방법을", "order": 1},
    {"text": "소개하려고 합니다.", "order": 2}
  ],
  "segmentCount": 3
}
```

**다음 노드에서 사용:**
- `{{ $json.content }}` - 전체 텍스트 (TTS 입력용)
- `{{ $json.segments }}` - 세그먼트 배열 (자막용)
- `{{ $json.language }}` - 언어 코드

## 🔗 다른 노드와 연결

### 1. TTS (Text-to-Speech) 연결

**Google TTS 사용 예시:**
```javascript
// HTTP Request 노드
POST https://texttospeech.googleapis.com/v1/text:synthesize

Body:
{
  "input": {
    "text": "{{ $json.content }}"
  },
  "voice": {
    "languageCode": "{{ $json.language }}-KR",
    "name": "{{ $json.language }}-KR-Standard-A"
  },
  "audioConfig": {
    "audioEncoding": "MP3"
  }
}
```

### 2. SB Render 연결

sb-render 노드를 사용하여 최종 비디오 생성:

```
Video Source: URL
Video URL: [배경 영상 URL]
Audio Source: Previous Node
Subtitle Source: Manual
Subtitle Content: {{ $json.segments }}
```

## 🛠️ 개발

```bash
# 의존성 설치
npm install

# 빌드
npm run build

# 개발 모드 (watch)
npm run dev
```

## 📁 프로젝트 구조

```
/home/user/youtube/
├── nodes/
│   └── BlogToShorts/
│       └── BlogToShorts.node.ts    # 메인 노드
├── dist/                            # 빌드 결과물
├── reference-sb-render/             # 참고: 비디오 렌더링 노드
├── reference-sb-youtube/            # 참고: 유튜브 자막 노드
├── package.json
├── tsconfig.json
├── README.md                        # 이 파일
└── SETUP_GUIDE.md                   # 상세 설치 가이드
```

## 🐛 문제 해결

### "노드가 안 보여요"

```bash
# 1. 빌드 확인
cd /home/user/youtube
npm run build

# 2. 환경 변수 확인
echo $N8N_CUSTOM_EXTENSIONS

# 3. n8n 재시작
```

### "블로그 내용을 못 가져와요"

1. 블로그 페이지를 브라우저에서 열기
2. F12 (개발자 도구) → Elements
3. 실제 글 내용이 있는 HTML 요소 찾기
4. 해당 요소의 클래스나 ID 확인
5. Content Selector에 입력 (예: `.post-body, #content`)

### "텍스트가 너무 잘려요"

- `Max Characters` 값을 늘리기 (300 → 500)
- 60초 영상: 약 300자
- 90초 영상: 약 450자

## 💡 활용 예시

### 1. 매일 자동으로 블로그 → 숏츠

```
[Schedule Trigger: 매일 09:00]
    → [RSS Feed: 블로그 RSS]
    → [Blog to Shorts]
    → [Google TTS]
    → [SB Render]
    → [YouTube Upload]
```

### 2. 웹훅으로 즉시 변환

```
[Webhook Trigger]
    → [Blog to Shorts]
    → [Slack: 완료 알림]
```

### 3. 여러 블로그 한 번에 처리

```
[Manual Trigger]
    → [Code: URL 배열 생성]
    → [Loop Over Items]
    → [Blog to Shorts]
    → [Aggregate: 결과 수집]
```

## 📚 참고 자료

- [n8n 공식 문서](https://docs.n8n.io/)
- [커스텀 노드 개발 가이드](https://docs.n8n.io/integrations/creating-nodes/)
- [sb-render GitHub](https://github.com/choisb87/sb-render)
- [sb-youtube GitHub](https://github.com/choisb87/sb-youtube)

## 📄 라이선스

MIT License

## 🤝 기여

이슈와 PR을 환영합니다!

---

**만든이:** Claude Code 🤖
**버전:** 0.1.0
