# Smart Profiling - Backend (FastAPI) - Option B (Full ML)

This backend provides:
- POST /detect/login -> runs detection on synthetic default data
- POST /detect/upload/login -> accepts a CSV upload and returns anomaly scores

## Setup

1. Create a virtual environment (recommended)
   ```bash
   python -m venv .venv
   source .venv/bin/activate    # macOS / Linux
   .venv\Scripts\activate     # Windows PowerShell
   ```

2. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

3. Run the server
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

The server will be available at http://localhost:8000

## Notes
- The backend saves trained models to the `models/` folder.
- The Autoencoder uses TensorFlow/Keras and trains quickly on synthetic data if no saved models exist.
- For production or larger datasets, increase training epochs and persist models separately.
