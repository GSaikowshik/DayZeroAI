import os
import json
import threading
from fastapi import FastAPI, HTTPException, BackgroundTasks, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any
import httpx
from google import genai
from google.genai import types
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = FastAPI()

# Initialize Supabase REST client (HTTP-based, no TCP connectivity issues)
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")  # anon/publishable key (for token verification apikey header)
# Use service_role key for server-side DB queries to bypass RLS
# Falls back to anon key if service_role is not set
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", SUPABASE_KEY)
supabase: Optional[Client] = None

if SUPABASE_URL and SUPABASE_SERVICE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    print(f"Supabase client initialized: {SUPABASE_URL} (service_role: {'SUPABASE_SERVICE_ROLE_KEY' in os.environ})")
else:
    print("WARNING: SUPABASE_URL or SUPABASE_KEY not set. DB persistence disabled.")

# Set up CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IdeaRequest(BaseModel):
    startup_idea: str
    user_id: Optional[str] = None
    questions: Optional[List[str]] = None
    answers: Optional[List[str]] = None

class QuestionsResponse(BaseModel):
    questions: List[str]

class RevenueProjection(BaseModel):
    year: str
    revenue: int

class MarketShare(BaseModel):
    name: str
    share: int

class CompetitorComparison(BaseModel):
    feature: str
    competitor_a: str
    competitor_b: str
    dayzero_ai: str

class ChartData(BaseModel):
    revenue_projection: List[RevenueProjection]
    market_share_pie: List[MarketShare]
    competitor_comparison_table: List[CompetitorComparison]
    viability_score: int

class GTMAnalysis(BaseModel):
    markdown_text: str
    chart_data: ChartData

async def _verify_user_token(authorization: str) -> str:
    """Verify a Supabase JWT and return the user ID."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header.")
    token = authorization.replace("Bearer ", "")
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{SUPABASE_URL}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": SUPABASE_KEY or "",
                },
            )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid or expired token.")
        user_data = resp.json()
        return user_data["id"]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {e}")


@app.get("/history")
async def get_history(authorization: str = Header(...)):
    """Fetch all saved analyses for the authenticated user, newest first."""
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not configured.")
    user_id = await _verify_user_token(authorization)
    print(f"[/history] Verified user_id: {user_id}")
    try:
        response = supabase.table("startup_ideas") \
            .select("id, original_idea, viability_score, analysis_json, created_at") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .limit(50) \
            .execute()
        print(f"[/history] Rows returned: {len(response.data)}")
        return {"history": response.data}
    except Exception as e:
        print(f"[/history] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/ideas")
async def get_ideas():
    """Fetch all saved startup idea analyses from Supabase."""
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not configured.")
    try:
        response = supabase.table("startup_ideas") \
            .select("id, original_idea, viability_score, created_at") \
            .order("created_at", desc=True) \
            .limit(20) \
            .execute()
        return {"ideas": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ideas/{idea_id}")
async def get_idea(idea_id: int):
    """Fetch a specific saved analysis by ID."""
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not configured.")
    try:
        response = supabase.table("startup_ideas") \
            .select("*") \
            .eq("id", idea_id) \
            .single() \
            .execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-questions", response_model=QuestionsResponse)
async def generate_questions(request: IdeaRequest):
    if not os.environ.get("GEMINI_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY environment variable is not set."
        )

    try:
        client = genai.Client()

        system_instruction = (
            "You are an elite Y Combinator partner. A founder has come to you with a brief startup idea. "
            "You need to ask 3 highly specific, sharply focused clarifying questions to determine if this idea has legs. "
            "Your questions should probe their target customer, monetization strategy, or unique wedge into the market. "
            "Do not ask generic questions. They must be directly related to the provided idea.\n\n"
            "Return EXACTLY 3 questions as a structured JSON array of strings under the key 'questions'."
        )

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=request.startup_idea,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                response_schema=QuestionsResponse,
            ),
        )

        data = json.loads(response.text)
        return data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/validate-idea", response_model=GTMAnalysis)
async def validate_idea(request: IdeaRequest, background_tasks: BackgroundTasks, authorization: Optional[str] = Header(None)):
    if not os.environ.get("GEMINI_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY environment variable is not set."
        )

    try:
        client = genai.Client()

        system_instruction = (
            "You are an elite Y Combinator partner with 15 years of experience evaluating thousands of startups. "
            "You combine sharp analytical thinking with a visionary, encouraging tone. You believe every founder "
            "deserves honest, actionable feedback delivered with respect and creative insight.\n\n"

            "Analyze the given startup idea and produce a structured JSON response with exactly TWO main keys:\n\n"

            "1. **markdown_text** (string): A beautifully formatted Markdown string containing your creative, "
            "visionary text analysis. It should include bold headings (e.g., '## The Verdict', '## Deep Dive Analysis', "
            "'## The Pivot Elements', '## Actionable Tips'), bullet points, and highly readable formatting. Maintain the "
            "aggressive, brilliant founder-friendly tone. Make it compelling to read.\n\n"

            "2. **chart_data** (object): A JSON object containing realistic, realistic mock data arrays for visual charts:\n"
            "   - `revenue_projection`: Array of objects with 'year' (string, e.g. 'Year 1', 'Year 2') and 'revenue' (integer USD).\n"
            "   - `market_share_pie`: Array of objects with 'name' (string) and 'share' (integer percentage) representing "
            "Competitor A, Competitor B, and the DayZero AI Idea. The shares must sum to 100.\n"
            "   - `competitor_comparison_table`: Array of objects with 'feature' (string), 'competitor_a' (boolean/string), "
            "'competitor_b' (boolean/string), and 'dayzero_ai' (boolean/string) to show where the idea wins.\n"
            "   - `viability_score`: Integer (0-100) reflecting your honest assessment.\n\n"

            "IMPORTANT FORMATTING RULES:\n"
            "- The entire response must strictly conform to the JSON schema provided.\n"
            "- Do NOT wrap the JSON in markdown code blocks inside the actual model response string."
        )

        user_prompt = f"Startup Idea: {request.startup_idea}\n"
        if request.questions and request.answers and len(request.questions) == len(request.answers):
            user_prompt += "\nFounder's Deep Dive Answers:\n"
            for q, a in zip(request.questions, request.answers):
                user_prompt += f"- Question: {q}\n  Answer: {a}\n"

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                response_schema=GTMAnalysis,
            ),
        )

        analysis_data = json.loads(response.text)

        # Extract user_id securely if token is provided
        extracted_user_id = None
        if authorization:
            try:
                extracted_user_id = await _verify_user_token(authorization)
            except Exception as auth_err:
                print(f"Auth error during validate-idea: {auth_err}")
                pass

        # Save to Supabase REST API in background is disabled
        # Frontend handles clientside writes for complete RLS context safety.

        return analysis_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
