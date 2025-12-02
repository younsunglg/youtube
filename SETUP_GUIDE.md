# Blog to Shorts - n8n 커스텀 노드 설치 가이드

## 📦 완료된 작업

✅ **Blog to Shorts** 커스텀 노드 개발 완료
- 블로그 URL 또는 텍스트를 입력받아 숏츠용 스크립트로 변환
- 자동 텍스트 정리 및 길이 제한
- 세그먼트 분할 (자막 타이밍용)
- 한국어, 영어, 일본어 지원

## 🔧 n8n에 설치하는 방법

### 방법 1: 환경 변수로 커스텀 노드 경로 지정 (권장)

n8n을 실행할 때 `N8N_CUSTOM_EXTENSIONS` 환경 변수를 설정합니다:

```bash
# 현재 터미널에서 n8n 중지 (Ctrl+C)

# 커스텀 노드 경로 지정하여 n8n 재시작
export N8N_CUSTOM_EXTENSIONS="/home/user/youtube"
n8n start
```

또는 한 줄로:

```bash
N8N_CUSTOM_EXTENSIONS="/home/user/youtube" n8n start
```

### 방법 2: .n8n 디렉토리에 심볼릭 링크 생성

```bash
# .n8n 디렉토리 생성 (없는 경우)
mkdir -p ~/.n8n/custom

# 심볼릭 링크 생성
ln -s /home/user/youtube ~/.n8n/custom/n8n-nodes-blog-to-shorts

# n8n 재시작
```

### 방법 3: npm을 통한 글로벌 설치

```bash
# 이미 npm link를 실행했으므로, n8n 설치 디렉토리에서:
cd $(npm root -g)/../lib/node_modules/n8n
npm link n8n-nodes-blog-to-shorts

# n8n 재시작
```

## ✅ 설치 확인

1. n8n 재시작 후 웹 인터페이스 접속: https://2cp6gdgkygrxtsrklyy0apqf.hooks.n8n.cloud
2. 새 워크플로우 생성
3. 노드 추가 버튼(+) 클릭
4. "Blog to Shorts" 검색
5. 노드가 보이면 설치 성공! 🎉

## 📝 사용 예시

### 기본 워크플로우: 블로그 → 숏츠

```
[Manual Trigger]
    → [Blog to Shorts]
        → [HTTP Request - TTS API]
            → [SB Render]
                → [YouTube Upload]
```

### Blog to Shorts 노드 설정

**입력 타입: URL**
- Blog URL: `https://your-blog.com/post`
- Content Selector: `article, .post-content`
- Max Characters: `300` (60초 영상 기준)
- Split into Segments: `true`
- Segment Length: `50`
- Language: `ko` (한국어)

**입력 타입: Text**
- Blog Text: 직접 텍스트 입력
- 나머지 설정 동일

### 출력 데이터 구조

```json
{
  "originalLength": 450,
  "content": "최종 변환된 텍스트...",
  "language": "ko",
  "metadata": {
    "maxChars": 300,
    "truncated": true
  },
  "segments": [
    {"text": "첫 번째 세그먼트", "order": 0},
    {"text": "두 번째 세그먼트", "order": 1}
  ],
  "segmentCount": 2
}
```

## 🔄 다음 단계

이제 **SB Render 노드**와 연결하여 실제 비디오를 생성할 수 있습니다:

1. **TTS (Text-to-Speech)** 노드 추가
   - Google TTS, Azure TTS, ElevenLabs 등
   - Blog to Shorts의 `content` 또는 `segments`를 음성으로 변환

2. **SB Render 노드** 사용
   - 참고: `reference-sb-render` 디렉토리의 노드
   - 음성 + 배경 이미지/영상 + 자막 합성

3. **YouTube 업로드** (선택)
   - YouTube Data API v3 사용

## 🐛 문제 해결

### "Blog to Shorts 노드가 안 보여요"

1. n8n 로그 확인:
```bash
# n8n 실행 터미널에서 에러 메시지 확인
```

2. 빌드 재실행:
```bash
cd /home/user/youtube
npm run build
```

3. n8n 완전히 재시작

### "CSS Selector로 내용을 못 가져와요"

1. 블로그의 HTML 구조 확인
2. 개발자 도구(F12)로 실제 컨텐츠가 들어있는 요소 찾기
3. Content Selector에 해당 CSS 선택자 입력 (예: `.entry-content, #post-body`)

## 📚 추가 참고

- n8n 공식 문서: https://docs.n8n.io/
- 커스텀 노드 개발: https://docs.n8n.io/integrations/creating-nodes/
- sb-render 참고: `/home/user/youtube/reference-sb-render`
- sb-youtube 참고: `/home/user/youtube/reference-sb-youtube`
