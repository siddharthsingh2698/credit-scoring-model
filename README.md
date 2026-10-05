# Credit Scoring Model

A reproducible machine-learning project for estimating creditworthiness from financial profile data. This is an educational prototype and should not be treated as an autonomous lending decision system.

## Project Status

This project is now complete through the full end-to-end workflow: dataset validation, feature engineering, preprocessing, model training, evaluation, save/load of the trained pipeline, and single-record prediction.

## Repository Structure

```text
credit-scoring-model/
|-- app/
|   `-- app.py
|-- data/
|   |-- processed/
|   `-- raw/
|       `-- credit_scoring_dataset.csv
|-- models/
|   `-- credit_scoring_pipeline.joblib
|-- notebooks/
|   |-- 01_eda.ipynb
|   `-- 02_model_training.ipynb
|-- reports/
|   `-- figures/
|-- src/
|   |-- __init__.py
|   |-- data_loader.py
|   |-- features.py
|   |-- preprocessing.py
|   |-- train.py
|   |-- evaluate.py
|   |-- predict.py
|   `-- __pycache__/
|-- .gitignore
|-- README.md
|-- requirements.txt
`-- tests/
    `-- test_credit_scoring_pipeline.py
```

## Dataset

A synthetic credit-scoring dataset is included in `data/raw/credit_scoring_dataset.csv` so the project can run without external private financial data. The target variable is `risk_flag`, where:

- `1` = low risk / creditworthy
- `0` = high risk

## Setup

1. Create and activate a virtual environment:

   ```powershell
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

2. Install dependencies:

   ```powershell
   python -m pip install --upgrade pip
   python -m pip install -r requirements.txt
   ```

3. Generate or replace the dataset if needed:

   ```powershell
   python -c "from src.data_loader import create_demo_dataset; create_demo_dataset()"
   ```

## Train the Models

```powershell
python -c "from src.data_loader import load_dataset; from src.train import train_and_evaluate; df = load_dataset('data/raw/credit_scoring_dataset.csv'); results = train_and_evaluate(df); print(results['best_model'])"
```

This trains each of the required baseline models:

- Logistic Regression
- Decision Tree
- Random Forest

It evaluates them with accuracy, precision, recall, F1-score, ROC-AUC, and confusion matrix, then saves the best-performing pipeline to `models/credit_scoring_pipeline.joblib`.

## Run Prediction

```powershell
python app/app.py --model-path models/credit_scoring_pipeline.joblib
```

This loads the saved model and returns a predicted label plus probability for a sample applicant profile.

## Example Applicant Input

```python
applicant = {
    "age": 35,
    "income": 85000,
    "employment_years": 7,
    "total_debt": 18000,
    "monthly_debt_payment": 450,
    "credit_history_years": 8,
    "credit_utilization": 0.20,
    "total_accounts": 8,
    "late_payments": 1,
    "payment_history_score": 80,
    "loan_amount": 22000,
    "loan_term": 48,
}
```

## Responsible Use

The model is a learning exercise, not a legally validated credit decision engine. It should be interpreted as an association model and reviewed with human oversight, fairness checks, dataset documentation, and domain validation before any real-world use.

## Verification

The project includes automated tests in `tests/test_credit_scoring_pipeline.py` covering:

- dataset loading and validation
- feature engineering
- preprocessing construction
- model training and metrics
- single-record prediction
