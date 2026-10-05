import pandas as pd

from src.data_loader import load_dataset, validate_dataset
from src.features import engineer_features
from src.predict import predict_single
from src.preprocessing import build_preprocessor
from src.train import train_and_evaluate


def build_sample_dataset():
    data = {
        "checking_status": ["<0", "0<=X<200", "no checking", "<0", "no checking", "0<=X<200", "no checking", "<0", "0<=X<200", "no checking"],
        "duration": [6, 48, 12, 42, 24, 36, 24, 18, 30, 15],
        "credit_history": ["critical/other existing credit", "existing paid", "critical/other existing credit", "existing paid", "delayed previously", "existing paid", "existing paid", "critical/other existing credit", "existing paid", "existing paid"],
        "purpose": ["radio/tv", "radio/tv", "education", "furniture/equipment", "new car", "education", "furniture/equipment", "used car", "new car", "radio/tv"],
        "credit_amount": [1169, 5951, 2096, 7882, 4870, 9055, 2835, 6948, 5234, 1567],
        "savings_status": ["no known savings", "<100", "<100", "<100", "<100", "no known savings", "500<=X<1000", "<100", "<100", "no known savings"],
        "employment": [">=7", "1<=X<4", "4<=X<7", "4<=X<7", "1<=X<4", "1<=X<4", ">=7", "4<=X<7", "1<=X<4", ">=7"],
        "installment_commitment": [4, 2, 2, 2, 3, 2, 3, 2, 2, 2],
        "personal_status": ["male single", "female div/dep/mar", "male single", "male single", "male single", "male single", "male single", "female div/dep/mar", "male single", "male single"],
        "other_parties": ["none", "none", "none", "guarantor", "none", "none", "none", "none", "none", "guarantor"],
        "residence_since": [4, 2, 3, 4, 4, 4, 4, 3, 4, 2],
        "property_magnitude": ["real estate", "real estate", "real estate", "life insurance", "no known property", "no known property", "life insurance", "car", "real estate", "real estate"],
        "age": [67, 22, 49, 45, 53, 35, 53, 31, 40, 24],
        "other_payment_plans": ["none", "none", "none", "none", "none", "none", "none", "none", "none", "none"],
        "housing": ["own", "own", "own", "for free", "for free", "for free", "own", "own", "own", "rent"],
        "existing_credits": [2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
        "job": ["skilled", "skilled", "unskilled resident", "skilled", "skilled", "unskilled resident", "skilled", "skilled", "skilled", "skilled"],
        "num_dependents": [1, 1, 2, 2, 2, 2, 1, 1, 1, 2],
        "own_telephone": ["yes", "none", "none", "none", "none", "yes", "none", "yes", "yes", "none"],
        "foreign_worker": ["yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes"],
        "class": ["good", "bad", "good", "good", "bad", "good", "good", "bad", "good", "bad"],
    }
    return pd.DataFrame(data)


def test_validate_dataset_and_load_dataset(tmp_path):
    df = build_sample_dataset()
    path = tmp_path / "german_credit.csv"
    df.to_csv(path, index=False)

    strict_df = load_dataset(path)
    validation = validate_dataset(strict_df)

    assert list(strict_df.columns) == list(df.columns)
    assert validation["is_valid"] is True
    assert validation["missing_values"] == 0


def test_engineer_features_creates_expected_columns():
    df = build_sample_dataset()
    result = engineer_features(df)

    assert "credit_amount_per_duration" in result.columns
    assert "credit_amount_per_installment" in result.columns
    assert "debt_to_age_ratio" in result.columns
    assert result["credit_amount_per_duration"].notna().all()


def test_preprocessor_builds_pipeline_with_numeric_and_categorical_features():
    df = build_sample_dataset()
    prepared = engineer_features(df)
    preprocessor = build_preprocessor(prepared, target_col="class")

    assert preprocessor is not None
    transformed = preprocessor.fit_transform(prepared.drop(columns=["class"]))
    assert transformed.shape[0] == len(prepared)


def test_train_and_evaluate_returns_model_metrics_and_pipeline():
    df = build_sample_dataset()
    trained = train_and_evaluate(df, target_col="class", random_state=42)

    assert "models" in trained
    assert "metrics" in trained
    assert "pipeline" in trained
    assert set(trained["metrics"].keys()) >= {"logistic_regression", "decision_tree", "random_forest"}


def test_predict_single_returns_probability_and_label():
    df = build_sample_dataset()
    trained = train_and_evaluate(df, target_col="class", random_state=42)
    sample = {
        "checking_status": "no checking",
        "duration": 24,
        "credit_history": "existing paid",
        "purpose": "new car",
        "credit_amount": 8000,
        "savings_status": "<100",
        "employment": "1<=X<4",
        "installment_commitment": 2,
        "personal_status": "male single",
        "other_parties": "none",
        "residence_since": 3,
        "property_magnitude": "real estate",
        "age": 35,
        "other_payment_plans": "none",
        "housing": "own",
        "existing_credits": 1,
        "job": "skilled",
        "num_dependents": 1,
        "own_telephone": "yes",
        "foreign_worker": "yes",
    }
    prediction = predict_single(trained["pipeline"], sample)

    assert set(prediction.keys()) >= {"prediction", "probability", "label"}
    assert 0.0 <= prediction["probability"] <= 1.0
