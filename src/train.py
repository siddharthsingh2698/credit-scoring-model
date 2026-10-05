import pandas as pd
import joblib
import os
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

from preprocessing import build_preprocessor

def train_models(X_train_path, y_train_path, models_dir):
    print(f"Loading training data from {X_train_path}...")
    X_train = pd.read_csv(X_train_path)
    y_train = pd.read_csv(y_train_path).values.ravel()  # convert to 1D array
    
    print("Building preprocessing pipeline...")
    preprocessor = build_preprocessor(X_train)
    
    # Define our baseline models
    models = {
        'logistic_regression': LogisticRegression(random_state=42, max_iter=1000),
        'decision_tree': DecisionTreeClassifier(random_state=42),
        'random_forest': RandomForestClassifier(random_state=42, n_estimators=100)
    }
    
    os.makedirs(models_dir, exist_ok=True)
    
    trained_pipelines = {}
    
    print("Training baseline models...")
    for model_name, classifier in models.items():
        print(f" -> Training {model_name}...")
        
        # Create a full pipeline linking preprocessing to the classifier
        pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('classifier', classifier)
        ])
        
        # Fit the full pipeline
        pipeline.fit(X_train, y_train)
        
        # Save the trained pipeline
        model_path = os.path.join(models_dir, f'{model_name}.joblib')
        joblib.dump(pipeline, model_path)
        print(f"    Saved to {model_path}")
        
        trained_pipelines[model_name] = pipeline
        
    print("All baseline models successfully trained and saved!")
    return trained_pipelines

if __name__ == "__main__":
    train_models(
        'data/processed/split/X_train.csv',
        'data/processed/split/y_train.csv',
        'models/'
    )
