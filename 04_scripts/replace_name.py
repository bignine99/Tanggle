import os
import json

base_dir = r"c:\Users\cho\Desktop\Temp\05_1_code\260405_Tanggle\02_processed_data\structured_data"
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.json'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            if '오상현' in content:
                content = content.replace('오상현', '오창현')
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
print("Finished Replacing Names")
