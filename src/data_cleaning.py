import pandas as pd
import numpy as np

def clean_data(input_path, output_path):
    print(f"Loading raw data from {input_path}...")
    df = pd.read_csv(input_path)
    
    # 1. Duplicate Handling
    initial_shape = df.shape
    df.drop_duplicates(inplace=True)
    print(f"Dropped {initial_shape[0] - df.shape[0]} duplicate rows.")
    
    # 2. Missing Value Handling
    # (Even though our dataset currently has no nulls, we include this for robustness)
    missing = df.isnull().sum().sum()
    if missing > 0:
        print(f"Found {missing} missing values. Handling them...")
        # Fill numerical NAs with median
        num_cols = df.select_dtypes(include=[np.number]).columns
        df[num_cols] = df[num_cols].fillna(df[num_cols].median())
        # Fill categorical NAs with mode
        cat_cols = df.select_dtypes(include=['object']).columns
        df[cat_cols] = df[cat_cols].fillna(df[cat_cols].mode().iloc[0])
    else:
        print("No missing values found.")
        
    # 3. Categorical Normalization
    # Strip whitespaces and lowercase all object columns for consistency
    cat_cols = df.select_dtypes(include=['object']).columns
    for col in cat_cols:
        df[col] = df[col].astype(str).str.strip().str.lower()
    print("Normalized categorical strings (lowercase, stripped whitespace).")
    
    # 4. Save cleaned data
    df.to_csv(output_path, index=False)
    print(f"Cleaned dataset saved to {output_path}")
    return df

if __name__ == "__main__":
    import os
    os.makedirs('data/processed', exist_ok=True)
    clean_data('data/raw/german_credit_dataset.csv', 'data/processed/german_credit_cleaned.csv')
