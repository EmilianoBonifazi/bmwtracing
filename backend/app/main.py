# backend/app/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict

import logging
import asyncio

from agents.gen_ai_agent import run_gen_ai_agent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class AnalysisRequest(BaseModel):
    work_item_id: str

class AnalysisResponse(BaseModel):
    target_group: str
    error_timestamp: str
    root_cause: str
    description: str

class AgentRunRequest(BaseModel):
    input_text: str

class AgentRunResponse(BaseModel):
    status: str
    data: Any = None
    message: str = None

# Existing /analyze endpoint
@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(request: AnalysisRequest):
    logger.info(f"Received analysis request for Work Item ID: {request.work_item_id}")
    # Replace with your AI logic to dynamically generate these values
    return {
        "target_group": "Networking Team",  # Example target group
        "error_timestamp": "2024-03-15T11:44:58.744",  # Example timestamp
        "root_cause": "Incorrect antenna configuration detected.",  # Example root cause
        "description": f"Detailed analysis for Work Item {request.work_item_id}.",  # Example description
    }
    

# New /run_agent endpoint
@app.post("/run_agent", response_model=AgentRunResponse)
async def run_agent(request: AgentRunRequest):
    logger.info(f"Running Gen AI agent with input: {request.input_text}")
    result = await run_gen_ai_agent(request.input_text)
    if result["status"] == "success":
        return AgentRunResponse(status="success", data=result["data"])
    else:
        raise HTTPException(status_code=500, detail=result["message"])
