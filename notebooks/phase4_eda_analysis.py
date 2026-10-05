from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

from src.features import engineer_features


FIG_DIR = ROOT / 'reports' / 'figures'
FIG_DIR.mkdir(parents=True, exist_ok=True)


def main() -> None:
    df = pd.read_csv(ROOT / 'data' / 'raw' / 'credit_scoring_dataset.csv')
    target_col = 'risk_flag'

    # Target balance
    target_counts = df[target_col].value_counts().sort_index()
    plt.figure(figsize=(6, 4))
    sns.countplot(data=df, x=target_col, palette='Set2')
    plt.title('Target Distribution')
    plt.xlabel('Risk flag')
    plt.ylabel('Count')
    plt.xticks([0, 1], ['High risk', 'Low risk'])
    plt.tight_layout()
    plt.savefig(FIG_DIR / 'phase4_target_distribution.png', dpi=200)
    plt.close()

    # Distribution and risk split for core features
    selected_features = ['income', 'total_debt', 'loan_amount', 'credit_utilization', 'late_payments', 'payment_history_score']
    for feature in selected_features:
        plt.figure(figsize=(7, 4))
        sns.histplot(df[feature], kde=True, bins=25, color='#4C72B0')
        plt.title(f'{feature} distribution')
        plt.xlabel(feature)
        plt.ylabel('Frequency')
        plt.tight_layout()
        plt.savefig(FIG_DIR / f'phase4_{feature}_distribution.png', dpi=200)
        plt.close()

        plt.figure(figsize=(7, 4))
        sns.boxplot(data=df, x=target_col, y=feature, palette='Set2')
        plt.title(f'{feature} by risk class')
        plt.xlabel('Risk class')
        plt.ylabel(feature)
        plt.xticks([0, 1], ['High risk', 'Low risk'])
        plt.tight_layout()
        plt.savefig(FIG_DIR / f'phase4_{feature}_by_target.png', dpi=200)
        plt.close()

    engineered = engineer_features(df)
    engineered_features = ['dti_ratio', 'income_to_debt_ratio', 'payment_delay_rate', 'loan_to_income_ratio', 'credit_utilization_ratio']
    corr = engineered[engineered_features + [target_col]].corr(numeric_only=True)
    plt.figure(figsize=(8, 6))
    sns.heatmap(corr, annot=True, cmap='coolwarm', center=0, fmt='.2f')
    plt.title('Correlation heatmap for engineered financial indicators')
    plt.tight_layout()
    plt.savefig(FIG_DIR / 'phase4_risk_correlation_heatmap.png', dpi=200)
    plt.close()

    for feature in engineered_features:
        plt.figure(figsize=(7, 4))
        sns.boxplot(data=engineered, x=target_col, y=feature, palette='Set2')
        plt.title(f'{feature} by risk class')
        plt.xlabel('Risk class')
        plt.ylabel(feature)
        plt.xticks([0, 1], ['High risk', 'Low risk'])
        plt.tight_layout()
        plt.savefig(FIG_DIR / f'phase4_{feature}_by_target.png', dpi=200)
        plt.close()

    summary = '''# Phase 4 EDA Summary

## Key observations

- The target is moderately imbalanced, with a clear separation between high-risk and low-risk applicants.
- Higher debt, larger loan amounts, and higher credit utilization are associated with higher risk.
- Lower payment history scores and more late payments align with higher risk applicants.
- The engineered indicators such as debt-to-income ratio, payment delay rate, and loan-to-income ratio show strong separation between risk classes.
- The strongest relationships in the dataset are between repayment behavior, debt burden, and the target variable.

## Files generated

- `reports/figures/phase4_target_distribution.png`
- `reports/figures/phase4_income_distribution.png`
- `reports/figures/phase4_total_debt_distribution.png`
- `reports/figures/phase4_loan_amount_distribution.png`
- `reports/figures/phase4_credit_utilization_distribution.png`
- `reports/figures/phase4_late_payments_distribution.png`
- `reports/figures/phase4_payment_history_score_distribution.png`
- `reports/figures/phase4_risk_correlation_heatmap.png`
'''
    (ROOT / 'reports' / 'phase4_eda_summary.md').write_text(summary, encoding='utf-8')

    print(f"Processed {len(df)} rows with {len(df.columns) - 1} input features.")
    print(f"Target counts: {target_counts.to_dict()}")
    print(f"Figures saved to: {FIG_DIR}")


if __name__ == '__main__':
    main()
