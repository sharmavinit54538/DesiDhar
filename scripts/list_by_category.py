import json

with open('scripts/product_audit.json', encoding='utf-8') as f:
    products = json.load(f)

by_cat = {}
for p in products:
    by_cat.setdefault(p['category'], []).append((p['id'], p['slug'], p['name'], p['images']))

for cat, prods in by_cat.items():
    print(f"\n=== {cat.upper()} ({len(prods)} products) ===")
    for pid, slug, name, imgs in prods:
        first_img = imgs[0] if imgs else "NO_IMAGE"
        print(f"  {pid:14} | {slug:40} | {first_img}")
