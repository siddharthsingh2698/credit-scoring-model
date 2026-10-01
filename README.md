# Credit Scoring Model

A reproducible machine-learning project for estimating creditworthiness from historical financial data. This is an educational prototype, not an automated lending decision system.

## Project Status

Phase 1, project setup, is complete. Dataset selection and collection are planned for Phase 2.

## Repository Structure

```text
credit-scoring-model/
|-- data/
|   |-- raw/
|   `-- processed/
|-- notebooks/
|   |-- 01_eda.ipynb
|   `-- 02_model_training.ipynb
|-- src/
|   |-- data_loader.py
|   |-- preprocessing.py
|   |-- features.py
|   |-- train.py
|   |-- evaluate.py
|   `-- predict.py
|-- models/
|-- reports/figures/
|-- app/app.py
|-- requirements.txt
`-- README.md
```

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

3. Add an appropriately licensed dataset to `data/raw/` during Phase 2. Do not commit private financial information.

## Planned Workflow

Dataset collection, validation, cleaning, exploratory analysis, feature engineering, stratified splitting, preprocessing, baseline model training, evaluation, model comparison, persistence, and prediction interface.

The initial models will be Logistic Regression, Decision Tree, and Random Forest. Evaluation will include accuracy, precision, recall, F1-score, ROC-AUC, and confusion matrices, with attention to class imbalance and data leakage.

## Responsible Use

Model output must not be treated as a guaranteed lending decision. Any realistic use would require representative data, validation, explainability, fairness analysis, regulatory review, security controls, and human oversight. Document the dataset source, license, target definition, assumptions, and limitations before training.
