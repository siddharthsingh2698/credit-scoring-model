import pandas as pd
import os
from sklearn.model_selection import train_test_split

def split_data(input_path, output_dir):
    print(f"Loading engineered data from {input_path}...")
    df = pd.read_csv(input_path)
    
    # Separate features (X) and target (y)
    X = df.drop(columns=['class'])
    # Convert target to binary: 'good' -> 1, 'bad' -> 0
    y = df['class'].map({'good': 1, 'bad': 0})
    
    print("Performing stratified 80/20 train/test split...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, 
        test_size=0.20, 
        random_state=42, 
        stratify=y  # Ensures the 70/30 good/bad ratio is maintained in both sets
    )
    
    # Save the splits
    os.makedirs(output_dir, exist_ok=True)
    
    X_train.to_csv(os.path.join(output_dir, 'X_train.csv'), index=False)
    X_test.to_csv(os.path.join(output_dir, 'X_test.csv'), index=False)
    y_train.to_csv(os.path.join(output_dir, 'y_train.csv'), index=False)
    y_test.to_csv(os.path.join(output_dir, 'y_test.csv'), index=False)
    
    print(f"Splits saved to {output_dir}/")
    print(f"Training set size: {X_train.shape[0]} records")
    print(f"Testing set size: {X_test.shape[0]} records")

if __name__ == "__main__":
    split_data(
        'data/processed/german_credit_engineered.csv',
        'data/processed/split'
    )
