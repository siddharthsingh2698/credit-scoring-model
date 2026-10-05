# Vectura.AI - Credit Risk Engine

## 1. Project Overview
Vectura.AI is an educational, production-grade Machine Learning application for estimating creditworthiness from financial profile data. It features a fully trained Random Forest model, a blazing-fast Python FastAPI backend, and a modern React dashboard that provides algorithmic predictions and Explainable AI (SHAP) attributions in real-time.

## 2. Tech Stack & Tools
**Machine Learning & Data Science:**
- `scikit-learn`: Random Forest Classifier, Pipelines, Data Preprocessing
- `pandas` & `numpy`: Data manipulation and feature engineering
- `imbalanced-learn`: Handling class imbalances via SMOTE/class weights

**Backend (API):**
- `FastAPI`: High-performance asynchronous REST API framework
- `Uvicorn`: ASGI web server for Python
- `Pydantic`: Data validation and schema enforcement

**Frontend (UI):**
- `React 19`: Component-based UI library
- `TypeScript`: Strongly typed JavaScript
- `Vite`: Next-generation frontend tooling/bundler
- `Tailwind CSS v4`: Utility-first CSS framework for dark-mode styling
- `lucide-react`: Modern iconography

## 3. Dataset Information
The project uses the classic **German Credit Risk** dataset sourced from OpenML. 
- **Records**: 1,000
- **Target Variable**: `class` (good / bad)
- **Engineered Features**: `monthly_payment_estimate`, `credit_per_age`, `is_multi_credit`, `is_young_borrower`

## 4. Project Structure
```text
credit-scoring-model/
|-- UI/
|   `-- vectura.ai---credit-risk-engine/ # React/Vite Frontend Source
|-- app/
|   `-- api.py                           # FastAPI Backend Server
|-- data/
|   |-- processed/                       # Cleaned & Engineered Data
|   `-- raw/                             # Original OpenML dataset
|-- models/
|   `-- final_tuned_model.joblib         # Final model weights
|-- src/                                 # Core Python ML modules
`-- README.md
```

## 5. Local Installation & Running

### Step A: Start the ML Backend (FastAPI)
1. Create and activate a virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
2. Install dependencies:
   ```powershell
   python -m pip install -r requirements.txt
   python -m pip install fastapi uvicorn pydantic imbalanced-learn
   ```
3. Run the server:
   ```powershell
   python -m uvicorn app.api:app --reload --port 8000
   ```

### Step B: Start the Frontend UI (React)
1. Open a **new** terminal window and navigate to the UI folder:
   ```powershell
   cd UI/vectura.ai---credit-risk-engine
   ```
2. Install dependencies (using legacy peer deps for React 19 compatibility):
   ```powershell
   npm install --legacy-peer-deps
   ```
3. Run the dashboard:
   ```powershell
   npm run dev
   ```
4. Open your browser to `http://localhost:3000` (or the port Vite provides).

## 6. Model Results
The final tuned **Random Forest** model (using `class_weight='balanced'`) achieved the following metrics on unseen test data:
- **Accuracy**: 73.0%
- **ROC-AUC**: 78.5%
- **F1-Score**: 80.8%

## 7. Responsible ML Considerations
This model is a learning exercise, not a legally validated credit decision engine. Features like `age` and `foreign_worker` are included as per the original dataset, but in real-world modern lending, using protected characteristics can violate anti-discrimination laws (e.g., ECOA in the US). It should be interpreted as an association model and reviewed with human oversight and fairness checks before real-world use.
