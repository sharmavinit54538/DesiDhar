import json

with open('scripts/13_products_list.json') as f:
    products = json.load(f)

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    prod_text = f.read()

with open('src/data/productImages.ts', 'r', encoding='utf-8') as f:
    img_text = f.read()

all_good = True
for p in products:
    slug = p['slug']
    cat = p['category']
    img_path = f"/images/products/{cat}/{slug}/main-800.webp"
    has_prod = f"slug: '{slug}'" in prod_text and img_path in prod_text
    has_img = f"'{slug}':" in img_text and img_path in img_text
    print(f"[{'OK' if has_prod and has_img else 'FAIL'}] {slug} -> products.ts: {has_prod}, productImages.ts: {has_img}")
    if not (has_prod and has_img):
        all_good = False

print("\nAll 13 products mapped perfectly:", all_good)
