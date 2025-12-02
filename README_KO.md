# 📹 블로그 → 유튜브 숏츠 자동화

n8n으로 블로그 글을 자동으로 유튜브 숏츠로 변환하는 완전 자동화 시스템

## 🎯 이 프로젝트로 할 수 있는 것

```
📝 블로그 글 작성
    ↓
🤖 자동으로 숏츠 스크립트 생성
    ↓
🎬 자동으로 동영상 제작
    ↓
📺 (선택) 유튜브에 자동 업로드
```

**소요 시간:** 5분 (설치 포함!)

---

## ⚡ 빠른 시작

### 1. 설치 및 실행

```bash
# 1. 모든 노드 설치
cd /home/user/youtube
./install-all-nodes.sh

# 2. n8n 시작
./start-n8n.sh

# 3. 브라우저에서 열기
# 터미널에 표시된 URL을 Ctrl+클릭
```

### 2. 워크플로우 Import

1. n8n에서 **Workflows** → **Import from File**
2. 파일 선택: `workflow-2-video-creation.json`
3. **Execute Workflow** 버튼 클릭
4. 완성! 🎉

### 3. 결과 확인

```bash
ls /tmp/shorts_*.mp4
```

---

## 📦 포함된 노드

### 1. Blog to Shorts (우리가 만든 노드)
- 블로그 URL 또는 텍스트 입력
- 자동 텍스트 정리 및 요약
- 숏츠 최적 길이로 조정
- 자막용 세그먼트 분할

### 2. SB Render (참고 모듈)
- 이미지 → 동영상 변환
- 음성 + 배경 + 자막 합성
- FFmpeg 기반 고품질 렌더링

### 3. SB YouTube (참고 모듈)
- 유튜브 자막 추출
- SRT 형식 변환

---

## 📁 프로젝트 구조

```
youtube/
├── 🚀 QUICK_START.md              ← 여기부터 시작!
├── 📚 BEGINNER_GUIDE.md           ← n8n 초보자 가이드
├── 📋 STEP_BY_STEP.md             ← 단계별 상세 가이드
├── 📖 README.md                   ← 이 파일
│
├── 🔧 설치 스크립트
│   ├── install-all-nodes.sh       ← 모든 노드 설치
│   └── start-n8n.sh               ← n8n 시작
│
├── 📄 워크플로우 (Import용)
│   ├── workflow-1-test.json       ← 테스트용
│   └── workflow-2-video-creation.json  ← 동영상 제작용
│
├── 💻 소스 코드
│   ├── nodes/BlogToShorts/        ← Blog to Shorts 노드
│   ├── reference-sb-render/       ← SB Render 노드
│   └── reference-sb-youtube/      ← SB YouTube 노드
│
└── 📦 설정 파일
    ├── package.json
    ├── tsconfig.json
    └── .gitignore
```

---

## 🎓 문서 가이드

### 처음 사용하시나요?
👉 **QUICK_START.md** (5분 빠른 시작)

### n8n이 처음이신가요?
👉 **BEGINNER_GUIDE.md** (n8n 기본 사용법)

### 상세한 단계가 필요하신가요?
👉 **STEP_BY_STEP.md** (단계별 완벽 가이드)

### 기술적인 세부사항이 필요하신가요?
👉 **SETUP_GUIDE.md** (커스텀 노드 개발 가이드)

---

## 🎬 사용 예시

### 예시 1: 블로그 텍스트 → 숏츠
```
입력:
"안녕하세요! 오늘은 AI 자동화에 대해 알아봅니다..."

출력:
shorts_20251202_150000.mp4
- 길이: 10초
- 해상도: 1080x1920
- 자막: 한글 60pt
```

### 예시 2: 블로그 URL → 숏츠
```
입력:
https://myblog.com/ai-automation-guide

출력:
자동으로 본문 추출 → 요약 → 동영상 생성
```

### 예시 3: 매일 자동으로 숏츠 생성
```
[Schedule: 매일 09:00]
    ↓
[RSS Feed: 블로그]
    ↓
[Blog to Shorts]
    ↓
[동영상 생성]
    ↓
[YouTube 업로드]
```

---

## 🛠️ 기술 스택

- **n8n**: 워크플로우 자동화
- **TypeScript**: 노드 개발
- **FFmpeg**: 동영상 렌더링
- **Cheerio**: HTML 파싱
- **Node.js**: 런타임

---

## 🎨 커스터마이징

### 자막 스타일 변경
```javascript
Font Size: 80
Font Color: #FFD700  // 금색
Background Opacity: 0.5
```

### 동영상 길이 조정
```javascript
Duration: 15  // 10초 → 15초
Max Characters: 450  // 300 → 450
```

### 본인 이미지 사용
```
Read Binary File 노드 사용
File Path: /path/to/your/image.jpg
```

---

## 🐛 문제 해결

### "노드가 안 보여요"
```bash
./install-all-nodes.sh
./start-n8n.sh
```

### "FFmpeg not found"
```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg
```

### "동영상 생성 실패"
- FFmpeg 설치 확인
- 메모리 확인 (최소 2GB)
- 디스크 공간 확인

---

## 📊 성능

| 항목 | 값 |
|------|-----|
| 설치 시간 | 2~5분 |
| 동영상 생성 | 10~30초 |
| 파일 크기 | ~5MB (10초 기준) |
| 메모리 사용 | ~500MB |

---

## 🚀 로드맵

### v0.1.0 (현재)
- [x] Blog to Shorts 노드
- [x] 기본 동영상 제작
- [x] 자막 추가

### v0.2.0 (계획)
- [ ] TTS 통합
- [ ] 여러 이미지 지원
- [ ] 템플릿 시스템

### v0.3.0 (계획)
- [ ] YouTube 자동 업로드
- [ ] AI 자동 요약
- [ ] 다국어 자막

---

## 🤝 기여

이슈와 PR 환영합니다!

### 기여 방법
1. Fork
2. Feature 브랜치 생성
3. 커밋
4. PR 생성

---

## 📄 라이선스

MIT License

---

## 🙏 참고 프로젝트

- [sb-render](https://github.com/choisb87/sb-render) - 비디오 렌더링
- [sb-youtube](https://github.com/choisb87/sb-youtube) - 유튜브 자막 추출

---

## 💬 지원

문제가 있으시면:
1. 문서 먼저 확인 (QUICK_START.md, BEGINNER_GUIDE.md)
2. 에러 메시지와 함께 이슈 등록
3. 터미널 로그 첨부

---

## 📞 연락처

- GitHub: [younsunglg/youtube](https://github.com/younsunglg/youtube)
- 문제 신고: GitHub Issues

---

**만든이:** Claude Code 🤖
**버전:** 0.1.0
**업데이트:** 2025-12-02

---

## ⭐ Star

이 프로젝트가 도움이 되셨다면 ⭐ Star를 눌러주세요!
