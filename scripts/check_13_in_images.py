import json

with open('scripts/13_products_list.json') as f:
    products = json.load(f)

with open('src/data/productImages.ts', 'r', encoding='utf-8') as f:
    content = f.read()

for p in products:
    slug = p['slug']
    has_slug = f"'{slug}':" in content
    print(f"{slug}: {has_slug}")
