# Requirements --- Credit Scoring Model

## 1. Project Requirements

The system must predict creditworthiness from historical financial data
using supervised classification.

## 2. Functional Requirements

### FR-01 --- Dataset Loading

The system shall load financial data from a CSV file.

### FR-02 --- Data Validation

The system shall: - Verify required columns. - Identify missing
values. - Identify duplicate records. - Detect invalid numerical
values. - Report dataset dimensions.

### FR-03 --- Data Cleaning

The system shall: - Handle missing values. - Remove or appropriately
handle duplicates. - Correct or exclude invalid records. - Handle
inconsistent categorical values.

### FR-04 --- Exploratory Data Analysis

The system shall generate analysis for: - Target distribution. -
Numerical feature distributions. - Categorical feature distributions. -
Correlation analysis. - Outlier analysis.

### FR-05 --- Feature Engineering

The system should create useful derived variables such as: -
Debt-to-income ratio. - Credit utilization ratio. - Payment delay
rate. - Income-to-debt ratio.

Feature engineering must be performed without using future information
that would cause data leakage.

### FR-06 --- Data Splitting

The dataset shall be divided into: - Training set. - Validation set, if
used. - Test set.

A stratified split should be used for classification when appropriate.

### FR-07 --- Preprocessing Pipeline

The system shall support: - Numerical imputation. - Categorical
imputation. - One-hot encoding or suitable categorical encoding. -
Feature scaling where required.

Preprocessing parameters must be learned only from training data.

### FR-08 --- Model Training

The system shall support at least:

-   Logistic Regression.
-   Decision Tree.
-   Random Forest.

### FR-09 --- Model Evaluation

The system shall calculate:

-   Accuracy.
-   Precision.
-   Recall.
-   F1-Score.
-   ROC-AUC.
-   Confusion Matrix.

### FR-10 --- Model Comparison

The system shall produce a comparison table containing model names and
evaluation metrics.

Example:

  Model                   Precision   Recall    F1   ROC-AUC
  --------------------- ----------- -------- ----- ---------
  Logistic Regression           ---      ---   ---       ---
  Decision Tree                 ---      ---   ---       ---
  Random Forest                 ---      ---   ---       ---

The project must not choose a model using accuracy alone.

### FR-11 --- Prediction

The system shall accept applicant financial information and return: -
Predicted class. - Probability/estimated risk. - Model name.

### FR-12 --- Explainability

The system should provide information about important features affecting
predictions.

### FR-13 --- Model Persistence

The final preprocessing pipeline and model should be saved so that they
can be reused without retraining.

## 3. Data Requirements

### Required Data Characteristics

The dataset should contain: - Historical financial information. - A
clearly defined target variable. - Sufficient observations for training
and testing. - Numerical and/or categorical features relevant to credit
risk.

### Recommended Features

``` text
age
income
employment_years
total_debt
monthly_debt_payment
credit_history_years
credit_utilization
total_accounts
late_payments
payment_history_score
loan_amount
loan_term
target
```

## 4. Machine Learning Requirements

### Classification

The target must represent a classification problem.

Example:

``` text
0 = High Risk
1 = Low Risk
```

The exact meaning must be documented according to the chosen dataset.

### Class Imbalance

If the target classes are imbalanced, the project should consider:

-   `class_weight="balanced"`
-   Stratified splitting.
-   Appropriate threshold selection.
-   Oversampling techniques such as SMOTE, if justified.

Accuracy should not be used as the only metric.

### Cross-Validation

Use stratified cross-validation for robust model comparison where
appropriate.

Recommended starting point:

``` text
5-fold Stratified Cross-Validation
```

## 5. Technical Requirements

### Recommended Language

Python 3.10+

### Recommended Libraries

``` text
pandas
numpy
scikit-learn
matplotlib
seaborn
joblib
```

Optional:

``` text
imbalanced-learn
shap
streamlit
fastapi
uvicorn
```

### Development Environment

Any of the following may be used:

-   VS Code
-   Jupyter Notebook
-   Google Colab
-   PyCharm

## 6. Hardware Requirements

Minimum:

-   4 GB RAM.
-   Dual-core CPU.
-   1 GB available storage.

Recommended:

-   8 GB+ RAM.
-   4+ CPU cores.

GPU is not required for the initial models.

## 7. Non-Functional Requirements

### NFR-01 --- Accuracy and Reliability

The pipeline must produce reproducible results when the same data and
random seed are used.

### NFR-02 --- Reproducibility

The project shall document: - Dataset source. - Dataset version/date
where available. - Random seed. - Feature-processing steps. - Model
parameters.

### NFR-03 --- Performance

Single-record prediction should normally complete within a few seconds
on standard hardware.

### NFR-04 --- Maintainability

Code should be modular and separated by responsibility.

### NFR-05 --- Usability

The prediction interface should use clear labels and validation
messages.

### NFR-06 --- Privacy

No real personal financial information should be committed to the Git
repository.

## 8. Fairness and Responsible-ML Requirements

The project should:

-   Document potential dataset bias.
-   Avoid unnecessary sensitive attributes.
-   Investigate proxy variables.
-   Compare model performance across relevant groups when appropriate.
-   Document limitations.
-   Avoid representing the model as a legally or financially validated
    lending decision system.

## 9. Acceptance Criteria

The project is considered complete when:

-   [ ] Dataset can be loaded successfully.
-   [ ] Data quality checks are implemented.
-   [ ] EDA is completed.
-   [ ] Feature engineering is implemented.
-   [ ] Train/test split is implemented correctly.
-   [ ] Preprocessing pipeline is implemented.
-   [ ] Logistic Regression is trained.
-   [ ] Decision Tree is trained.
-   [ ] Random Forest is trained.
-   [ ] Precision is calculated.
-   [ ] Recall is calculated.
-   [ ] F1-Score is calculated.
-   [ ] ROC-AUC is calculated.
-   [ ] Confusion matrices are generated.
-   [ ] Models are compared.
-   [ ] Final model is saved.
-   [ ] New applicant prediction works.
-   [ ] Basic explainability is provided.
-   [ ] README/documentation is completed.
