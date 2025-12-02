#!/bin/bash

echo "🚀 n8n 시작 중..."
echo ""

# 커스텀 노드 경로 설정
CUSTOM_NODES="/home/user/youtube:/home/user/youtube/reference-sb-render:/home/user/youtube/reference-sb-youtube"

echo "📦 로드할 커스텀 노드:"
echo "   - Blog to Shorts"
echo "   - SB Render"
echo "   - SB YouTube"
echo ""

# n8n 시작
N8N_CUSTOM_EXTENSIONS="$CUSTOM_NODES" n8n start
