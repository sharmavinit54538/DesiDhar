import re
import json

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Match each product block
product_blocks = re.split(r'\n  \{\s*\n\s*id:\s*', content)

results = []
for block in product_blocks[1:]:
    block = 'id: ' + block
    id_m = re.search(r'id:\s*[\'"]([^\'"]+)[\'"]', block)
    slug_m = re.search(r'slug:\s*[\'"]([^\'"]+)[\'"]', block)
    name_m = re.search(r'name:\s*[\'"]([^\'"]+)[\'"]', block)
    cat_m = re.search(r'category:\s*[\'"]([^\'"]+)[\'"]', block)
    subcat_m = re.search(r'subcategory:\s*[\'"]([^\'"]+)[\'"]', block)
    img_m = re.search(r'images:\s*\[(.*?)\]', block, re.DOTALL)
    
    prod_id = id_m.group(1) if id_m else ''
    slug = slug_m.group(1) if slug_m else ''
    name = name_m.group(1) if name_m else ''
    cat = cat_m.group(1) if cat_m else ''
    subcat = subcat_m.group(1) if subcat_m else ''
    
    images = []
    if img_m:
        raw_imgs = img_m.group(1)
        # find string literals
        images = re.findall(r'[\'"]([^\'"]+)[\'"]', raw_imgs)
        
    results.append({
        'id': prod_id,
        'slug': slug,
        'name': name,
        'category': cat,
        'subcategory': subcat,
        'images': images
    })

print(f"Total parsed: {len(results)}")
with open('scripts/product_audit.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

# Check duplicate images across products
image_to_prods = {}
for p in results:
    for img in p['images']:
        image_to_prods.setdefault(img, []).append(p['slug'])

print("\n--- Image reuse across products ---")
reused_count = 0
for img, prods in image_to_prods.items():
    if len(prods) > 1:
        reused_count += 1
        print(f"\nImage used by {len(prods)} products: {img}")
        for slug in prods:
            print(f"   - {slug}")

print(f"\nTotal unique images: {len(image_to_prods)}")
print(f"Total shared/reused images: {reused_count}")
