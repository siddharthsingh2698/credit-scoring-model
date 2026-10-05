import pandas as pd

def engineer_features(input_path, output_path):
    print(f"Loading cleaned data from {input_path}...")
    df = pd.read_csv(input_path)
    
    print("Engineering new features...")
    
    # 1. Monthly Payment Estimate
    # Rough estimate of how much they pay per month for this specific credit
    df['monthly_payment_estimate'] = df['credit_amount'] / df['duration']
    
    # 2. Credit Amount per Age
    # Represents the size of the loan relative to the applicant's age
    df['credit_per_age'] = df['credit_amount'] / df['age']
    
    # 3. Multi-Credit Flag
    # Binary flag if the applicant has more than 1 existing credit at this bank
    df['is_multi_credit'] = (df['existing_credits'] > 1).astype(int)
    
    # 4. Young Borrower Flag
    # Binary flag if the applicant is under 25 (commonly used risk threshold)
    df['is_young_borrower'] = (df['age'] < 25).astype(int)
    
    # Save the engineered dataset
    df.to_csv(output_path, index=False)
    print(f"Engineered dataset saved to {output_path}")
    print(f"New shape: {df.shape}")
    return df

if __name__ == "__main__":
    engineer_features(
        'data/processed/german_credit_cleaned.csv',
        'data/processed/german_credit_engineered.csv'
    )
