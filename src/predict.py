"""Prediction utilities for the credit scoring project."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Mapping

import pandas as pd

from src.features import engineer_features


def load_saved_pipeline(path: str | Path):
    """Load a previously saved scikit-learn pipeline from disk."""
    import joblib

    pipeline_path = Path(path)
    if not pipeline_path.exists():
        raise FileNotFoundError(f"Pipeline not found at {pipeline_path}")
    return joblib.load(pipeline_path)


def predict_single(pipeline: Any, applicant: Mapping[str, Any]) -> dict[str, Any]:
    """Predict a single applicant's credit risk and return the probability plus label."""
    if not applicant:
        raise ValueError("Applicant data cannot be empty.")

    applicant_frame = pd.DataFrame([dict(applicant)])
    prepared = engineer_features(applicant_frame)

    if hasattr(pipeline, "feature_names_in_"):
        expected_columns = list(pipeline.feature_names_in_)
        missing_columns = [column for column in expected_columns if column not in prepared.columns]
        if missing_columns:
            raise ValueError(f"Applicant is missing required features: {missing_columns}")

    probability = float(pipeline.predict_proba(prepared)[0, 1])
    label = int(pipeline.predict(prepared)[0])

    return {
        "prediction": label,
        "probability": probability,
        "label": "Good" if label == 1 else "Bad",
    }
