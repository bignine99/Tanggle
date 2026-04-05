import os
import glob

files = glob.glob('02_processed_data/structured_data/**/*.json', recursive=True)
total_bytes = 0
total_words = 0

for f in files:
    total_bytes += os.path.getsize(f)
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            total_words += len(content.split())
    except:
        pass

print(f"Files: {len(files)}")
print(f"Size MB: {total_bytes / (1024 * 1024):.2f} MB")
print(f"Size KB: {total_bytes / 1024:.2f} KB")
print(f"Total Words: {total_words:,}")
