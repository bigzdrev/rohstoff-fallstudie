import pandas as pd

file_path = '/Users/zdravkomarjanovic/Downloads/cmdty.xlsx'
df = pd.read_excel(file_path, sheet_name=0)

# Let's see all column names
print("Columns:", df.columns.tolist())

# Dump the first row to see exactly what holds what
print("First row:", df.iloc[0].to_dict())

