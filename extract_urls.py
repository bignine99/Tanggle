import re

with open(r'C:\Users\cho\.gemini\antigravity\brain\76211b8d-e4d7-4ed4-8a36-92c04c511257\.system_generated\steps\758\output.txt', 'r', encoding='utf-8') as f:
    html = f.read()

urls = set(re.findall(r'/htm/[a-zA-Z0-9_-]+\.php', html))

with open('urls.txt', 'w', encoding='utf-8') as f:
    for u in sorted(urls):
        f.write(u + '\n')
