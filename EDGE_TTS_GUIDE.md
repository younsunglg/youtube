# 🎙️ Edge TTS 완벽 가이드

**무료 고품질 TTS로 음성이 포함된 숏츠 만들기!**

---

## 🌟 Edge TTS란?

Microsoft Edge 브라우저에 내장된 **Neural TTS 엔진**입니다.

### 장점
- ✅ **완전 무료** (API 키 불필요!)
- ✅ **고품질** (Google TTS와 동급 이상)
- ✅ **한국어 품질 우수** (자연스러운 발음)
- ✅ **빠른 속도** (실시간 생성)
- ✅ **쉬운 사용** (Python 한 줄로 가능)

### Google TTS와 비교

| 항목 | Edge TTS | Google TTS |
|------|----------|------------|
| 가격 | **완전 무료** | 유료 (무료 할당량 제한) |
| 품질 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| API 키 | **불필요** | 필요 |
| 한국어 | 우수 | 우수 |
| 사용 제한 | 없음 | 월 100만 자 |

**결론:** Edge TTS가 무료면서 품질도 좋아요! 🎉

---

## 📦 설치 (2분)

### 방법 1: 자동 설치 (권장)

```bash
cd /home/user/youtube
./install-edge-tts.sh
```

### 방법 2: 수동 설치

```bash
# Python과 pip 설치 확인
python3 --version
pip3 --version

# edge-tts 설치
pip3 install edge-tts

# 설치 확인
edge-tts --version
```

---

## 🎤 사용 가능한 한국어 음성

### 여성 음성
- **ko-KR-SunHiNeural** ⭐ 추천!
  - 밝고 친근한 톤
  - 뉴스, 튜토리얼에 적합

- **ko-KR-JiMinNeural**
  - 차분하고 따뜻한 톤
  - 설명, 안내에 적합

### 남성 음성
- **ko-KR-InJoonNeural** ⭐ 추천!
  - 신뢰감 있는 톤
  - 뉴스, 공지에 적합

- **ko-KR-BongJinNeural**
  - 친근하고 밝은 톤
  - 일상적인 콘텐츠에 적합

### 음성 미리 듣기

```bash
# 여성 음성 테스트
edge-tts --text "안녕하세요! 오늘은 AI 자동화에 대해 알아보겠습니다." \
  --voice ko-KR-SunHiNeural \
  --write-media /tmp/test_female.mp3

# 남성 음성 테스트
edge-tts --text "안녕하세요! 오늘은 AI 자동화에 대해 알아보겠습니다." \
  --voice ko-KR-InJoonNeural \
  --write-media /tmp/test_male.mp3

# 재생
vlc /tmp/test_female.mp3
```

---

## 🚀 n8n 워크플로우 사용법

### STEP 1: Edge TTS 설치

```bash
./install-edge-tts.sh
```

### STEP 2: 워크플로우 Import

1. n8n에서 **Workflows** → **Import from File**
2. 파일 선택: `workflow-3-with-edge-tts.json`

### STEP 3: 워크플로우 구조 이해

```
[시작]
    ↓
[1. 블로그 → 스크립트]     ← 텍스트 준비
    ↓                ↘
[2. Edge TTS]          [4. 배경 이미지]
    ↓                      ↓
[3. 음성 파일 읽기]  ←←←←←←←
    ↓
[5. 데이터 병합]            ← 음성 + 이미지
    ↓
[6. 동영상 생성]            ← 음성 + 이미지 + 자막
    ↓
[7. 파일 저장]              ← /tmp/shorts_with_voice_xxx.mp4
```

### STEP 4: 실행!

1. **Execute Workflow** 버튼 (▶️) 클릭
2. 대기... (30초~1분)
3. 완료!

### STEP 5: 결과 확인

```bash
# 최신 파일 찾기
ls -lt /tmp/shorts_with_voice_*.mp4 | head -1

# 재생
vlc /tmp/shorts_with_voice_*.mp4
```

---

## 🎨 커스터마이징

### 1. 음성 변경

**노드 2 (Edge TTS)** 설정에서:

```bash
# 여성 → 남성으로 변경
--voice ko-KR-SunHiNeural  →  --voice ko-KR-InJoonNeural
```

### 2. 말하기 속도 조절

```bash
# 더 빠르게 (+20%)
--rate=+20%

# 더 느리게 (-20%)
--rate=-20%

# 기본 속도
--rate=+0%
```

**예시:**
```bash
edge-tts --text "안녕하세요" \
  --voice ko-KR-SunHiNeural \
  --rate=+20% \
  --write-media output.mp3
```

### 3. 음량 조절

```bash
# 더 크게 (+20%)
--volume=+20%

# 더 작게 (-20%)
--volume=-20%

# 기본 음량
--volume=+0%
```

### 4. 완전한 커스텀 명령어

**노드 2 (Edge TTS)** 에서:

```bash
cd /tmp && edge-tts \
  --text "{{ $json.content }}" \
  --voice ko-KR-SunHiNeural \
  --rate=+10% \
  --volume=+5% \
  --write-media narration_{{ $now.toUnixInteger() }}.mp3 && \
  echo "narration_{{ $now.toUnixInteger() }}.mp3"
```

---

## 💡 고급 활용

### 1. 세그먼트별 음성 생성

긴 텍스트를 여러 개의 짧은 음성으로 분할:

```javascript
// Code 노드 사용
const segments = $input.item.json.segments;
const audioFiles = [];

for (const segment of segments) {
  const filename = `segment_${segment.order}.mp3`;
  // edge-tts 명령 실행
  audioFiles.push(filename);
}

return { audioFiles };
```

### 2. 여러 음성 믹스

```bash
# FFmpeg로 여러 음성 파일 합치기
ffmpeg -i "concat:audio1.mp3|audio2.mp3|audio3.mp3" -acodec copy output.mp3
```

### 3. 배경 음악(BGM) 추가

```bash
# 음성 + BGM 믹스
ffmpeg -i narration.mp3 -i bgm.mp3 -filter_complex \
  "[0:a][1:a]amix=inputs=2:duration=first:dropout_transition=2" \
  output.mp3
```

---

## 🐛 문제 해결

### "edge-tts: command not found"

**해결 방법:**

```bash
# 1. 재설치
pip3 install --upgrade edge-tts

# 2. PATH 확인
which edge-tts

# 3. 직접 경로 사용
python3 -m edge_tts --text "안녕" --voice ko-KR-SunHiNeural --write-media test.mp3
```

### "Permission denied"

```bash
# /tmp 폴더 권한 확인
ls -ld /tmp

# 권한 부여
chmod 777 /tmp
```

### "Voice not found"

```bash
# 사용 가능한 음성 목록 확인
edge-tts --list-voices | grep ko-KR

# 정확한 음성 이름 사용
edge-tts --voice ko-KR-SunHiNeural ...
```

### "생성된 음성이 너무 빠르거나 느려요"

```bash
# 속도 조절
--rate=-10%  # 10% 느리게
--rate=+10%  # 10% 빠르게
```

---

## 📊 성능 비교

### 음성 생성 속도

| 텍스트 길이 | 생성 시간 | 파일 크기 |
|-------------|-----------|-----------|
| 100자 | ~2초 | ~50KB |
| 300자 | ~5초 | ~150KB |
| 500자 | ~8초 | ~250KB |

### 품질 비교

| TTS | 자연스러움 | 발음 정확도 | 감정 표현 |
|-----|-----------|-------------|-----------|
| Edge TTS | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Google TTS | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| gTTS (무료) | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |

---

## 🎯 워크플로우 비교

### 워크플로우 2 (음성 없음)
```
블로그 → 이미지 → 자막만 있는 동영상
소요 시간: 10~20초
```

### 워크플로우 3 (Edge TTS 음성 포함) ⭐
```
블로그 → 음성 생성 → 이미지 + 음성 + 자막 동영상
소요 시간: 30초~1분
```

**차이점:**
- ✅ 음성 나레이션 추가
- ✅ 더 전문적인 퀄리티
- ✅ 시청자 참여도 향상

---

## 💰 비용 비교

### Edge TTS (우리가 사용)
- **월 비용:** $0 (완전 무료!)
- **사용 제한:** 없음
- **API 키:** 불필요

### Google Cloud TTS
- **월 비용:**
  - 0~100만 자: 무료
  - 100만 자 초과: $4/100만 자
- **API 키:** 필요
- **설정:** 복잡

### ElevenLabs
- **월 비용:**
  - 무료: 10,000자/월
  - 유료: $5~$99/월
- **품질:** 최고급
- **API 키:** 필요

**결론:** Edge TTS가 무료이면서 충분히 고품질! 🎉

---

## 📚 추가 자료

### 공식 문서
- [edge-tts GitHub](https://github.com/rany2/edge-tts)
- [사용 가능한 모든 음성 목록](https://github.com/rany2/edge-tts#voice-list)

### 명령어 치트시트

```bash
# 기본 사용
edge-tts --text "안녕하세요" --voice ko-KR-SunHiNeural --write-media output.mp3

# 속도 조절
edge-tts --text "안녕하세요" --voice ko-KR-SunHiNeural --rate=+20% --write-media output.mp3

# 음량 조절
edge-tts --text "안녕하세요" --voice ko-KR-SunHiNeural --volume=+10% --write-media output.mp3

# 음성 목록 보기
edge-tts --list-voices

# 한국어 음성만 보기
edge-tts --list-voices | grep ko-KR

# 도움말
edge-tts --help
```

---

## 🎬 실전 예시

### 예시 1: 블로그 글 → 음성 숏츠

**입력:**
```
안녕하세요! 오늘은 n8n으로 워크플로우 자동화를 만드는
방법을 알아보겠습니다. Edge TTS를 사용하면 무료로
고품질 음성을 생성할 수 있습니다!
```

**출력:**
```
📹 shorts_with_voice_20251202_150000.mp4
   ├─ 길이: 15초
   ├─ 해상도: 1080x1920
   ├─ 음성: Edge TTS (여성, 한국어)
   ├─ 자막: 흰색, 60pt
   └─ 크기: ~8MB
```

### 예시 2: 다국어 숏츠

```bash
# 한국어
edge-tts --text "안녕하세요" --voice ko-KR-SunHiNeural --write-media ko.mp3

# 영어
edge-tts --text "Hello" --voice en-US-JennyNeural --write-media en.mp3

# 일본어
edge-tts --text "こんにちは" --voice ja-JP-NanamiNeural --write-media ja.mp3
```

---

## ✅ 체크리스트

- [ ] Edge TTS 설치 완료
- [ ] 한국어 음성 테스트 완료
- [ ] 워크플로우 3 import 완료
- [ ] 음성 포함 숏츠 생성 성공!
- [ ] 음성/속도 커스터마이징 테스트

**모두 체크했나요? 완벽합니다! 🎉**

---

## 🚀 다음 단계

1. **다양한 음성 테스트** - 여러 음성 스타일 비교
2. **BGM 추가** - 배경 음악과 음성 믹스
3. **자동화** - 스케줄러로 매일 자동 생성
4. **YouTube 업로드** - 자동 업로드까지 완성

---

**작성자:** Claude Code
**업데이트:** 2025-12-02
**버전:** 1.0
