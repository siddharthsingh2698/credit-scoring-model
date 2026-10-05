import argparse
import joblib
import pandas as pd
import json
import sys

def main():
    parser = argparse.ArgumentParser(description="Credit Scoring Prediction Interface")
    parser.add_argument('--model-path', type=str, default='models/final_tuned_model.joblib',
                        help='Path to the trained joblib model pipeline')
    parser.add_argument('--input', type=str, help='Path to a JSON file containing applicant data. If not provided, a default applicant is used.')
    args = parser.parse_args()
    
    # 1. Load the model pipeline
    try:
        pipeline = joblib.load(args.model_path)
        print(f"Model loaded successfully from {args.model_path}")
    except FileNotFoundError:
        print(f"Error: Model not found at {args.model_path}")
        sys.exit(1)
        
    # 2. Get Applicant Data
    if args.input:
        try:
            with open(args.input, 'r') as f:
                applicant_data = json.load(f)
        except Exception as e:
            print(f"Error reading input file: {e}")
            sys.exit(1)
    else:
        # Default German Credit Dataset style applicant
        print("\nNo input JSON provided. Using a default sample applicant profile...\n")
        applicant_data = {
            "checking_status": "0<=x<200",
            "duration": 24,
            "credit_history": "existing paid",
            "purpose": "furniture/equipment",
            "credit_amount": 3500,
            "savings_status": "<100",
            "employment": "1<=x<4",
            "installment_commitment": 3,
            "personal_status": "male single",
            "other_parties": "none",
            "residence_since": 2,
            "property_magnitude": "car",
            "age": 28,
            "other_payment_plans": "none",
            "housing": "own",
            "existing_credits": 1,
            "job": "skilled",
            "num_dependents": 1,
            "own_telephone": "yes",
            "foreign_worker": "yes"
        }
    
    # Convert to DataFrame
    df = pd.DataFrame([applicant_data])
    
    # 3. Apply Feature Engineering on the fly!
    # These must match exactly what we did in Phase 6
    df['monthly_payment_estimate'] = df['credit_amount'] / df['duration']
    df['credit_per_age'] = df['credit_amount'] / df['age']
    df['is_multi_credit'] = (df['existing_credits'] > 1).astype(int)
    df['is_young_borrower'] = (df['age'] < 25).astype(int)
    
    # 4. Predict
    prediction_num = pipeline.predict(df)[0]
    probabilities = pipeline.predict_proba(df)[0]
    
    # The pipeline outputs 1 for 'good' and 0 for 'bad' based on our Phase 7 label encoding
    # Wait, our model was trained on y_train which had 1=good, 0=bad.
    prob_good = probabilities[1]
    
    pred_label = "Low Risk (Creditworthy)" if prediction_num == 1 else "High Risk (Not Creditworthy)"
    
    # 5. Output
    print("="*40)
    print("  APPLICANT PREDICTION RESULT  ")
    print("="*40)
    print(f"Predicted Class : {pred_label}")
    print(f"Confidence Score: {prob_good * 100:.2f}% probability of being Creditworthy")
    print("="*40)
    print("Note: This model is an educational prototype and should not be used for autonomous lending decisions.")

if __name__ == "__main__":
    main()
