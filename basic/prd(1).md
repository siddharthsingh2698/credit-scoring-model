# PRD --- Credit Scoring Model

## 1. Product Overview

### Product Name

Credit Scoring Model

### Objective

Build a machine learning system that predicts an individual's
creditworthiness using historical financial data.

The system will analyze financial and repayment information and classify
applicants into credit-risk categories or predict a binary outcome such
as:

-   `1` = Creditworthy / Low Risk
-   `0` = Not Creditworthy / High Risk

The project will compare multiple classification algorithms and evaluate
them using business-relevant metrics such as Precision, Recall,
F1-Score, and ROC-AUC.

## 2. Problem Statement

Financial institutions need a consistent way to estimate the likelihood
that an applicant will repay credit.

Manual assessment can be time-consuming and may be inconsistent. This
project aims to create a data-driven model that uses historical
financial information to estimate credit risk.

The model is intended as a learning/project prototype and should not be
treated as a production lending decision system without additional
validation, regulatory review, fairness testing, explainability,
security, and human oversight.

## 3. Goals

### Primary Goals

1.  Prepare and clean historical financial data.
2.  Perform exploratory data analysis.
3.  Engineer meaningful financial features.
4.  Train multiple classification models.
5.  Compare model performance.
6.  Select a model based on predefined evaluation criteria rather than
    accuracy alone.
7.  Provide a simple prediction interface/API.
8.  Explain the factors contributing to a prediction.
9.  Document limitations, assumptions, and ethical considerations.

### Success Criteria

The project is successful when:

-   The dataset is cleaned and reproducibly processed.
-   The model can generate a credit-risk prediction for a new applicant.
-   Precision, Recall, F1-Score, ROC-AUC, and confusion matrix are
    reported.
-   Multiple models are compared.
-   Data leakage is avoided.
-   The final pipeline can be reproduced from raw data to prediction.
-   Basic fairness and feature-importance checks are documented.

## 4. Target Users

### Primary User

A developer/data-science student who wants to analyze and predict credit
risk from financial data.

### Secondary User

A reviewer/interviewer who wants to see the complete machine-learning
workflow.

## 5. Proposed Features

### 5.1 Data Upload

Support CSV-based datasets containing applicant financial information.

### 5.2 Data Preprocessing

-   Handle missing values.
-   Remove or investigate duplicates.
-   Detect invalid values.
-   Encode categorical variables.
-   Scale numerical variables where appropriate.
-   Handle class imbalance.
-   Split data into training and testing sets.

### 5.3 Exploratory Data Analysis

Visualize: - Income distribution. - Debt distribution. - Credit
utilization. - Payment history. - Credit history length. - Target-class
distribution. - Correlations between numerical variables.

### 5.4 Feature Engineering

Potential derived features:

-   Debt-to-income ratio.
-   Credit utilization ratio.
-   Payment delay rate.
-   Total monthly financial obligations.
-   Average account balance.
-   Credit history age.
-   Number of late payments.
-   Number of active accounts.
-   Income-to-debt ratio.

Example:

`Debt-to-Income Ratio = Total Monthly Debt / Monthly Income`

### 5.5 Model Training

Initial models:

1.  Logistic Regression
2.  Decision Tree
3.  Random Forest

Optional future models: - Gradient Boosting - XGBoost - LightGBM

### 5.6 Model Evaluation

Required metrics:

-   Precision
-   Recall
-   F1-Score
-   ROC-AUC
-   Accuracy
-   Confusion Matrix

For imbalanced datasets, Precision, Recall, F1-Score and ROC-AUC should
receive more attention than accuracy alone.

### 5.7 Prediction

The application should accept applicant information and return:

-   Predicted class.
-   Risk probability/score.
-   Model used.
-   Basic explanation of influential features.

Example output:

``` text
Prediction: Low Risk
Probability of Creditworthy: 0.82
Model: Random Forest
```

### 5.8 Explainability

Provide feature importance using methods appropriate to the model.

Possible techniques: - Logistic Regression coefficients. - Decision Tree
feature importance. - Random Forest feature importance. - SHAP as an
optional enhancement.

## 6. Suggested Dataset Schema

Possible fields:

  Feature                 Type      Description
  ----------------------- --------- -------------------------------------
  age                     numeric   Applicant age
  income                  numeric   Annual/monthly income
  employment_years        numeric   Employment duration
  total_debt              numeric   Total outstanding debt
  monthly_debt_payment    numeric   Monthly debt payment
  credit_history_years    numeric   Length of credit history
  credit_utilization      numeric   Percentage of available credit used
  total_accounts          numeric   Number of credit accounts
  late_payments           numeric   Number of late payments
  payment_history_score   numeric   Historical repayment score
  loan_amount             numeric   Requested loan amount
  loan_term               numeric   Requested repayment term
  target                  binary    Credit-risk outcome

The exact schema should be adapted to the selected dataset.

## 7. Non-Functional Requirements

### Reproducibility

-   Use a fixed random seed.
-   Keep preprocessing inside a reproducible pipeline.
-   Record dataset and model versions where possible.

### Performance

Prediction for one applicant should complete quickly on normal hardware.

### Maintainability

Use separate modules for: - Data loading. - Preprocessing. - Feature
engineering. - Training. - Evaluation. - Prediction.

### Security

-   Do not expose raw financial data unnecessarily.
-   Do not store sensitive applicant information in logs.
-   Validate user inputs.

## 8. Ethical and Fairness Requirements

Because credit scoring can materially affect people's access to
financial services:

-   Do not use protected characteristics unless there is a legitimate,
    documented reason for analysis.
-   Check for proxy variables that may indirectly encode protected
    characteristics.
-   Evaluate performance across relevant groups when appropriate and
    legally permissible.
-   Document dataset limitations and historical bias.
-   Do not present model output as a guaranteed lending decision.
-   Keep human review and institutional policy outside the ML prediction
    itself.

## 9. Out of Scope

-   Real-world loan approval.
-   Automated lending decisions.
-   Connection to banking systems.
-   Credit bureau integration.
-   Collection of real customer financial data.
-   Production deployment without further validation.
-   Guaranteed interpretation of individual financial behavior.

## 10. Future Enhancements

-   Streamlit/Gradio web interface.
-   REST API using Flask/FastAPI.
-   SHAP explanations.
-   Hyperparameter tuning.
-   Cross-validation.
-   Model monitoring.
-   Drift detection.
-   Fairness dashboards.
-   Docker deployment.
-   Cloud deployment.
