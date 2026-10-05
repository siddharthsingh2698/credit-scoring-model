"""Streamlit web app for the credit scoring model."""

from __future__ import annotations

import sys
from pathlib import Path

import streamlit as st

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.predict import load_saved_pipeline, predict_single

MODEL_PATH = PROJECT_ROOT / "models" / "credit_scoring_pipeline.joblib"


def _default_applicant() -> dict[str, float | int | str]:
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


def main() -> None:
    st.set_page_config(page_title="Credit Scoring Model", page_icon="💳", layout="wide")
    st.title("💳 Credit Scoring Predictor")
    st.caption("Estimate whether an applicant is likely a good or bad credit risk using the trained model.")

    if not MODEL_PATH.exists():
        st.error(
            f"Model file not found at {MODEL_PATH}. Train the model first with the project scripts, then refresh this page."
        )
        return

    pipeline = load_saved_pipeline(MODEL_PATH)
    applicant = _default_applicant()

    with st.form("credit_form"):
        col1, col2 = st.columns(2)
        with col1:
            applicant["checking_status"] = st.selectbox("Checking status", ["<0", "0<=X<200", "no checking", ">=200"], index=2)
            applicant["duration"] = st.number_input("Duration in months", min_value=1, max_value=72, value=int(applicant["duration"]))
            applicant["credit_history"] = st.selectbox("Credit history", ["critical/other existing credit", "existing paid", "delayed previously", "all paid", "no credits/all paid"], index=1)
            applicant["purpose"] = st.selectbox("Purpose", ["radio/tv", "new car", "used car", "furniture/equipment", "education", "repairs", "domestic appliances", "business", "vacation", "retraining"], index=1)
            applicant["credit_amount"] = st.number_input("Credit amount", min_value=0, max_value=100000, value=int(applicant["credit_amount"]))
            applicant["savings_status"] = st.selectbox("Savings status", ["no known savings", "<100", "500<=X<1000", ">=1000"], index=1)
            applicant["employment"] = st.selectbox("Employment", [">=7", "4<=X<7", "1<=X<4", "<1", "unemployed"], index=2)
            applicant["installment_commitment"] = st.number_input("Installment commitment", min_value=1, max_value=4, value=int(applicant["installment_commitment"]))
            applicant["personal_status"] = st.selectbox("Personal status", ["male single", "female div/dep/mar", "male div/sep", "male mar/wid", "female single"], index=0)
            applicant["other_parties"] = st.selectbox("Other parties", ["none", "co-applicant", "guarantor"], index=0)
            applicant["residence_since"] = st.number_input("Residence since", min_value=1, max_value=4, value=int(applicant["residence_since"]))
        with col2:
            applicant["property_magnitude"] = st.selectbox("Property magnitude", ["real estate", "life insurance", "car", "no known property"], index=0)
            applicant["age"] = st.number_input("Age", min_value=18, max_value=100, value=int(applicant["age"]))
            applicant["other_payment_plans"] = st.selectbox("Other payment plans", ["none", "stores", "bank"], index=0)
            applicant["housing"] = st.selectbox("Housing", ["own", "rent", "for free"], index=0)
            applicant["existing_credits"] = st.number_input("Existing credits", min_value=1, max_value=4, value=int(applicant["existing_credits"]))
            applicant["job"] = st.selectbox("Job", ["unskilled resident", "unskilled nonresident", "skilled", "highly qualified"], index=2)
            applicant["num_dependents"] = st.number_input("Number of dependents", min_value=1, max_value=2, value=int(applicant["num_dependents"]))
            applicant["own_telephone"] = st.selectbox("Own telephone", ["none", "yes"], index=1)
            applicant["foreign_worker"] = st.selectbox("Foreign worker", ["yes", "no"], index=0)

        submitted = st.form_submit_button("Predict credit risk")

    if submitted:
        result = predict_single(pipeline, applicant)
        probability = float(result["probability"])
        label = str(result["label"])

        st.subheader("Result")
        st.metric("Risk outcome", label)
        st.metric("Probability of good credit", f"{probability:.2%}")

        if label == "Good":
            st.success("The applicant appears to be a good credit risk based on the trained model.")
        else:
            st.error("The applicant appears to be a bad credit risk based on the trained model.")

        st.progress(probability)


if __name__ == "__main__":
    main()
