"""Dataset loading and validation utilities for the credit scoring model."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd

GERMAN_REQUIRED_COLUMNS = [
    "checking_status",
    "duration",
    "credit_history",
    "purpose",
    "credit_amount",
    "savings_status",
    "employment",
    "installment_commitment",
    "personal_status",
    "other_parties",
    "residence_since",
    "property_magnitude",
    "age",
    "other_payment_plans",
    "housing",
    "existing_credits",
    "job",
    "num_dependents",
    "own_telephone",
    "foreign_worker",
    "class",
]

LEGACY_REQUIRED_COLUMNS = [
    "age",
    "income",
    "employment_years",
    "total_debt",
    "monthly_debt_payment",
    "credit_history_years",
    "credit_utilization",
    "total_accounts",
    "late_payments",
    "payment_history_score",
    "loan_amount",
    "loan_term",
    "risk_flag",
]

GERMAN_NUMERIC_COLUMNS = [
    "duration",
    "credit_amount",
    "installment_commitment",
    "residence_since",
    "age",
    "existing_credits",
    "num_dependents",
]

LEGACY_NUMERIC_COLUMNS = [
    "age",
    "income",
    "employment_years",
    "total_debt",
    "monthly_debt_payment",
    "credit_history_years",
    "credit_utilization",
    "total_accounts",
    "late_payments",
    "payment_history_score",
    "loan_amount",
    "loan_term",
    "risk_flag",
]


def _detect_schema(df: pd.DataFrame) -> str | None:
    if set(GERMAN_REQUIRED_COLUMNS).issubset(df.columns):
        return "german"
    if set(LEGACY_REQUIRED_COLUMNS).issubset(df.columns):
        return "legacy"
    if "class" in df.columns:
        return "german"
    if "risk_flag" in df.columns:
        return "legacy"
    return None


def _normalize_target(df: pd.DataFrame) -> pd.DataFrame:
    work = df.copy()
    if "class" in work.columns:
        work["class"] = work["class"].astype(str).str.strip().str.lower()
        mapping = {"good": 1, "bad": 0}
        work["class"] = work["class"].map(mapping)
    if "risk_flag" in work.columns:
        work["risk_flag"] = pd.to_numeric(work["risk_flag"], errors="coerce")
    return work


def validate_dataset(df: pd.DataFrame) -> dict[str, Any]:
    """Validate that the dataset contains the required credit-risk fields."""
    if df.empty:
        return {"is_valid": False, "reason": "Dataset is empty.", "rows": 0, "columns": []}

    schema = _detect_schema(df)
    if schema is None:
        return {
            "is_valid": False,
            "reason": "Dataset does not match the German or legacy credit dataset schema.",
            "rows": len(df),
            "columns": list(df.columns),
            "missing_columns": [],
        }

    required_columns = GERMAN_REQUIRED_COLUMNS if schema == "german" else LEGACY_REQUIRED_COLUMNS
    missing_columns = [column for column in required_columns if column not in df.columns]
    if missing_columns:
        return {
            "is_valid": False,
            "reason": f"Missing required columns: {missing_columns}",
            "rows": len(df),
            "columns": list(df.columns),
            "missing_columns": missing_columns,
        }

    numeric_columns = GERMAN_NUMERIC_COLUMNS if schema == "german" else LEGACY_NUMERIC_COLUMNS
    missing_values = int(df.isna().sum().sum())
    duplicate_rows = int(df.duplicated().sum())
    invalid_numeric_rows = 0

    for column in numeric_columns:
        if column in df.columns:
            values = pd.to_numeric(df[column], errors="coerce")
            invalid_numeric_rows += int(values.isna().sum())

    return {
        "is_valid": True,
        "rows": len(df),
        "columns": list(df.columns),
        "missing_values": missing_values,
        "duplicate_rows": duplicate_rows,
        "invalid_numeric_rows": invalid_numeric_rows,
        "missing_columns": [],
    }


def load_dataset(path: str | Path) -> pd.DataFrame:
    """Load a CSV from disk and validate the supported credit-scoring schemas."""
    dataset_path = Path(path)
    if not dataset_path.exists():
        raise FileNotFoundError(f"Dataset not found at {dataset_path}")

    df = pd.read_csv(dataset_path)
    validation = validate_dataset(df)
    if not validation["is_valid"]:
        raise ValueError(f"Dataset validation failed: {validation.get('reason', 'Unknown issue')}")

    schema = _detect_schema(df)
    numeric_columns = GERMAN_NUMERIC_COLUMNS if schema == "german" else LEGACY_NUMERIC_COLUMNS
    for column in numeric_columns:
        if column in df.columns:
            df[column] = pd.to_numeric(df[column], errors="coerce")

    df = _normalize_target(df)

    if df.isna().any().any():
        raise ValueError("Dataset contains missing values. Clean the data before model training.")

    return df


def create_demo_dataset(output_path: str | Path = "data/raw/credit_scoring_dataset.csv", *, rows: int = 1500, random_state: int = 42) -> pd.DataFrame:
    """Create a synthetic credit-scoring dataset that matches the project schema."""
    rng = np.random.default_rng(random_state)
    n = max(rows, 100)

    incomes = rng.integers(20000, 140000, size=n)
    debt = rng.integers(2000, 60000, size=n)
    age = rng.integers(20, 70, size=n)
    employment_years = rng.integers(1, 25, size=n)
    credit_history_years = rng.integers(1, 25, size=n)
    late_payments = rng.integers(0, 10, size=n)
    total_accounts = rng.integers(2, 12, size=n)
    payment_history_score = rng.integers(35, 99, size=n)
    loan_term = rng.choice([12, 24, 36, 48, 60, 72], size=n)
    loan_amount = rng.integers(5000, 70000, size=n)
    monthly_payment = np.clip((loan_amount / loan_term) * 1.7 + rng.integers(50, 500, size=n), 50, None).astype(int)
    utilization = np.clip((debt / np.maximum(incomes, 1)) + rng.normal(0.05, 0.08, size=n), 0.02, 0.95)
    utilization = np.round(utilization, 3)

    credit_score = (
        0.45 * (payment_history_score / 100)
        + 0.20 * (1 - np.clip(utilization, 0, 1))
        + 0.15 * np.clip((incomes / (debt + 5000)) / 4, 0, 1)
        + 0.10 * np.clip((credit_history_years / 20), 0, 1)
        + 0.10 * np.clip((employment_years / 20), 0, 1)
    )

    risk_flag = (credit_score > 0.58).astype(int)
    dataset = pd.DataFrame(
        {
            "age": age,
            "income": incomes,
            "employment_years": employment_years,
            "total_debt": debt,
            "monthly_debt_payment": monthly_payment,
            "credit_history_years": credit_history_years,
            "credit_utilization": utilization,
            "total_accounts": total_accounts,
            "late_payments": late_payments,
            "payment_history_score": payment_history_score,
            "loan_amount": loan_amount,
            "loan_term": loan_term,
            "risk_flag": risk_flag,
        }
    )

    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    dataset.to_csv(output, index=False)
    return dataset
