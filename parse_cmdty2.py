import pandas as pd

file_path = '/Users/zdravkomarjanovic/Downloads/cmdty.xlsx'
df = pd.read_excel(file_path, sheet_name=0, header=1)

# Inspect the data visually again to ensure we get exactly what we need
print(df.head(20).to_string())
