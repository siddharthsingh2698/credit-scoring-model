"""Feature engineering utilities for the credit scoring pipeline."""

from __future__ import annotations

import numpy as np
import pandas as pd


def _as_series(work: pd.DataFrame, column: str, default_value: float | int = 0) -> pd.Series:
    if column in work.columns:
        return pd.to_numeric(work[column], errors="coerce")
    return pd.Series(default_value, index=work.index)


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Engineer denominator-safe financial indicators used for credit risk modeling."""
    work = df.copy()

    if {"income", "total_debt"}.issubset(work.columns):
        income = pd.to_numeric(work["income"], errors="coerce").replace(0, np.nan)
        total_debt = pd.to_numeric(work["total_debt"], errors="coerce").fillna(0)
        late_payments = _as_series(work, "late_payments", 0).fillna(0)
        total_accounts = _as_series(work, "total_accounts", 1).replace(0, np.nan).fillna(1)

        work["dti_ratio"] = total_debt / income.replace(0, np.nan)
        work["income_to_debt_ratio"] = income / (total_debt + 1.0)
        work["payment_delay_rate"] = late_payments / total_accounts

        if "credit_utilization" in work.columns:
            work["credit_utilization_ratio"] = pd.to_numeric(work["credit_utilization"], errors="coerce").fillna(0)
        else:
            used_credit = _as_series(work, "used_credit", 0).fillna(0)
            credit_limit = _as_series(work, "credit_limit", 1).replace(0, np.nan).fillna(1)
            work["credit_utilization_ratio"] = used_credit / credit_limit

        work["loan_to_income_ratio"] = (
            _as_series(work, "loan_amount", 0).fillna(0)
            / income.replace(0, np.nan).fillna(1)
        )

    if {"credit_amount", "duration"}.issubset(work.columns):
        credit_amount = pd.to_numeric(work["credit_amount"], errors="coerce").fillna(0)
        duration = pd.to_numeric(work["duration"], errors="coerce").replace(0, np.nan).fillna(1)
        work["credit_amount_per_duration"] = credit_amount / duration

    if {"credit_amount", "installment_commitment"}.issubset(work.columns):
        credit_amount = pd.to_numeric(work["credit_amount"], errors="coerce").fillna(0)
        installment = pd.to_numeric(work["installment_commitment"], errors="coerce").replace(0, np.nan).fillna(1)
        work["credit_amount_per_installment"] = credit_amount / installment

    if {"credit_amount", "age"}.issubset(work.columns):
        credit_amount = pd.to_numeric(work["credit_amount"], errors="coerce").fillna(0)
        age = pd.to_numeric(work["age"], errors="coerce").replace(0, np.nan).fillna(1)
        work["debt_to_age_ratio"] = credit_amount / age

    work = work.replace([np.inf, -np.inf], np.nan)
    engineered_columns = [
        column
        for column in [
            "dti_ratio",
            "income_to_debt_ratio",
            "payment_delay_rate",
            "credit_utilization_ratio",
            "loan_to_income_ratio",
            "credit_amount_per_duration",
            "credit_amount_per_installment",
            "debt_to_age_ratio",
        ]
        if column in work.columns
    ]
    for column in engineered_columns:
        work[column] = pd.to_numeric(work[column], errors="coerce").fillna(0.0)

    return work
