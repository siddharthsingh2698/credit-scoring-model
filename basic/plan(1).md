# Plan --- Credit Scoring Model

## 1. Project Roadmap

``` text
Dataset
   ↓
Data Validation
   ↓
Data Cleaning
   ↓
EDA
   ↓
Feature Engineering
   ↓
Train/Test Split
   ↓
Preprocessing Pipeline
   ↓
Train Multiple Models
   ↓
Evaluate Models
   ↓
Compare Results
   ↓
Select Final Model
   ↓
Save Model
   ↓
Prediction Interface
   ↓
Documentation
```

## 2. Phase 1 --- Project Setup

### Tasks

1.  Create the project repository.
2.  Create a virtual environment.
3.  Install dependencies.
4.  Create the project structure.
5.  Add `.gitignore`.
6.  Add README.

### Suggested Structure

``` text
credit-scoring-model/
│
├── data/
│   ├── raw/
│   └── processed/
│
├── notebooks/
│   ├── 01_eda.ipynb
│   └── 02_model_training.ipynb
│
├── src/
│   ├── __init__.py
│   ├── data_loader.py
│   ├── preprocessing.py
│   ├── features.py
│   ├── train.py
│   ├── evaluate.py
│   └── predict.py
│
├── models/
│   └── final_model.joblib
│
├── reports/
│   └── figures/
│
├── app/
│   └── app.py
│
├── requirements.txt
├── README.md
└── .gitignore
```

## 3. Phase 2 --- Dataset Collection

### Tasks

1.  Find a suitable public credit-risk dataset.
2.  Download the dataset.
3.  Store the raw dataset in `data/raw/`.
4.  Understand the meaning of every column.
5.  Identify the target variable.
6.  Check the dataset license/usage terms.

### Deliverable

A documented dataset with a clear target definition.

## 4. Phase 3 --- Data Understanding

Perform:

-   Shape analysis.
-   Data-type analysis.
-   Missing-value analysis.
-   Duplicate analysis.
-   Unique-value analysis.
-   Target distribution.
-   Basic statistical summary.

Questions to answer:

-   How many records are available?
-   What percentage belongs to each target class?
-   Which features contain missing values?
-   Are there impossible values?
-   Are there extreme outliers?

## 5. Phase 4 --- Exploratory Data Analysis

Create visualizations for:

### Target

``` text
Creditworthy vs High Risk
```

### Financial Features

-   Income distribution.
-   Debt distribution.
-   Loan amount distribution.
-   Credit utilization.
-   Late payments.

### Relationships

Analyze relationships such as:

``` text
Income ↔ Debt
Income ↔ Creditworthiness
Debt ↔ Creditworthiness
Late Payments ↔ Creditworthiness
Credit Utilization ↔ Creditworthiness
```

### Deliverable

An EDA notebook containing charts and observations.

## 6. Phase 5 --- Data Cleaning

Implement:

1.  Missing-value handling.
2.  Duplicate handling.
3.  Invalid-value handling.
4.  Categorical normalization.
5.  Outlier investigation.

Do not blindly remove outliers. First determine whether they represent
valid financial cases.

## 7. Phase 6 --- Feature Engineering

Create meaningful financial indicators.

### Debt-to-Income Ratio

``` text
DTI = Total Debt / Income
```

### Income-to-Debt Ratio

``` text
Income-to-Debt = Income / (Total Debt + small_constant)
```

### Payment Delay Rate

``` text
Payment Delay Rate =
Number of Late Payments / Total Payments
```

### Credit Utilization

If not already available:

``` text
Credit Utilization =
Used Credit / Total Available Credit
```

The exact formulas must match the dataset's available fields.

## 8. Phase 7 --- Train/Test Split

Use a stratified split.

Example:

``` text
Training = 80%
Testing = 20%
```

Use a fixed random state for reproducibility.

Important:

Do not fit imputers, scalers, encoders, or feature-selection steps on
the complete dataset before splitting.

## 9. Phase 8 --- Preprocessing Pipeline

Build a scikit-learn pipeline.

Example architecture:

``` text
Raw Data
   ↓
Column Selection
   ↓
Numeric Imputation ──┐
                     ├──> Preprocessor
Categorical Encoding ┘
   ↓
Model
```

Use `ColumnTransformer` to handle numerical and categorical columns
separately.

## 10. Phase 9 --- Train Baseline Models

Train three models.

### Model 1 --- Logistic Regression

Purpose: - Strong interpretable baseline. - Provides probability
estimates.

### Model 2 --- Decision Tree

Purpose: - Easy-to-understand decision rules. - Captures non-linear
relationships.

### Model 3 --- Random Forest

Purpose: - Ensemble of decision trees. - Captures more complex
relationships. - Provides feature importance.

## 11. Phase 10 --- Model Evaluation

Evaluate every model using:

``` text
Accuracy
Precision
Recall
F1-Score
ROC-AUC
Confusion Matrix
```

For binary classification:

``` text
Precision = TP / (TP + FP)

Recall = TP / (TP + FN)

F1 = 2 × Precision × Recall / (Precision + Recall)
```

ROC-AUC should be calculated using prediction probabilities/scores
rather than hard class predictions.

## 12. Phase 11 --- Cross-Validation

Run stratified 5-fold cross-validation where appropriate.

Record:

-   Mean score.
-   Standard deviation.

This gives a more reliable estimate than relying on one train/test
split.

## 13. Phase 12 --- Handle Class Imbalance

First inspect class distribution.

If significantly imbalanced, experiment with:

-   Class weights.
-   Threshold tuning.
-   SMOTE or another resampling technique.

If SMOTE is used, it must be applied only to training folds/data and not
to the test set.

Compare results before and after imbalance handling.

## 14. Phase 13 --- Model Comparison

Create a table:

  Model                   Precision   Recall   F1   ROC-AUC
  --------------------- ----------- -------- ---- ---------
  Logistic Regression                             
  Decision Tree                                   
  Random Forest                                   

Do not select the model solely because it has the highest accuracy.

The final model choice should be based on the project's predefined
objective and the trade-offs among false positives, false negatives,
interpretability, calibration, and other relevant requirements.

## 15. Phase 14 --- Hyperparameter Tuning

Tune the selected candidate models using:

-   GridSearchCV, or
-   RandomizedSearchCV.

Possible Random Forest parameters:

``` text
n_estimators
max_depth
min_samples_split
min_samples_leaf
max_features
class_weight
```

Use cross-validation during tuning.

Do not tune against the final test set.

## 16. Phase 15 --- Final Evaluation

After model selection:

1.  Evaluate once on the untouched test set.
2.  Generate the confusion matrix.
3.  Generate ROC curve.
4.  Record Precision, Recall, F1 and ROC-AUC.
5.  Document the model configuration.

## 17. Phase 16 --- Explainability

For the final model:

-   Generate feature importance.
-   Explain important variables.
-   Optionally use SHAP for local and global explanations.

Example:

``` text
Important factors:
1. Payment history
2. Debt-to-income ratio
3. Credit utilization
4. Number of late payments
```

These explanations should be presented as model
associations/contributions, not as proof of causation.

## 18. Phase 17 --- Save the Model

Save the complete preprocessing + model pipeline using `joblib`.

Example concept:

``` text
models/
└── credit_scoring_pipeline.joblib
```

The saved artifact should include all preprocessing required for
prediction.

## 19. Phase 18 --- Build Prediction Interface

Start with a simple command-line or notebook interface.

Input:

``` text
Income
Debt
Credit History
Credit Utilization
Late Payments
Loan Amount
...
```

Output:

``` text
Predicted Class
Probability
Model
```

Optional next step:

Build a Streamlit or Gradio web application.

## 20. Phase 19 --- Testing

Test:

### Data Tests

-   Missing values.
-   Invalid input.
-   Unexpected categories.
-   Negative financial values.

### Model Tests

-   Prediction shape.
-   Probability range.
-   Reproducibility.
-   Saved model loading.

### Interface Tests

-   Valid applicant.
-   Missing input.
-   Invalid input.
-   Extreme values.

## 21. Phase 20 --- Documentation

README should contain:

1.  Project overview.
2.  Problem statement.
3.  Dataset information.
4.  Features.
5.  Installation.
6.  Project structure.
7.  How to train.
8.  How to evaluate.
9.  How to run prediction.
10. Results.
11. Limitations.
12. Responsible-ML considerations.

## 22. Final Deliverables

``` text
✓ Dataset
✓ Data cleaning pipeline
✓ EDA notebook
✓ Feature engineering
✓ Preprocessing pipeline
✓ Logistic Regression
✓ Decision Tree
✓ Random Forest
✓ Model evaluation
✓ Model comparison
✓ Final saved model
✓ Prediction interface
✓ Explainability
✓ README
✓ Requirements file
✓ Project documentation
```

## 23. Suggested 7-Day Schedule

### Day 1

-   Project setup.
-   Dataset selection.
-   Dataset understanding.

### Day 2

-   Data cleaning.
-   EDA.

### Day 3

-   Feature engineering.
-   Preprocessing pipeline.

### Day 4

-   Train Logistic Regression.
-   Train Decision Tree.
-   Train Random Forest.

### Day 5

-   Evaluation.
-   Cross-validation.
-   Handle class imbalance.
-   Model comparison.

### Day 6

-   Hyperparameter tuning.
-   Final evaluation.
-   Explainability.
-   Save model.

### Day 7

-   Build prediction UI.
-   Testing.
-   README.
-   GitHub cleanup.

## 24. Definition of Done

The project is complete when a new user can:

``` text
Install dependencies
      ↓
Load the dataset
      ↓
Run preprocessing
      ↓
Train the models
      ↓
Compare metrics
      ↓
Load the saved pipeline
      ↓
Enter applicant data
      ↓
Receive a prediction
      ↓
Understand the important model factors
```

The project should also clearly state that a machine-learning prediction
is not, by itself, a complete or validated lending decision.
