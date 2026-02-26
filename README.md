# 💬 Chat With My Portfolio

An AI-powered portfolio assistant that lets anyone have a natural conversation with your resume and profile. Built with a full RAG (Retrieval Augmented Generation) pipeline — ask it anything about your experience, skills, projects, or background, and get instant, accurate answers.

**Live Demo:** [your-app.vercel.app](https://your-app.vercel.app) &nbsp;|&nbsp; **Backend API:** [your-backend.onrender.com](https://your-backend.onrender.com/docs)

---

## 🧠 How It Works

```
User Question
     │
     ▼
 Next.js Frontend  ──── SSE Stream ────►  FastAPI Backend
                                               │
                                    ┌──────────▼──────────┐
                                    │  Question Embedding  │
                                    │  (Gemini Embedding)  │
                                    └──────────┬──────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │  ChromaDB Vector     │
                                    │  Similarity Search   │
                                    └──────────┬──────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │  Retrieved Context   │
                                    │  + Prompt Template   │
                                    └──────────┬──────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │  Gemini 2.5 Flash    │
                                    │  Streaming Response  │
                                    └─────────────────────┘
```

On startup, the backend parses `resume.pdf` and `profile.txt`, chunks the text, embeds each chunk via Gemini Embeddings, and stores them in ChromaDB. At query time, the most semantically relevant chunks are retrieved and passed as context to Gemini 2.5 Flash to generate a grounded answer.

---

## 🏗 Tech Stack

### Backend
| Package | Version | Purpose |
|---|---|---|
| FastAPI | 0.115.6 | REST API + SSE streaming |
| LangChain | 0.3.9 | RAG pipeline orchestration |
| langchain-google-genai | 2.0.8 | Gemini embeddings + chat |
| ChromaDB | 0.5.23 | Local vector database |
| PyMuPDF | 1.25.3 | PDF parsing |
| python-docx | 1.1.2 | DOCX parsing |
| Uvicorn | 0.34.0 | ASGI server |
| pydantic-settings | 2.6.1 | Config management |

### Frontend
| Package | Version | Purpose |
|---|---|---|
| Next.js | 16.1.6 | React framework |
| Tailwind CSS | 4 | Styling |
| Framer Motion | 12 | Animations |
| react-markdown | 10 | Markdown rendering |
| remark-gfm | 4 | GitHub Flavored Markdown |
| lucide-react | 0.575 | Icons |

### Infrastructure
- **Frontend Hosting:** Vercel (auto-deploy on push)
- **Backend Hosting:** Render (Docker container)
- **AI Models:** Google Gemini 2.5 Flash + Gemini Embedding 001

---

## 📁 Project Structure

```
Chat-With-My-Portfolio/
├── README.md
├── render.yaml                  # Render deployment config
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   ├── data/
│   │   ├── AhmedIzaan_Resume.pdf  # Your resume (committed)
│   │   └── profile.txt            # Your personal profile (committed)
│   └── app/
│       ├── main.py                # FastAPI app + lifespan
│       ├── config.py              # Settings via pydantic-settings
│       ├── models.py              # Pydantic request/response models
│       ├── routers/
│       │   ├── chat.py            # POST /api/chat/stream (SSE)
│       │   ├── admin.py           # POST /api/admin/reinitialize
│       │   └── health.py          # GET /api/health
│       └── services/
│           ├── parser.py          # PDF / DOCX / TXT text extraction
│           ├── vectordb.py        # ChromaDB singleton service
│           ├── init_service.py    # Startup ingestion logic
│           └── rag_service.py     # LangChain RAG pipeline + streaming
└── frontend/
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── app/
    │   ├── layout.tsx
    │   ├── globals.css
    │   ├── page.tsx               # Landing page
    │   └── chat/
    │       └── page.tsx           # Chat interface
    ├── components/
    │   ├── ChatMessage.tsx        # Message bubble + markdown renderer
    │   └── ChatInput.tsx          # Textarea + send button
    └── lib/
        └── api.ts                 # SSE streaming client
```

---

## 🚀 Local Development

### Prerequisites
- Python 3.12+
- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com) API key (free)

### 1. Clone the repo

```bash
git clone https://github.com/AhmedIzaan/Chat-With-My-Portfolio.git
cd Chat-With-My-Portfolio
```

### 2. Backend Setup

```bash
cd backend
python3 -m venv ../venv
source ../venv/bin/activate       # Windows: ..\venv\Scripts\activate
pip install -r requirements.txt

# Create your .env file
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY
```

Add your documents to `backend/data/`:
- `AhmedIzaan_Resume.pdf` — your resume (PDF or DOCX)
- `profile.txt` — your personal bio, links, contact info

Start the backend:
```bash
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend runs at `http://localhost:8000`. Interactive API docs at `http://localhost:8000/docs`.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file:
```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend:
```bash
npm run dev
```

Frontend runs at `http://localhost:3000`.

---

## ⚙️ Environment Variables

### Backend (`.env`)

| Variable | Default | Description |
|---|---|---|
| `GOOGLE_API_KEY` | *(required)* | Google AI Studio API key |
| `ALLOWED_ORIGINS` | `*` | CORS allowed origins |
| `CHROMA_DB_PATH` | `/tmp/chroma_db` | ChromaDB storage path |
| `RESUME_FILE_PATH` | `data/AhmedIzaan_Resume.pdf` | Path to resume file |
| `PROFILE_FILE_PATH` | `data/profile.txt` | Path to profile/bio text file |
| `EMBEDDING_MODEL` | `models/gemini-embedding-001` | Gemini embedding model |
| `CHAT_MODEL` | `gemini-2.5-flash` | Gemini chat model |
| `TEMPERATURE` | `0.3` | LLM response temperature |
| `MAX_TOKENS` | `1000` | Max tokens per response |
| `CHUNK_SIZE` | `800` | Text chunk size for embedding |
| `CHUNK_OVERLAP` | `100` | Overlap between chunks |

### Frontend (`.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend URL (e.g. `https://your-backend.onrender.com`) |

---

## 🌐 Deployment

### Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repo, set **Language** to **Docker**, **Root Directory** to `backend`
4. Add all environment variables from the table above (especially `GOOGLE_API_KEY`)
5. Click **Deploy**

The `render.yaml` in the root of this repo auto-configures everything.

> **Note:** ChromaDB data lives in `/tmp/chroma_db` on Render's free tier. Since `/tmp` is ephemeral, the DB is rebuilt from your documents on every cold start automatically.

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo, set **Root Directory** to `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL` = your Render backend URL
4. Click **Deploy**

Both services auto-deploy on every `git push origin main`. 🎉

### Update CORS After Deployment

Once your Vercel URL is known, update `ALLOWED_ORIGINS` in Render's environment variables:
```
ALLOWED_ORIGINS=https://your-app.vercel.app
```

---

## 🔧 Useful API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/chat/stream` | Stream chat response (SSE) |
| `POST` | `/api/admin/reinitialize` | Force wipe + re-embed all documents |
| `POST` | `/api/admin/reload` | Load documents only if DB is empty |
| `GET` | `/docs` | Interactive Swagger UI |

### Re-embed Documents

Whenever you update `resume.pdf` or `profile.txt`, call:
```bash
curl -X POST https://your-backend.onrender.com/api/admin/reinitialize
```
Or visit `/docs` and use the **Try it out** button.

### Docker (Local Test)

```bash
cd backend
docker build -t portfolio-backend .
docker run -p 8000:8000 -e GOOGLE_API_KEY=your_key_here portfolio-backend
```

---

## 📄 Adding Your Own Documents

The ingestion pipeline supports **PDF**, **DOCX**, and **TXT** files. To add a new document type:

1. Drop the file in `backend/data/`
2. Add its path as an env variable (e.g. `EXTRA_DOC_PATH=data/cover_letter.pdf`)
3. Register it in `init_service.py` (same pattern as resume/profile)
4. Call `/api/admin/reinitialize`

---

## 📝 License

MIT — feel free to fork and make it your own.

npm run dev
```

Frontend will run at `http://localhost:3000`

## 📝 Features

- ✅ Resume parsing (PDF/DOCX)
- ✅ Vector embeddings with ChromaDB
- ✅ RAG pipeline with LangChain
- ✅ Streaming chat responses (SSE)
- ✅ Auto-initialization on startup
- ✅ Docker support
- ✅ Modern, animated UI with dark mode
- ✅ Mobile-responsive design
- ✅ Render & Vercel deployment ready

## 🔧 Tech Stack

### Backend
- FastAPI
- LangChain
- ChromaDB
- OpenAI API
- PyMuPDF
- python-docx

### Frontend
- Next.js 15
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons
- React Markdown

## 📚 Documentation

- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)

## 🚢 Deployment

### Backend (Render)
1. Commit your resume to `backend/data/resume.pdf`
2. Create Web Service on Render
3. Connect repository
4. Set `OPENAI_API_KEY` environment variable
5. Deploy!

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `frontend/`
4. Set `NEXT_PUBLIC_API_URL` environment variable
5. Deploy!

## 🎨 Screenshots

### Landing Page
Modern hero section with animated gradients and feature cards

### Chat Interface
Real-time streaming responses with markdown support and smooth animations

## 📄 License

MIT

## 🤝 Contributing

This is a personal portfolio project, but feel free to fork and adapt for your own use!

