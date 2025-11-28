from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import io
import os
from app.ml import load_or_train_models, score_dataframe, save_models_if_needed

app = FastAPI(title="Smart Profiling - Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")

# Ensure models directory exists
os.makedirs(MODEL_DIR, exist_ok=True)

# Load or train models on startup (non-blocking quick)
IF_MODEL, AE_MODEL, SCALER = load_or_train_models(MODEL_DIR)

@app.post("/detect/login")
async def detect_default():
    """Run detection on default (synthetic) data and return results."""
    # Create synthetic dataset (same feature names expected by front-end)
    rng = np.random.RandomState(42)
    X = rng.normal(size=(500, 10))
    df = pd.DataFrame(X, columns=[f"f{i}" for i in range(X.shape[1])])
    results = score_dataframe(df, IF_MODEL, AE_MODEL, SCALER, top_k=20)
    # Optionally save models
    save_models_if_needed(IF_MODEL, AE_MODEL, SCALER, MODEL_DIR)
    return results

@app.post("/detect/upload/login")
async def detect_upload(file: UploadFile = File(...)):
    """Accepts a CSV file, runs preprocessing and detection, returns JSON results."""
    if not file.filename.lower().endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted")
    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {e}")
    if df.empty:
        raise HTTPException(status_code=400, detail="Uploaded CSV is empty")
    # Score
    results = score_dataframe(df, IF_MODEL, AE_MODEL, SCALER, top_k=50)
    save_models_if_needed(IF_MODEL, AE_MODEL, SCALER, MODEL_DIR)
    return results
