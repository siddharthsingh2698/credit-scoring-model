import pandas as pd
import numpy as np
import os
import joblib
from sklearn.pipeline import Pipeline
from imblearn.pipeline import Pipeline as ImbPipeline
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import StratifiedKFold, cross_validate, RandomizedSearchCV
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from preprocessing import build_preprocessor

def optimize_models(X_train_path, y_train_path, models_dir):
    print(f"Loading training data from {X_train_path}...")
    X_train = pd.read_csv(X_train_path)
    y_train = pd.read_csv(y_train_path).values.ravel()
    
    preprocessor = build_preprocessor(X_train)
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scoring = ['precision', 'recall', 'f1', 'roc_auc']
    
    print("\n=== PHASE 11: CROSS VALIDATION ===")
    models = {
        'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000),
        'Decision Tree': DecisionTreeClassifier(random_state=42),
        'Random Forest': RandomForestClassifier(random_state=42, n_estimators=100)
    }
    
    baseline_results = {}
    for name, clf in models.items():
        pipe = Pipeline(steps=[('preprocessor', preprocessor), ('classifier', clf)])
        scores = cross_validate(pipe, X_train, y_train, cv=cv, scoring=scoring)
        baseline_results[name] = {
            'F1': (np.mean(scores['test_f1']), np.std(scores['test_f1'])),
            'ROC_AUC': (np.mean(scores['test_roc_auc']), np.std(scores['test_roc_auc'])),
            'Recall': (np.mean(scores['test_recall']), np.std(scores['test_recall']))
        }
        print(f"{name}:")
        print(f"  F1: {baseline_results[name]['F1'][0]:.4f} (+/- {baseline_results[name]['F1'][1]:.4f})")
        print(f"  ROC-AUC: {baseline_results[name]['ROC_AUC'][0]:.4f} (+/- {baseline_results[name]['ROC_AUC'][1]:.4f})")
    
    print("\n=== PHASE 12: CLASS IMBALANCE HANDLING ===")
    print("Testing Random Forest with SMOTE...")
    smote_pipe = ImbPipeline(steps=[
        ('preprocessor', preprocessor),
        ('smote', SMOTE(random_state=42)),
        ('classifier', RandomForestClassifier(random_state=42, n_estimators=100))
    ])
    smote_scores = cross_validate(smote_pipe, X_train, y_train, cv=cv, scoring=scoring)
    smote_f1 = np.mean(smote_scores['test_f1'])
    smote_auc = np.mean(smote_scores['test_roc_auc'])
    print(f"Random Forest + SMOTE:")
    print(f"  F1: {smote_f1:.4f}")
    print(f"  ROC-AUC: {smote_auc:.4f}")
    
    print("\nTesting Random Forest with Class Weights (balanced)...")
    cw_pipe = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(random_state=42, n_estimators=100, class_weight='balanced'))
    ])
    cw_scores = cross_validate(cw_pipe, X_train, y_train, cv=cv, scoring=scoring)
    cw_f1 = np.mean(cw_scores['test_f1'])
    cw_auc = np.mean(cw_scores['test_roc_auc'])
    print(f"Random Forest + Class Weights:")
    print(f"  F1: {cw_f1:.4f}")
    print(f"  ROC-AUC: {cw_auc:.4f}")
    
    # We choose Random Forest with Class Weights or Standard depending on AUC
    # Usually standard RF or RF+balanced performs best. We'll use RF without SMOTE to avoid over-complicating if SMOTE doesn't vastly improve.
    
    print("\n=== PHASE 13: MODEL COMPARISON (Summary) ===")
    print("Random Forest remains the strongest candidate. We will proceed to tune it.")
    
    print("\n=== PHASE 14: HYPERPARAMETER TUNING ===")
    print("Tuning Random Forest...")
    param_grid = {
        'classifier__n_estimators': [100, 200, 300],
        'classifier__max_depth': [None, 10, 20],
        'classifier__min_samples_split': [2, 5, 10],
        'classifier__class_weight': [None, 'balanced']
    }
    
    tune_pipe = Pipeline(steps=[('preprocessor', preprocessor), ('classifier', RandomForestClassifier(random_state=42))])
    
    random_search = RandomizedSearchCV(
        tune_pipe, param_distributions=param_grid, n_iter=10, 
        cv=cv, scoring='roc_auc', n_jobs=-1, random_state=42
    )
    
    random_search.fit(X_train, y_train)
    print(f"Best Parameters: {random_search.best_params_}")
    print(f"Best CV ROC-AUC: {random_search.best_score_:.4f}")
    
    best_model = random_search.best_estimator_
    os.makedirs(models_dir, exist_ok=True)
    final_path = os.path.join(models_dir, 'final_tuned_model.joblib')
    joblib.dump(best_model, final_path)
    print(f"\nSaved final tuned pipeline to {final_path}")

if __name__ == "__main__":
    optimize_models(
        'data/processed/split/X_train.csv',
        'data/processed/split/y_train.csv',
        'models/'
    )
