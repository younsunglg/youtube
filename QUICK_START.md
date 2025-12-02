# ⚡ 빠른 시작 가이드

**5분만에 블로그를 유튜브 숏츠로 만들기!**

---

## 🚀 설치 및 시작 (2분)

### 1️⃣ 모든 노드 설치

```bash
cd /home/user/youtube
./install-all-nodes.sh
```

**기다리는 동안:** ☕ 커피 한 잔

### 2️⃣ n8n 시작

```bash
./start-n8n.sh
```

### 3️⃣ 브라우저에서 n8n 열기

터미널에 표시된 URL을 **Ctrl+클릭**:
```
https://xxx.hooks.n8n.cloud
```

---

## 📥 워크플로우 Import (1분)

n8n에서 처음부터 만들지 말고 **미리 만들어진 워크플로우를 import** 하세요!

### 방법 1: 웹에서 Import

1. n8n 왼쪽 메뉴 **Workflows** 클릭
2. 오른쪽 상단 **⋮** (점 3개) 클릭
3. **Import from File** 선택
4. 파일 선택:
   - 테스트용: `workflow-1-test.json`
   - 동영상 제작용: `workflow-2-video-creation.json`

### 방법 2: 파일 내용 복사

1. n8n에서 **+ New Workflow** 클릭
2. 오른쪽 상단 **⋮** → **Import from URL or File**
3. 아래 파일 중 하나 복사해서 붙여넣기:

```bash
# 테스트용
cat /home/user/youtube/workflow-1-test.json

# 동영상 제작용
cat /home/user/youtube/workflow-2-video-creation.json
```

---

## 🧪 테스트 실행 (1분)

### 워크플로우 1: Blog to Shorts 테스트

**목적:** 노드가 제대로 작동하는지 확인

1. `workflow-1-test.json` import
2. 상단 **Execute Workflow** 버튼 (▶️) 클릭
3. 결과 확인:
   ```json
   {
     "content": "안녕하세요! 오늘은 AI를...",
     "segments": [...],
     "segmentCount": 5
   }
   ```

**✅ 성공!** 이제 동영상을 만들어봅시다!

---

## 🎥 동영상 제작 (1분)

### 워크플로우 2: 블로그 → 숏츠 동영상

**목적:** 실제 MP4 파일 생성

1. `workflow-2-video-creation.json` import
2. (선택) 블로그 텍스트 수정:
   - **"1. 블로그 → 스크립트"** 노드 더블클릭
   - `Blog Text` 필드에 원하는 내용 입력
3. 상단 **Execute Workflow** 버튼 (▶️) 클릭
4. 기다리기... (10~30초)
5. 완료!

### 결과 확인

```bash
# 터미널에서
ls -lh /tmp/shorts_*.mp4

# 최신 파일 찾기
ls -lt /tmp/shorts_*.mp4 | head -1

# 재생 (VLC가 설치되어 있다면)
vlc /tmp/shorts_$(date +%Y%m%d)*.mp4
```

**✨ 축하합니다! 첫 숏츠를 만들었어요! 🎉**

---

## 🎨 커스터마이징

### 본인의 블로그 사용하기

**"1. 블로그 → 스크립트"** 노드에서:
```
Input Type: URL
Blog URL: https://your-blog.com/post
Content Selector: article, .post-content
```

### 본인의 이미지 사용하기

**"2. 배경 이미지 다운로드"** 노드를 삭제하고:

1. **Read Binary File** 노드 추가
2. File Path: `/path/to/your/image.jpg`
3. **"1. 블로그 → 스크립트"**와 연결

### 자막 스타일 변경

**"3. 동영상 생성"** 노드에서:
```
Font Size: 80  (더 크게)
Font Color: #FFD700  (금색)
Background Opacity: 0.5  (더 투명하게)
```

---

## ⚠️ 자주 발생하는 문제

### "SB Render 노드가 없어요"

```bash
# 설치 스크립트 다시 실행
./install-all-nodes.sh

# n8n 재시작
./start-n8n.sh
```

### "동영상 생성 실패"

**FFmpeg 설치 확인:**
```bash
ffmpeg -version
```

**없으면 설치:**
```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg
```

### "파일을 찾을 수 없어요"

```bash
# 저장 경로 확인
ls -la /tmp/

# 디스크 공간 확인
df -h /tmp
```

---

## 📊 워크플로우 구조 이해하기

### 워크플로우 1: 테스트
```
[시작] → [Blog to Shorts] → [결과 확인]
```

### 워크플로우 2: 동영상 제작
```
[시작]
  ↓
[블로그 → 스크립트]  ← 텍스트 정리 및 세그먼트 분할
  ↓
[배경 이미지]         ← 1080x1920 세로 이미지
  ↓
[동영상 생성]         ← 이미지 + 자막 합성 (10초)
  ↓
[파일 저장]           ← /tmp/shorts_날짜.mp4
```

---

## 🎯 다음 단계

### 레벨 1: 기본 ✅
- [x] 노드 설치
- [x] 테스트 실행
- [x] 동영상 생성

### 레벨 2: 커스터마이징
- [ ] 본인 블로그 URL 사용
- [ ] 본인 이미지 사용
- [ ] 자막 스타일 변경

### 레벨 3: 고급
- [ ] TTS로 음성 추가
- [ ] 여러 이미지로 슬라이드쇼
- [ ] YouTube 자동 업로드

### 레벨 4: 자동화
- [ ] 스케줄 자동 실행 (매일 자동)
- [ ] RSS Feed 연동
- [ ] 웹훅 트리거

---

## 📚 상세 가이드

더 자세한 내용은 다음 문서를 참고하세요:

- **BEGINNER_GUIDE.md**: n8n 완전 초보자 가이드
- **STEP_BY_STEP.md**: 단계별 상세 실행 가이드
- **README.md**: 프로젝트 전체 개요
- **SETUP_GUIDE.md**: 기술적인 설정 가이드

---

## 💬 도움 요청

막히는 부분이 있으면:

1. 에러 메시지 캡처
2. 어느 단계에서 문제가 생겼는지
3. 터미널 로그 복사

**예시:**
```
"3. 동영상 생성" 노드 실행 시 에러 발생
에러 메시지: "FFmpeg not found"
터미널 로그: [로그 붙여넣기]
```

---

## ⏱️ 예상 소요 시간

| 단계 | 시간 |
|------|------|
| 설치 | 2분 |
| Import | 1분 |
| 테스트 | 1분 |
| 동영상 제작 | 1분 |
| **총** | **5분** ⚡ |

---

**작성:** Claude Code
**업데이트:** 2025-12-02
