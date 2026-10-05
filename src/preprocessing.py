import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

def build_preprocessor(X):
    """
    Builds a Scikit-Learn ColumnTransformer based on the data types of the input DataFrame.
    
    Args:
        X (pd.DataFrame): The feature data.
        
    Returns:
        ColumnTransformer: The configured preprocessing pipeline.
    """
    # Identify numerical and categorical columns
    numeric_features = X.select_dtypes(include=[np.number]).columns.tolist()
    categorical_features = X.select_dtypes(include=['object', 'category']).columns.tolist()
    
    # Pipeline for numerical features:
    # 1. Fill missing values with the median.
    # 2. Scale features to have mean=0 and variance=1.
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    # Pipeline for categorical features:
    # 1. Fill missing values with the most frequent value.
    # 2. One-hot encode the categories, ignoring unseen categories in the future.
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    
    # Combine both pipelines into a single ColumnTransformer
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ],
        remainder='passthrough' # Keep any other columns as they are
    )
    
    return preprocessor

if __name__ == "__main__":
    # Quick test to ensure it builds correctly
    print("Testing Preprocessing Pipeline construction...")
    X_train = pd.read_csv('data/processed/split/X_train.csv')
    preprocessor = build_preprocessor(X_train)
    
    # Fit and transform the training data as a sanity check
    X_train_processed = preprocessor.fit_transform(X_train)
    print(f"Original shape: {X_train.shape}")
    print(f"Processed shape (after OneHotEncoding): {X_train_processed.shape}")
    print("Pipeline successfully constructed and verified!")
