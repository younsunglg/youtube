# 📋 단계별 실행 가이드

블로그를 유튜브 숏츠로 만드는 **완벽한 실행 가이드**입니다.
이 가이드를 **순서대로** 따라하시면 동영상 제작까지 성공할 수 있습니다! 🎯

---

## 🎬 최종 목표

```
블로그 글 입력
    ↓
텍스트 정리 및 요약
    ↓
음성 파일 (TTS 또는 기존 MP3)
    ↓
배경 영상/이미지와 합성
    ↓
✨ 유튜브 숏츠 동영상 완성! ✨
```

---

## ⚙️ STEP 1: 모든 노드 설치하기 (5분)

### 1-1. 터미널 열기

현재 터미널에서 **Ctrl+C**를 눌러 n8n을 중지하세요.

### 1-2. 설치 스크립트 실행

```bash
cd /home/user/youtube
./install-all-nodes.sh
```

**설치되는 것들:**
- ✅ Blog to Shorts (우리가 만든 노드)
- ✅ SB Render (동영상 렌더링)
- ✅ SB YouTube (유튜브 자막 추출)

**예상 소요 시간:** 3~5분

### 1-3. 설치 확인

설치가 끝나면 이런 메시지가 보여야 합니다:
```
✅ 모든 노드 설치 완료!

📝 설치된 노드:
   1. Blog to Shorts (블로그 → 스크립트)
   2. SB Render (동영상 렌더링)
   3. SB YouTube (유튜브 자막 추출)
```

---

## 🚀 STEP 2: n8n 재시작 (1분)

### 2-1. 커스텀 노드 포함해서 n8n 시작

```bash
./start-n8n.sh
```

**또는 직접 명령어 입력:**
```bash
N8N_CUSTOM_EXTENSIONS="/home/user/youtube:/home/user/youtube/reference-sb-render:/home/user/youtube/reference-sb-youtube" n8n start
```

### 2-2. n8n 접속

터미널에 표시된 URL을 브라우저에서 열기:
```
Editor is now accessible via: https://xxx.hooks.n8n.cloud
```

**Ctrl+클릭**하면 바로 열립니다!

---

## 🧪 STEP 3: 간단한 테스트 (5분)

동영상 만들기 전에 먼저 각 노드가 제대로 작동하는지 확인해봅시다.

### 3-1. 새 워크플로우 만들기

1. n8n 웹 인터페이스에서 **+ New Workflow** 클릭
2. 워크플로우 이름: `테스트 - Blog to Shorts`

### 3-2. Manual Trigger 추가

1. 캔버스 중앙 **➕** 버튼 클릭
2. 검색: `manual`
3. **Manual Trigger** 선택

### 3-3. Blog to Shorts 노드 추가

1. Manual Trigger 노드의 오른쪽 **➕** 클릭
2. 검색: `blog to shorts`
3. **Blog to Shorts** 선택

**❗ 안 보이나요?**
- n8n을 제대로 재시작했는지 확인
- 터미널에서 에러 메시지가 없는지 확인
- 브라우저 새로고침 (Ctrl+R)

### 3-4. Blog to Shorts 설정

노드를 더블클릭해서 설정:

```
Input Type: Text

Blog Text:
안녕하세요! 오늘은 AI를 활용한 자동화에 대해 이야기해보겠습니다.
n8n을 사용하면 코딩 없이도 복잡한 작업을 자동화할 수 있습니다.
특히 블로그를 유튜브 숏츠로 변환하는 것도 가능합니다!

Max Characters: 200
Split into Segments: Yes
Segment Length: 40
Language: 한국어
```

### 3-5. 실행 및 결과 확인

1. 노드 설정 패널에서 **Execute Node** 버튼 클릭
2. 결과 확인:

```json
{
  "content": "안녕하세요! 오늘은 AI를 활용한...",
  "segments": [
    {"text": "안녕하세요! 오늘은 AI를 활용한 자동화에", "order": 0},
    {"text": "대해 이야기해보겠습니다. n8n을 사용하면", "order": 1}
  ],
  "segmentCount": 4
}
```

**✅ 성공!** 이제 동영상 제작으로 넘어갑시다!

---

## 🎥 STEP 4: 동영상 제작 워크플로우 (10분)

### 4-1. 워크플로우 구조

```
[Manual Trigger]
    ↓
[Blog to Shorts]        ← 블로그를 스크립트로 변환
    ↓
[HTTP Request]          ← 샘플 이미지 다운로드
    ↓
[SB Render]             ← 이미지 → 동영상 (자막 포함)
    ↓
[Write Binary File]     ← 로컬에 MP4 저장
```

### 4-2. 각 노드 추가 및 설정

#### ① Manual Trigger
- 설정 없음 (그냥 추가만)

#### ② Blog to Shorts
```
Input Type: Text
Blog Text: [여기에 원하는 텍스트 입력]
Max Characters: 200
Split into Segments: Yes
Segment Length: 30
Language: 한국어
```

#### ③ HTTP Request (샘플 이미지 다운로드)
```
Method: GET
URL: https://picsum.photos/1080/1920
Response Format: File
Binary Property: data
```

**무슨 뜻인가요?**
- 랜덤 이미지를 1080x1920 (세로 영상) 크기로 다운로드합니다
- 실제로는 본인의 이미지를 사용하면 됩니다

#### ④ SB Render (동영상 생성)

**중요한 설정들:**

```
Resource: Video
Operation: Image To Video

=== 이미지 설정 ===
Image Source: Previous Node
Binary Property: data

=== 비디오 설정 ===
Duration (seconds): 10
Output Width: 1080
Output Height: 1920

=== 자막 설정 ===
Enable Subtitles: Yes
Subtitle Source: Manual Input
Subtitle Text: {{ $node["Blog to Shorts"].json["content"] }}

Font Size: 60
Font Color: #FFFFFF
Background Color: #000000
Background Opacity: 0.7

=== 출력 설정 ===
Output Format: mp4
Video Quality: high
```

**자막을 세그먼트별로 넣으려면:**
```
Subtitle Source: JSON Array
Subtitle JSON: {{ $node["Blog to Shorts"].json["segments"] }}
```

#### ⑤ Write Binary File (파일 저장)

```
File Name: shorts_{{ $now.format("yyyyMMdd_HHmmss") }}.mp4
Data Property Name: data
Output File Path: /tmp/
```

**결과:** `/tmp/shorts_20251202_143022.mp4` 같은 파일이 생성됩니다

### 4-3. 노드 연결하기

각 노드의 오른쪽 점을 드래그해서 다음 노드와 연결:
```
[Manual Trigger] ● ━━> ● [Blog to Shorts]
                         ● ━━> ● [HTTP Request]
                                ● ━━> ● [SB Render]
                                       ● ━━> ● [Write Binary File]
```

### 4-4. 실행!

1. 상단 **Execute Workflow** 버튼 클릭 (▶️)
2. 각 노드가 초록색으로 바뀌면서 실행됨
3. 마지막 노드까지 완료되면 끝!

### 4-5. 결과 확인

```bash
# 터미널에서 확인
ls -lh /tmp/shorts_*.mp4

# 동영상 재생 (VLC 등)
vlc /tmp/shorts_*.mp4
```

**✅ 축하합니다! 첫 숏츠 동영상을 만들었어요! 🎉**

---

## 🎨 STEP 5: 커스터마이징 (선택)

### 5-1. 본인의 배경 이미지 사용하기

**HTTP Request 노드 대신:**

1. **Read Binary File** 노드 사용
2. File Path: `/home/user/my-background.jpg`

### 5-2. 블로그 URL에서 직접 가져오기

Blog to Shorts 노드 설정:
```
Input Type: URL
Blog URL: https://your-blog.com/post-123
Content Selector: article, .post-content
```

### 5-3. 실제 TTS 사용하기 (음성 추가)

**무료 옵션:**
- Google Cloud TTS (매월 $300 무료 크레딧)
- gTTS (Python 라이브러리, 완전 무료)

**워크플로우:**
```
[Blog to Shorts]
    ↓
[Code Node - Python gTTS]
    ↓
[SB Render] ← 이미지 + 음성 + 자막
```

### 5-4. 여러 이미지로 슬라이드쇼

**SB Render의 Merge 기능 사용:**
```
Operation: Merge
Videos to Merge: [video1.mp4, video2.mp4, video3.mp4]
```

---

## 🔄 STEP 6: 자동화 설정 (선택)

### 6-1. 스케줄 자동 실행

Manual Trigger 대신 **Schedule Trigger** 사용:
```
Trigger Interval: 매일
Time: 09:00 AM
```

**결과:** 매일 오전 9시에 자동으로 숏츠 생성!

### 6-2. RSS Feed 연동

```
[RSS Feed Trigger] ← 블로그 RSS
    ↓
[Filter] ← 새 글만 선택
    ↓
[Blog to Shorts]
    ↓
...
```

### 6-3. 웹훅으로 트리거

```
[Webhook Trigger]
    ↓
[Blog to Shorts]
    ↓
...
```

**사용 예:**
```bash
curl -X POST https://your-webhook-url.hooks.n8n.cloud \
  -H "Content-Type: application/json" \
  -d '{"blogUrl": "https://myblog.com/new-post"}'
```

---

## 🐛 STEP 7: 문제 해결

### "SB Render 노드가 안 보여요"

```bash
cd /home/user/youtube/reference-sb-render
npm run build
npm link

# n8n 재시작
```

### "동영상 생성 중 에러가 나요"

**확인 사항:**
1. FFmpeg 설치되어 있나요?
   ```bash
   ffmpeg -version
   ```
2. 이미지 파일이 제대로 다운로드되었나요?
   - HTTP Request 노드의 OUTPUT 확인
3. 메모리가 충분한가요?
   - 최소 2GB RAM 필요

### "자막이 안 보여요"

**SB Render 설정 확인:**
- Enable Subtitles: **Yes** 체크
- Font Size: 60 이상 (작으면 안 보임)
- Font Color: 배경과 대비되는 색상

### "파일을 찾을 수 없어요"

```bash
# 저장 경로 확인
ls -la /tmp/shorts_*.mp4

# 권한 문제인 경우
sudo chmod 755 /tmp/shorts_*.mp4
```

---

## 📊 STEP 8: 결과 예시

### 입력 (Blog Text)
```
안녕하세요! 오늘은 AI 자동화에 대해 알아봅니다.
n8n을 사용하면 코딩 없이도 강력한 자동화가 가능합니다.
```

### 출력 (동영상)
```
🎬 shorts_20251202_150000.mp4
   ├─ 길이: 10초
   ├─ 해상도: 1080x1920 (세로)
   ├─ 자막: 한글, 60pt, 흰색
   ├─ 배경: 랜덤 이미지
   └─ 파일 크기: ~5MB
```

---

## 🎓 다음 학습 자료

1. **n8n 공식 문서**: https://docs.n8n.io/
2. **커스텀 노드 개발**: https://docs.n8n.io/integrations/creating-nodes/
3. **FFmpeg 튜토리얼**: https://ffmpeg.org/documentation.html
4. **YouTube API**: https://developers.google.com/youtube/v3

---

## ✅ 체크리스트

완료한 것들을 체크하세요:

- [ ] 모든 노드 설치 완료
- [ ] n8n 재시작 완료
- [ ] Blog to Shorts 테스트 성공
- [ ] 동영상 제작 워크플로우 완성
- [ ] 첫 숏츠 동영상 생성 성공!
- [ ] 결과물 확인 완료

**모두 체크했나요? 축하합니다! 🎉**

---

## 💬 질문이나 문제가 있나요?

1. 터미널 로그 캡처
2. n8n 워크플로우 스크린샷
3. 에러 메시지 전문
4. 어떤 단계에서 막혔는지

위 정보를 알려주시면 도와드릴게요!

---

**작성자:** Claude Code
**최종 업데이트:** 2025-12-02
**버전:** 1.0
