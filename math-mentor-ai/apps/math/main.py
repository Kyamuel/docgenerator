from fastapi import FastAPI
from pydantic import BaseModel
import os
import httpx
from typing import Optional, Dict, Any
from sympy import sympify, Eq, solve

app = FastAPI(title="MathMentor AI Math Service")

class SolveRequest(BaseModel):
    problem: str
    mode: Optional[str] = "standard"  # standard | socratic
    difficulty: Optional[str] = "BEGINNER"

class SolveResponse(BaseModel):
    steps: list
    latex: str
    diagram: Optional[str] = None  # Mermaid code block
    similar_problem: Optional[str] = None
    score: Optional[int] = 0
    correct: Optional[bool] = False

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

async def call_openai(problem: str, mode: str) -> Dict[str, Any]:
    system = (
        "You are MathMentor, an expert math tutor. Provide step-by-step guidance with LaTeX. "
        "If socratic, ask guiding questions and then give hints. Provide a similar problem at the end. "
        "If a diagram helps, output a concise Mermaid diagram under a 'diagram' section as fenced code."
    )
    prompt = f"Problem: {problem}\nMode: {mode}\nReturn JSON with keys: steps (array of latex), latex (string), diagram (string or null), similar_problem (string)."
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    body = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
        "response_format": {"type": "json_object"}
    }
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=body)
        r.raise_for_status()
        data = r.json()
        content = data["choices"][0]["message"]["content"]
        import json
        return json.loads(content)

async def sympy_fallback(problem: str) -> Dict[str, Any]:
    # Very naive fallback for equations like "solve x + 2 = 5"
    try:
        if "=" in problem:
            left, right = problem.split("=", 1)
            eq = Eq(sympify(left), sympify(right))
            sol = solve(eq)
            steps = [f"Solve: ${left} = {right}$", f"Solution: $x = {sol}$"]
            return {"steps": steps, "latex": "\\n".join(steps), "diagram": None, "similar_problem": "Solve x + 3 = 7"}
        else:
            expr = sympify(problem)
            val = expr.evalf()
            steps = [f"Compute: ${problem}$", f"Result: ${val}$"]
            return {"steps": steps, "latex": "\\n".join(steps), "diagram": None, "similar_problem": "Compute 3*(4+5)"}
    except Exception:
        steps = ["Unable to parse problem. Please rephrase."]
        return {"steps": steps, "latex": "Unable to parse.", "diagram": None, "similar_problem": None}

@app.post("/solve", response_model=SolveResponse)
async def solve_endpoint(req: SolveRequest):
    if OPENAI_API_KEY:
        try:
            data = await call_openai(req.problem, req.mode)
            steps = data.get("steps") or []
            latex = data.get("latex") or ""
            diagram = data.get("diagram")
            similar = data.get("similar_problem")
            return SolveResponse(steps=steps, latex=latex, diagram=diagram, similar_problem=similar, score=0, correct=False)
        except Exception:
            pass
    data = await sympy_fallback(req.problem)
    return SolveResponse(steps=data["steps"], latex=data["latex"], diagram=data.get("diagram"), similar_problem=data.get("similar_problem"), score=0, correct=False)