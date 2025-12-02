#!/bin/bash

echo "🚀 n8n 커스텀 노드 설치 스크립트"
echo "=================================="
echo ""

# 색상 코드
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 현재 디렉토리 확인
CURRENT_DIR="/home/user/youtube"

echo "📍 작업 디렉토리: $CURRENT_DIR"
echo ""

# 1. Blog to Shorts 노드 빌드 및 링크
echo "1️⃣  Blog to Shorts 노드 설치 중..."
cd "$CURRENT_DIR"
npm install
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Blog to Shorts 빌드 완료${NC}"
    npm link
    echo -e "${GREEN}✅ Blog to Shorts npm link 완료${NC}"
else
    echo -e "${RED}❌ Blog to Shorts 빌드 실패${NC}"
    exit 1
fi

echo ""

# 2. sb-render 노드 빌드 및 링크
echo "2️⃣  SB Render 노드 설치 중..."
cd "$CURRENT_DIR/reference-sb-render"

if [ ! -d "node_modules" ]; then
    echo "   패키지 설치 중..."
    npm install
fi

npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SB Render 빌드 완료${NC}"
    npm link
    echo -e "${GREEN}✅ SB Render npm link 완료${NC}"
else
    echo -e "${RED}❌ SB Render 빌드 실패${NC}"
    exit 1
fi

echo ""

# 3. sb-youtube 노드 빌드 및 링크
echo "3️⃣  SB YouTube 노드 설치 중..."
cd "$CURRENT_DIR/reference-sb-youtube"

if [ ! -d "node_modules" ]; then
    echo "   패키지 설치 중..."
    npm install
fi

npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SB YouTube 빌드 완료${NC}"
    npm link
    echo -e "${GREEN}✅ SB YouTube npm link 완료${NC}"
else
    echo -e "${RED}❌ SB YouTube 빌드 실패${NC}"
    exit 1
fi

echo ""
echo "=================================="
echo -e "${GREEN}✅ 모든 노드 설치 완료!${NC}"
echo ""
echo "📝 설치된 노드:"
echo "   1. Blog to Shorts (블로그 → 스크립트)"
echo "   2. SB Render (동영상 렌더링)"
echo "   3. SB YouTube (유튜브 자막 추출)"
echo ""
echo "🚀 다음 단계:"
echo "   1. 현재 실행 중인 n8n 중지 (Ctrl+C)"
echo "   2. 아래 명령어로 n8n 재시작:"
echo ""
echo -e "${YELLOW}   N8N_CUSTOM_EXTENSIONS=\"$CURRENT_DIR:$CURRENT_DIR/reference-sb-render:$CURRENT_DIR/reference-sb-youtube\" n8n start${NC}"
echo ""
echo "   또는 간단하게:"
echo -e "${YELLOW}   ./start-n8n.sh${NC}"
echo ""
