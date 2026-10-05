import pandas as pd
import numpy as np
import joblib
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

def final_evaluation(X_test_path, y_test_path, model_path):
    print("=== PHASE 15: FINAL EVALUATION ===")
    
    # 1. Load Data and Model
    X_test = pd.read_csv(X_test_path)
    y_test = pd.read_csv(y_test_path).values.ravel()
    pipeline = joblib.load(model_path)
    
    # 2. Predict
    y_pred = pipeline.predict(X_test)
    y_pred_proba = pipeline.predict_proba(X_test)[:, 1]
    
    # 3. Calculate Metrics
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    cm = confusion_matrix(y_test, y_pred)
    
    print("\nMetrics on Untouched Test Set (200 records):")
    print(f"Accuracy:  {acc:.4f}")
    print(f"Precision: {prec:.4f}")
    print(f"Recall:    {rec:.4f}")
    print(f"F1-Score:  {f1:.4f}")
    print(f"ROC-AUC:   {roc_auc:.4f}")
    print(f"Confusion Matrix:\n{cm}")
    
    print("\n=== PHASE 16: EXPLAINABILITY ===")
    
    # Extract feature importance
    preprocessor = pipeline.named_steps['preprocessor']
    classifier = pipeline.named_steps['classifier']
    
    # Get feature names from the preprocessor
    feature_names = preprocessor.get_feature_names_out()
    importances = classifier.feature_importances_
    
    # Map importances to feature names
    feature_importance_df = pd.DataFrame({
        'Feature': feature_names,
        'Importance': importances
    }).sort_values(by='Importance', ascending=False)
    
    print("\nTop 10 Most Important Factors (Model Associations):")
    for idx, row in feature_importance_df.head(10).iterrows():
        # Clean up the feature name formatting slightly
        feat_name = row['Feature'].replace('num__', '').replace('cat__', '')
        print(f"{feat_name:<40} : {row['Importance']:.4f}")

if __name__ == "__main__":
    final_evaluation(
        'data/processed/split/X_test.csv',
        'data/processed/split/y_test.csv',
        'models/final_tuned_model.joblib'
    )
