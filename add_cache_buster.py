import re

for filename in ['index.html', 'admin.html']:
    with open(filename, 'r') as f:
        content = f.read()
    
    content = re.sub(r'\?v=177644064[0-9]*', '?v=1776440650', content)
    
    with open(filename, 'w') as f:
        f.write(content)

