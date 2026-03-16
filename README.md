# DayZero AI

DayZero AI is an AI-powered platform designed to act as a ruthless, concise Venture Capitalist. Pitch your startup idea and receive an instant, comprehensive Go-To-Market (GTM) analysis to shape your strategy.

## 🚀 Features

- **AI-Powered Validation:** Evaluates startup ideas using Google's Gemini 2.5 Flash model acting as a strategic Venture Capitalist.
- **Comprehensive Analysis:** Generates critical insights including Problem Statements, Market Overview, GTM Strategy, Revenue Models, ROI Potential, and Key Risks.
- **Market Sizing Visualization:** Interactive Donut charts (Recharts) to visualize Addressable vs. Obtainable Revenue (TAM, SAM, SOM).
- **Secure Authentication:** User accounts managed via Supabase Auth (Sign In / Sign Up).
- **Historical Analysis:** All prior analyses are saved to a Supabase Postgres database and accessible via the History panel.
- **Premium UI:** Glassmorphism design, smooth Framer Motion animations, and a cohesive dark mode aesthetic.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite, TypeScript)
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- Recharts (Data Visualization)
- Lucide React (Icons)
- Supabase JS Client (Auth)
- Vercel Analytics

**Backend:**
- Python 3
- FastAPI & Uvicorn (REST API)
- Google GenAI SDK (Gemini AI Models)
- Supabase REST API (Database Storage)
- Vercel Serverless (Deployment via `vercel.json` & `BackgroundTasks`)

## ⚙️ Local Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/GSaikowshik/FounderIQ.git
cd FounderIQ
```

### 2. Configure Environment Variables
Copy the provided `.env.example` templates to `.env` files and fill in your actual credentials.

**Backend (`/.env`):**
```env
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your_supabase_publishable_key_here
DATABASE_URL=postgresql://postgres:password@db.your-project-ref.supabase.co:6543/postgres
```

**Frontend (`/frontend/.env`):**
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key_here
```

### 3. Start the Backend (FastAPI)
```bash
# Create a virtual environment and load it
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server at http://localhost:8000
uvicorn main:app --reload
```

### 4. Start the Frontend (Vite/React)
In a new terminal:
```bash
cd frontend

# Install dependencies
npm install

# Start the dev server at http://localhost:5173
npm run dev
```

## 🗄️ Database Setup (Supabase)

To enable analysis saving, create the `startup_ideas` table in your Supabase project. Log into your Supabase SQL Editor and run:

```sql
CREATE TABLE IF NOT EXISTS startup_ideas (
  id              BIGSERIAL PRIMARY KEY,
  original_idea   TEXT        NOT NULL,
  viability_score INT         NOT NULL,
  analysis_json   JSONB       NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_startup_ideas_score
  ON startup_ideas (viability_score DESC);
```

---

_Built with AI and deployed on Vercel._
