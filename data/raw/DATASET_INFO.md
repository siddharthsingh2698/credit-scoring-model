# German Credit Dataset

## 1. Dataset Overview
- **Source**: UCI Machine Learning Repository (fetched via OpenML)
- **Author**: Dr. Hans Hofmann
- **Year**: 1994
- **License**: Publicly available through UCI and OpenML.

## 2. Target Variable
The target variable is `class`.
- `good`: Creditworthy / Low Risk
- `bad`: Not Creditworthy / High Risk

## 3. Cost Matrix Context
It is worse to classify a customer as good when they are bad (cost = 5) than it is to classify a customer as bad when they are good (cost = 1).

## 4. Column Meanings
1. **checking_status**: Status of existing checking account, in Deutsche Mark.
2. **duration**: Duration of the credit in months.
3. **credit_history**: Credit history (credits taken, paid back duly, delays, critical accounts).
4. **purpose**: Purpose of the credit (car, television, etc.).
5. **credit_amount**: Credit amount.
6. **savings_status**: Status of savings account/bonds, in Deutsche Mark.
7. **employment**: Present employment duration, in number of years.
8. **installment_commitment**: Installment rate in percentage of disposable income.
9. **personal_status**: Personal status (married, single, etc.) and sex.
10. **other_parties**: Other debtors / guarantors.
11. **residence_since**: Present residence since X years.
12. **property_magnitude**: Property (e.g., real estate).
13. **age**: Age in years.
14. **other_payment_plans**: Other installment plans (banks, stores).
15. **housing**: Housing (rent, own, etc.).
16. **existing_credits**: Number of existing credits at this bank.
17. **job**: Employment status/job type.
18. **num_dependents**: Number of people being liable to provide maintenance for.
19. **own_telephone**: Telephone registered under customer name (yes/no).
20. **foreign_worker**: Foreign worker status (yes/no).
21. **class**: Target variable (good/bad risk).
