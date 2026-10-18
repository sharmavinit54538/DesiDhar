import json

with open('scripts/product_audit.json', encoding='utf-8') as f:
    products = json.load(f)

with open('scripts/catalog_detail.txt', 'w', encoding='utf-8') as out:
    for idx, p in enumerate(products, 1):
        out.write(f"{idx:2d}. {p['id']:14} | {p['category']:12} | {p['slug']:40} | {p['name']}\n")
        out.write(f"    Current Images ({len(p['images'])}): {p['images']}\n")

print(f"Wrote {len(products)} products to scripts/catalog_detail.txt")
