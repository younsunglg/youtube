#!/bin/bash

echo "🎙️  Edge TTS 설치 중..."
echo "=============================="
echo ""

# 색상 코드
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Python 확인
echo "1️⃣  Python 확인 중..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✅ Python 설치됨: $PYTHON_VERSION${NC}"
else
    echo -e "${RED}❌ Python이 설치되어 있지 않습니다${NC}"
    echo "Python 설치 방법:"
    echo "  Ubuntu/Debian: sudo apt-get install python3 python3-pip"
    echo "  macOS: brew install python3"
    exit 1
fi

echo ""

# pip 확인
echo "2️⃣  pip 확인 중..."
if command -v pip3 &> /dev/null; then
    echo -e "${GREEN}✅ pip 설치됨${NC}"
else
    echo -e "${YELLOW}⚠️  pip 설치 중...${NC}"
    python3 -m ensurepip --default-pip
fi

echo ""

# edge-tts 설치
echo "3️⃣  Edge TTS 설치 중..."
pip3 install edge-tts --quiet

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Edge TTS 설치 완료${NC}"
else
    echo -e "${RED}❌ Edge TTS 설치 실패${NC}"
    exit 1
fi

echo ""

# 설치 확인
echo "4️⃣  설치 확인 중..."
if command -v edge-tts &> /dev/null; then
    echo -e "${GREEN}✅ edge-tts 명령어 사용 가능${NC}"
else
    echo -e "${YELLOW}⚠️  edge-tts 명령어를 찾을 수 없습니다${NC}"
    echo "PATH에 추가가 필요할 수 있습니다"
fi

echo ""

# 사용 가능한 한국어 음성 목록
echo "5️⃣  사용 가능한 한국어 음성 확인 중..."
echo ""
echo -e "${YELLOW}한국어 음성 목록:${NC}"
edge-tts --list-voices | grep "ko-KR" | head -5

echo ""
echo "=============================="
echo -e "${GREEN}✅ Edge TTS 설치 완료!${NC}"
echo ""
echo "💡 사용 방법:"
echo "   edge-tts --text \"안녕하세요\" --voice ko-KR-SunHiNeural --write-media output.mp3"
echo ""
echo "🎙️  추천 음성:"
echo "   - ko-KR-SunHiNeural (여성, 밝은 톤)"
echo "   - ko-KR-InJoonNeural (남성, 차분한 톤)"
echo "   - ko-KR-BongJinNeural (남성, 친근한 톤)"
echo ""
