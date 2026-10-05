import pandas as pd
import joblib
import os
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

def evaluate_models(X_test_path, y_test_path, models_dir):
    print(f"Loading test data from {X_test_path}...")
    X_test = pd.read_csv(X_test_path)
    y_test = pd.read_csv(y_test_path).values.ravel()
    
    model_names = ['logistic_regression', 'decision_tree', 'random_forest']
    
    results = []
    
    print("\n--- MODEL EVALUATION RESULTS ---\n")
    
    for name in model_names:
        model_path = os.path.join(models_dir, f'{name}.joblib')
        if not os.path.exists(model_path):
            print(f"Model {name} not found at {model_path}. Skipping.")
            continue
            
        pipeline = joblib.load(model_path)
        
        # Predict classes
        y_pred = pipeline.predict(X_test)
        # Predict probabilities for ROC-AUC (using the probability of the positive class '1')
        y_pred_proba = pipeline.predict_proba(X_test)[:, 1]
        
        # Calculate Metrics
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred)
        rec = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        roc_auc = roc_auc_score(y_test, y_pred_proba)
        cm = confusion_matrix(y_test, y_pred)
        
        # Print Results
        print(f"=== {name.replace('_', ' ').title()} ===")
        print(f"Accuracy:  {acc:.4f}")
        print(f"Precision: {prec:.4f}")
        print(f"Recall:    {rec:.4f}")
        print(f"F1-Score:  {f1:.4f}")
        print(f"ROC-AUC:   {roc_auc:.4f}")
        print(f"Confusion Matrix:\n{cm}\n")
        
        results.append({
            'Model': name,
            'Accuracy': acc,
            'Precision': prec,
            'Recall': rec,
            'F1-Score': f1,
            'ROC-AUC': roc_auc
        })
        
    return results

if __name__ == "__main__":
    evaluate_models(
        'data/processed/split/X_test.csv',
        'data/processed/split/y_test.csv',
        'models/'
    )
