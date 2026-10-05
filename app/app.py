"""Simple prediction interface for the credit scoring model."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.predict import load_saved_pipeline, predict_single


DEFAULT_PIPELINE_PATH = Path(__file__).resolve().parents[1] / "models" / "credit_scoring_pipeline.joblib"


def _example_applicant() -> dict[str, float | int | str]:
    return {
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


def run_cli(path: str | Path = DEFAULT_PIPELINE_PATH) -> dict[str, object]:
    """Run a small command-line prediction interface for a single applicant."""
    pipeline = load_saved_pipeline(path)
    applicant = _example_applicant()
    result = predict_single(pipeline, applicant)
    print(f"Prediction: {result['label']} (probability = {result['probability']:.3f})")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Credit scoring prediction interface")
    parser.add_argument(
        "--model-path",
        type=str,
        default=str(DEFAULT_PIPELINE_PATH),
        help="Path to the saved training pipeline (.joblib)",
    )
    args = parser.parse_args()
    run_cli(args.model_path)
