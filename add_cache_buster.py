import re
import time

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'src="data.js.*?"', f'src="data.js?v={int(time.time())}"', text)
text = re.sub(r'src="app.js.*?"', f'src="app.js?v={int(time.time())}"', text)
text = re.sub(r'href="style.css.*?"', f'href="style.css?v={int(time.time())}"', text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('admin.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'src="admin.js.*?"', f'src="admin.js?v={int(time.time())}"', text)
text = re.sub(r'href="admin.css.*?"', f'href="admin.css?v={int(time.time())}"', text)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(text)

