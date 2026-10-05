# Credit Scoring Model

## 1. Project Overview
A machine-learning project for estimating creditworthiness from financial profile data. This is an educational prototype that implements a full end-to-end data science lifecycle, from data collection to hyperparameter tuning and model prediction.

## 2. Problem Statement
Financial institutions need a consistent way to estimate the likelihood that an applicant will repay credit. Manual assessment can be time-consuming and inconsistent. This project aims to create a data-driven model that uses historical financial information to estimate credit risk reliably.

## 3. Dataset Information
The project uses the classic **German Credit Risk** dataset sourced from OpenML (originally UCI Machine Learning Repository). 
- **Records**: 1,000
- **Target Variable**: `class` (good / bad)
- **Class Imbalance**: 70% good, 30% bad

*More details can be found in `data/raw/DATASET_INFO.md` and the Phase 3 EDA report.*

## 4. Features & Engineering
The dataset contains 20 raw financial features (like `credit_amount`, `duration`, `checking_status`, and `age`). 
During the preprocessing phase, we engineered four critical indicators:
- `monthly_payment_estimate` (Credit amount / Duration)
- `credit_per_age` (Credit amount / Age)
- `is_multi_credit` (Flag for >1 existing credits)
- `is_young_borrower` (Flag for Age < 25)

## 5. Installation
1. Create and activate a virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
2. Install dependencies:
   ```powershell
   python -m pip install --upgrade pip
   python -m pip install -r requirements.txt
   python -m pip install imbalanced-learn
   ```

## 6. Project Structure
```text
credit-scoring-model/
|-- app/
|   `-- app.py                   # Prediction CLI
|-- data/
|   |-- processed/               # Cleaned & Engineered Data
|   |   `-- split/               # Train/Test splits
|   `-- raw/                     # Original OpenML dataset
|-- models/
|   `-- final_tuned_model.joblib # Final model weights
|-- notebooks/
|   `-- 01_eda.ipynb             # Exploratory Data Analysis
|-- src/                         # Core Python modules
|   |-- data_cleaning.py
|   |-- evaluate.py
|   |-- feature_engineering.py
|   |-- model_optimization.py
|   |-- preprocessing.py
|   |-- train.py
|   `-- train_test_split.py
`-- README.md
```

## 7. How to Train
To retrain the baseline models from scratch using the processed data splits:
```powershell
python src/train.py
```
To run the full cross-validation and hyperparameter tuning optimization suite:
```powershell
python src/model_optimization.py
```

## 8. How to Evaluate
To evaluate the baseline models against the untouched test set (200 records):
```powershell
python src/evaluate.py
```
To evaluate the final tuned model and extract feature importances:
```powershell
python src/final_evaluation.py
```

## 9. How to Run Prediction
You can run the prediction interface to classify a sample applicant:
```powershell
python app/app.py
```
To run it on a specific JSON file of applicant data:
```powershell
python app/app.py --input path/to/applicant.json
```

## 10. Results
The final tuned **Random Forest** model (using `class_weight='balanced'`) achieved the following metrics on unseen test data:
- **Accuracy**: 73.0%
- **ROC-AUC**: 78.5%
- **F1-Score**: 80.8%

The most highly associated factors for credit risk were our engineered `monthly_payment_estimate`, `checking_status`, and `credit_per_age`.

## 11. Limitations
The model is trained on a relatively small historical dataset from 1994 (Germany). It lacks modern macroeconomic indicators and alternative data points (e.g., utility bills). The 70/30 class imbalance was mitigated via class weighting, but false positives remain a challenge.

## 12. Responsible ML Considerations
This model is a learning exercise, not a legally validated credit decision engine. Features like `age` and `foreign_worker` are included as per the original dataset, but in real-world modern lending, using protected characteristics can violate anti-discrimination laws (e.g., ECOA in the US). It should be interpreted as an association model and reviewed with human oversight and fairness checks before real-world use.
