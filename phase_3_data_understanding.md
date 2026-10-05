# Phase 3: Data Understanding

## 1. Shape Analysis
- **Records**: 1000
- **Features**: 21 (20 predictors + 1 target variable)

## 2. Target Distribution
The target variable is `class`.
- **good** (Creditworthy): 70.0%
- **bad** (High Risk): 30.0%
*Note: The dataset is moderately imbalanced.*

## 3. Missing Value Analysis
- **Missing values**: None found. All columns are fully populated.

## 4. Duplicate Analysis
- **Duplicate records**: 0 (No identical rows found).

## 5. Data-Type Analysis
- **Numerical Features (int64)** (7): `duration`, `credit_amount`, `installment_commitment`, `residence_since`, `age`, `existing_credits`, `num_dependents`.
- **Categorical Features (object)** (14): `checking_status`, `credit_history`, `purpose`, `savings_status`, `employment`, `personal_status`, `other_parties`, `property_magnitude`, `other_payment_plans`, `housing`, `job`, `own_telephone`, `foreign_worker`, `class`.

## 6. Basic Statistical Summary
### Numerical Features
| Feature | Min | Max | Mean | Std |
| :--- | :--- | :--- | :--- | :--- |
| `duration` | 4.0 | 72.0 | 20.90 | 12.05 |
| `credit_amount` | 250.0 | 18424.0 | 3271.25 | 2822.73 |
| `installment_commitment` | 1.0 | 4.0 | 2.97 | 1.11 |
| `residence_since` | 1.0 | 4.0 | 2.84 | 1.10 |
| `age` | 19.0 | 75.0 | 35.54 | 11.37 |
| `existing_credits`| 1.0 | 4.0 | 1.40 | 0.57 |
| `num_dependents` | 1.0 | 2.0 | 1.15 | 0.36 |

### Categorical Unique Values
- `purpose`: 10 unique values (e.g., car, television)
- `credit_history`: 5 unique values
- `savings_status`: 5 unique values
- `employment`: 5 unique values
- `checking_status`, `personal_status`, `property_magnitude`, `job`: 4 unique values each
- `other_parties`, `other_payment_plans`, `housing`: 3 unique values each
- `own_telephone`, `foreign_worker`, `class`: 2 unique values each (binary)

## 7. Key Findings to Questions
- **How many records?** 1000.
- **Target class percentages?** 70% `good`, 30% `bad`.
- **Missing values?** None.
- **Impossible values?** The minimum age is 19, maximum 75. Durations range from 4 to 72 months. Installment rates are valid percentages/categories. No impossible values detected.
- **Extreme outliers?** `credit_amount` has a high maximum (18,424 DM) compared to the mean (3,271 DM), suggesting a right-skewed distribution. `age` also has a max of 75 with a mean of 35. These are realistic financial data points but will require visualization in Phase 4.
