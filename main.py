import os
import json
import threading
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any
from google import genai
from google.genai import types
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = FastAPI()

# Initialize Supabase REST client (HTTP-based, no TCP connectivity issues)
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Optional[Client] = None

if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print(f"Supabase client initialized: {SUPABASE_URL}")
else:
    print("WARNING: SUPABASE_URL or SUPABASE_KEY not set. DB persistence disabled.")

# Set up CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IdeaRequest(BaseModel):
    startup_idea: str

class MarketSizeData(BaseModel):
    tam_usd: int
    sam_usd: int
    som_usd: int

class GTMAnalysis(BaseModel):
    ProblemStatement: List[str]
    MarketOverview: List[str]
    MarketSize: MarketSizeData
    ICP: str
    Persona: str
    GTMStrategy: List[str]
    RevenueModel: List[str]
    ROIPotential: str
    Risks: List[str]
    ViabilityScore: int

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

@app.post("/validate-idea", response_model=GTMAnalysis)
async def validate_idea(request: IdeaRequest, background_tasks: BackgroundTasks):
    if not os.environ.get("GEMINI_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY environment variable is not set."
        )

    try:
        client = genai.Client()

        system_instruction = (
            "You are a ruthless, concise Venture Capitalist and Go-To-Market strategy expert. "
            "Analyze the provided startup idea and strategically evaluate it. "
            "You must never output long paragraphs. "
            "ProblemStatement, MarketOverview, GTMStrategy, RevenueModel, and Risks MUST be arrays of strings, "
            "with a maximum of 3 short bullet points per array. "
            "MarketSize must contain strict integer values for tam_usd, sam_usd, and som_usd without any dollar signs or text. "
            "Construct your analysis strictly as a JSON object with the specified structure."
        )

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=request.startup_idea,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                response_schema=GTMAnalysis,
            ),
        )

        analysis_data = json.loads(response.text)

        # Save to Supabase REST API in background thread (non-blocking)
        def save_to_db():
            if not supabase:
                return
            try:
                extracted_score = int(analysis_data.get("ViabilityScore", 0))
                supabase.table("startup_ideas").insert({
                    "original_idea": request.startup_idea,
                    "viability_score": extracted_score,
                    "analysis_json": analysis_data
                }).execute()
                print(f"Supabase: Row saved. Score={extracted_score}")
            except Exception as db_err:
                print(f"Supabase Insertion Error: {db_err}")

        background_tasks.add_task(save_to_db)

        return analysis_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
