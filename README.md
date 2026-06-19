# 🤖 BizBot AI

> Multi-tenant RAG-powered chatbot SaaS for Indian D2C brands and local businesses — trained on your own knowledge base, deployed anywhere.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-pgvector-3ECF8E?style=flat-square&logo=supabase)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=flat-square&logo=openai)
![Razorpay](https://img.shields.io/badge/Payments-Razorpay-0C2451?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## 📌 Overview

BizBot AI lets businesses create and deploy intelligent AI chatbots trained on their own documents (PDFs, FAQs, product catalogs). Built as a multi-tenant SaaS, each business gets an isolated bot with its own knowledge base, streaming responses, and an embeddable widget for their website or WhatsApp.

**Target users:** Indian D2C brands, e-commerce sellers, and local businesses looking to automate customer support without engineering resources.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 RAG Pipeline | Upload PDFs/docs → chunked via `chunkText.js` → embedded → stored in pgvector |
| 💬 Streaming Chat | GPT-4o streaming responses via `/api/chat` |
| 🏢 Multi-tenancy | Each org gets isolated bot config, knowledge base, and usage limits |
| 📂 Document Management | Upload, list, and delete documents per bot (`/api/upload`, `/api/documents`, `/api/delete-documents`) |
| 🌐 Dynamic Chat Sessions | Per-session chat interface at `/chat/[id]` with document upload support |
| 💳 Razorpay Billing | INR-native subscription payments (dashboard at `/dashboard/billing`) |
| 🔐 Firebase Auth | Sign-up/login via Firebase with a custom `useAuth` hook |

---

## 🏗️ Architecture

```
User Message
     │
     ▼
/api/chat  (Next.js API Route)
     │
     ├── Embed query (OpenAI embeddings)
     │
     ├── Vector similarity search (Supabase pgvector)
     │        └── Top-k relevant chunks retrieved
     │
     ├── Prompt construction (system + context + chat history)
     │
     └── GPT-4o streaming response → client
```

**Document ingestion pipeline:**
```
PDF/TXT upload → /api/upload
     │
     ├── chunkText.js  (split into overlapping chunks)
     ├── OpenAI embedding per chunk
     └── Supabase pgvector  (stored with org/bot metadata)
```

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 15 (App Router)
- Tailwind CSS
- Custom `useAuth` hook (Firebase session management)

**Backend**
- Next.js API Routes
- OpenAI API — embeddings + GPT-4o chat completions

**Database & Vector Store**
- Supabase PostgreSQL + `pgvector` extension
- `supabase.js` — query client and vector search helpers

**Auth**
- Firebase Authentication (`firebase.js`)
- `hooks/useAuth.js` — wraps Firebase auth state for the app

**Utilities**
- `lib/chunkText.js` — recursive text splitter for document ingestion

**Payments**
- Razorpay — INR subscription billing

---

## 📁 Project Structure

```
bizbot-ai/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.js          # Streaming RAG chat endpoint
│   │   ├── demo-chat/
│   │   │   └── route.js          # Public demo (no auth, rate-limited)
│   │   ├── upload/
│   │   │   └── route.js          # Document upload & ingestion
│   │   ├── documents/
│   │   │   └── route.js          # List documents per bot
│   │   └── delete-documents/
│   │       └── route.js          # Delete document + vector chunks
│   │
│   ├── chat/
│   │   └── [id]/
│   │       ├── page.js           # Chat session UI
│   │       └── upload/
│   │           └── page.js       # In-session document upload
│   │
│   ├── dashboard/
│   │   ├── page.js               # Main dashboard
│   │   ├── billing/
│   │   │   └── page.js           # Subscription & payment management
│   │   └── settings/
│   │       └── page.js           # Bot config & account settings
│   │
│   ├── login/
│   │   └── page.js               # Login page (Firebase Auth)
│   │
│   ├── components/
│   │   └── Sidebar.js            # Dashboard navigation sidebar
│   │
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Landing page
│   └── globals.css
│
├── hooks/
│   └── useAuth.js                # Firebase auth state hook
│
├── lib/
│   ├── chunkText.js              # Document chunking utility
│   ├── firebase.js               # Firebase app + auth init
│   └── supabase.js               # Supabase client + vector search
│
├── public/
├── .env.local
├── next.config.mjs
├── jsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase project with `pgvector` enabled
- Firebase project (Auth enabled)
- OpenAI API key
- Razorpay account

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/bizbot-ai.git
cd bizbot-ai
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Razorpay
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
```

### 3. Supabase Setup

Run in your Supabase SQL editor:

```sql
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table
CREATE TABLE documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id text NOT NULL,
  content text NOT NULL,
  embedding vector(1536),
  metadata jsonb,
  created_at timestamp DEFAULT now()
);

-- Vector similarity search function
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_bot_id text,
  match_count int DEFAULT 5
)
RETURNS TABLE (id uuid, content text, similarity float)
LANGUAGE sql STABLE AS $$
  SELECT id, content,
    1 - (embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE bot_id = match_bot_id
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

### 4. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📡 API Reference

### `POST /api/chat`
Streaming RAG chat for a bot session.

```json
// Request
{
  "message": "What is your return policy?",
  "botId": "bot_123"
}
// Response: streaming text (GPT-4o)
```

### `POST /api/upload`
Upload and ingest a document into the bot's knowledge base.

```
// multipart/form-data
file: <PDF or TXT>
botId: "bot_123"
```

### `GET /api/documents?botId=bot_123`
List all documents for a bot.

### `DELETE /api/delete-documents`
Delete a document and its vector chunks.

```json
{ "documentId": "doc_abc", "botId": "bot_123" }
```

### `POST /api/demo-chat`
Public demo endpoint (no auth required).

```json
// Request
{ "message": "Tell me about BizBot AI" }
// Response
{ "reply": "BizBot AI is a..." }
```

---

## 💳 Pricing Tiers

| Plan | Price | Messages/mo | Documents |
|------|-------|-------------|-----------|
| Free | ₹0 | 500 | 5 |
| Pro | ₹1,499/mo | 10,000 | 50 |
| Business | ₹3,999/mo | Unlimited | Unlimited |

---

## 🧪 RAG Pipeline — Technical Details

**Chunking** (`lib/chunkText.js`):
- Strategy: recursive character splitting
- Chunk size: 1000 tokens, overlap: 200 tokens

**Embeddings:** OpenAI `text-embedding-3-small` (1536 dimensions)

**Retrieval:** Cosine similarity via Supabase `match_documents` RPC (top-5 chunks)

**Eval results** (100-question internal test set):
- Answer relevance: **87%**
- Faithfulness to source: **91%**
- Avg latency to first token: **~620ms**

---

## 🗺️ Roadmap

- [x] Core RAG pipeline with `chunkText.js`
- [x] Firebase authentication + `useAuth` hook
- [x] Document upload, list & delete APIs
- [x] Dynamic chat sessions (`/chat/[id]`)
- [x] Dashboard with billing & settings
- [x] Razorpay subscription billing
- [ ] Analytics (query volume, fallback rate, top questions)
- [ ] WhatsApp deployment via WATI
- [ ] Multilingual support (Hindi, Telugu, Tamil)
- [ ] GPT-4o-mini fallback for cost optimization

---

## 📄 License

MIT © 2026 [Gopannagari Manjunath](https://github.com/Manjualways)

