# Portfolio Chat Frontend

Modern, sleek Next.js frontend for the Portfolio RAG chat system with smooth animations and streaming responses.

## 🎨 Features

- **Modern UI**: Clean, professional design with glassmorphism effects
- **Smooth Animations**: Powered by Framer Motion for delightful interactions
- **Streaming Responses**: Real-time SSE streaming from backend
- **Dark Mode**: Automatic dark mode support
- **Responsive**: Mobile-first design that works on all devices
- **Markdown Support**: Rich text formatting in responses
- **Type-Safe**: Full TypeScript implementation

## 🛠 Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animation library
- **Lucide React**: Modern icon library
- **React Markdown**: Markdown rendering

## 📦 Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local and set your backend URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚀 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles
│   └── chat/
│       └── page.tsx        # Chat interface
├── components/
│   ├── ChatMessage.tsx     # Message bubble component
│   └── ChatInput.tsx       # Input field component
├── lib/
│   └── api.ts              # API service for backend
├── public/                 # Static assets
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🚢 Deployment on Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
4. Deploy!

## 📝 License

MIT
