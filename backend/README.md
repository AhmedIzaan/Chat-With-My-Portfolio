# Portfolio RAG Backend

Backend API for a Retrieval Augmented Generation (RAG) system that answers questions about your portfolio/resume using AI.

## Features

- 🤖 **RAG Pipeline**: Powered by LangChain, ChromaDB, and OpenAI
- 📄 **Resume Parsing**: Supports PDF and DOCX formats
- 🔄 **Streaming Responses**: Server-Sent Events (SSE) for real-time chat
- 🚀 **Auto-initialization**: Loads resume on startup automatically
- 🐳 **Docker Ready**: Containerized for easy deployment
- ☁️ **Render Compatible**: Optimized for Render free tier deployment

## Architecture

- **FastAPI**: Modern Python web framework
- **LangChain**: RAG pipeline orchestration
- **ChromaDB**: Vector database for embeddings
- **OpenAI**: Embeddings (text-embedding-3-small) and Chat (gpt-4o-mini)
- **PyMuPDF**: PDF parsing
- **python-docx**: DOCX parsing

## Prerequisites

- Python 3.12+
- OpenAI API key
- Resume file (PDF or DOCX)

## Local Setup

### 1. Clone and Navigate

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-key-here
```

### 5. Add Your Resume

Place your resume file at `data/resume.pdf` or `data/resume.docx`:

```bash
# Create data directory if it doesn't exist
mkdir -p data

# Copy your resume
cp /path/to/your/resume.pdf data/resume.pdf
```

**Important**: The `data/` directory with your resume should be committed to the repository for deployment.

### 6. Run Locally

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check

```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy",
  "vector_db_count": 15,
  "resume_loaded": true
}
```

### Chat Stream (SSE)

```bash
curl -N -X POST http://localhost:8000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"question": "What are my technical skills?"}'
```

**Response:** Server-Sent Events stream
```
data: {"content": "Based"}
data: {"content": " on"}
data: {"content": " your"}
data: {"content": " resume"}
data: {"content": "..."}
data: {"done": true}
```

### Admin Reload

Manually trigger vector DB reload:

```bash
curl -X POST http://localhost:8000/api/admin/reload
```

**Response:**
```json
{
  "success": true,
  "chunks_created": 15,
  "message": "Successfully initialized with 15 chunks"
}
```

## Docker Usage

### Build Image

```bash
docker build -t portfolio-rag-backend .
```

### Run Container

```bash
docker run -p 8000:8000 \
  -e OPENAI_API_KEY=sk-your-key-here \
  -e ALLOWED_ORIGINS=* \
  portfolio-rag-backend
```

### With Environment File

```bash
docker run -p 8000:8000 --env-file .env portfolio-rag-backend
```

## Deployment to Render

### Prerequisites

1. Resume file committed to repository at `backend/data/resume.pdf`
2. OpenAI API key

### Steps

1. **Create Web Service** on Render dashboard
2. **Connect Repository**
3. **Configure Service:**
   - **Build Command**: `docker build -t portfolio-rag-backend ./backend`
   - **Start Command**: (Auto-detected from Dockerfile)
   - **Root Directory**: Leave blank (Dockerfile is in backend/)

4. **Set Environment Variables:**
   ```
   OPENAI_API_KEY=sk-your-key-here
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

5. **Configure Health Check:**
   - **Path**: `/health`
   - **Type**: HTTP

6. **Deploy**: Render will build and deploy automatically

### Render Free Tier Notes

- ⚠️ Service sleeps after 15 minutes of inactivity
- ⏱️ Cold start takes 20-30 seconds
- 💾 No persistent disk (vector DB rebuilds from resume on startup)
- 🔄 Resume file must be in Git repo for persistence

## Configuration

All configuration via environment variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | ✅ | - | OpenAI API key |
| `ALLOWED_ORIGINS` | ❌ | `*` | CORS allowed origins (comma-separated) |
| `CHROMA_DB_PATH` | ❌ | `/tmp/chroma_db` | ChromaDB storage path |
| `RESUME_FILE_PATH` | ❌ | `/app/data/resume.pdf` | Resume file location |
| `EMBEDDING_MODEL` | ❌ | `text-embedding-3-small` | OpenAI embedding model |
| `CHAT_MODEL` | ❌ | `gpt-4o-mini` | OpenAI chat model |
| `TEMPERATURE` | ❌ | `0.3` | LLM temperature |
| `MAX_TOKENS` | ❌ | `1000` | Max response tokens |
| `CHUNK_SIZE` | ❌ | `800` | Text chunk size |
| `CHUNK_OVERLAP` | ❌ | `100` | Chunk overlap size |

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app
│   ├── config.py            # Settings
│   ├── models.py            # Pydantic models
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── health.py        # Health endpoint
│   │   ├── chat.py          # Chat streaming
│   │   └── admin.py         # Admin endpoints
│   └── services/
│       ├── __init__.py
│       ├── parser.py        # Resume parsing
│       ├── vectordb.py      # ChromaDB service
│       ├── rag_service.py   # RAG pipeline
│       └── init_service.py  # Startup initialization
├── data/
│   └── resume.pdf           # Your resume (commit to repo)
├── tests/
├── Dockerfile
├── requirements.txt
├── .env.example
├── .dockerignore
└── README.md
```

## Troubleshooting

### "Resume file not found"

- Ensure `data/resume.pdf` exists
- Check `RESUME_FILE_PATH` environment variable
- Verify file is committed to Git (for Render deployment)

### "No resume data loaded"

- Check startup logs for initialization errors
- Manually trigger reload: `curl -X POST http://localhost:8000/api/admin/reload`
- Verify OpenAI API key is valid

### CORS errors from frontend

- Add frontend URL to `ALLOWED_ORIGINS`: `ALLOWED_ORIGINS=https://frontend.vercel.app,http://localhost:3000`

### Streaming not working

- Check that client accepts `text/event-stream`
- Disable any proxy buffering (nginx, etc.)
- Use `-N` flag with curl for streaming

## Testing

Run quick test:

```bash
# Health check
curl http://localhost:8000/health

# Test chat
curl -N -X POST http://localhost:8000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"question": "What programming languages do I know?"}'
```

## License

MIT
