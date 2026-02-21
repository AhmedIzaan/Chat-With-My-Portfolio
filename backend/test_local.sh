#!/bin/bash

# Test script for Portfolio RAG Backend API
# Usage: ./test_local.sh

set -e

BASE_URL="http://localhost:8000"

echo "🧪 Testing Portfolio RAG Backend API"
echo "===================================="
echo ""

# Test 1: Root endpoint
echo "1️⃣  Testing root endpoint..."
curl -s $BASE_URL | jq '.'
echo "✅ Root endpoint OK"
echo ""

# Test 2: Health check
echo "2️⃣  Testing health check..."
curl -s $BASE_URL/health | jq '.'
echo "✅ Health check OK"
echo ""

# Test 3: Chat stream - Technical Skills
echo "3️⃣  Testing chat stream - Technical Skills..."
echo "Question: What are my technical skills?"
curl -N -X POST $BASE_URL/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"question": "What are my technical skills?"}'
echo ""
echo "✅ Chat stream test 1 OK"
echo ""

# Test 4: Chat stream - Experience
echo "4️⃣  Testing chat stream - Work Experience..."
echo "Question: What is my work experience?"
curl -N -X POST $BASE_URL/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"question": "What is my work experience?"}'
echo ""
echo "✅ Chat stream test 2 OK"
echo ""

# Test 5: Chat stream - Education
echo "5️⃣  Testing chat stream - Education..."
echo "Question: What is my educational background?"
curl -N -X POST $BASE_URL/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"question": "What is my educational background?"}'
echo ""
echo "✅ Chat stream test 3 OK"
echo ""

# Test 6: Admin reload
echo "6️⃣  Testing admin reload endpoint..."
curl -s -X POST $BASE_URL/api/admin/reload | jq '.'
echo "✅ Admin reload OK"
echo ""

echo "===================================="
echo "✨ All tests completed successfully!"
echo ""
echo "📊 Quick Stats:"
curl -s $BASE_URL/health | jq '.'
