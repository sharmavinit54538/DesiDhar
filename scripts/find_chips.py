import json

with open('scripts/product_audit.json') as f:
    products = json.load(f)

# Also check products.ts for variants
import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's inspect all products with isFresh: true
blocks = content.split('  {\n    id: ')
for b in blocks[1:]:
    b = 'id: ' + b
    id_m = re.search(r'id:\s*[\'"]([^\'"]+)[\'"]', b)
    name_m = re.search(r'name:\s*[\'"]([^\'"]+)[\'"]', b)
    slug_m = re.search(r'slug:\s*[\'"]([^\'"]+)[\'"]', b)
    fresh_m = re.search(r'isFresh:\s*true', b)
    deal_m = re.search(r'isDeal:\s*true', b)
    var_m = re.findall(r'price:\s*(\d+),\s*mrp:\s*(\d+)', b)
    img_m = re.findall(r'images:\s*\[(.*?)\]', b, re.DOTALL)
    
    prod_id = id_m.group(1) if id_m else ''
    name = name_m.group(1) if name_m else ''
    slug = slug_m.group(1) if slug_m else ''
    
    imgs = []
    if img_m:
        imgs = re.findall(r'[\'"]([^\'"]+)[\'"]', img_m[0])
        
    for p, m in var_m:
        p_val, m_val = int(p), int(m)
        disc = round(((m_val - p_val) / m_val) * 100)
        if disc == 16 or fresh_m:
            print(f"{prod_id} | {slug} | {name} | isFresh={bool(fresh_m)} | disc={disc}% ({p_val}/{m_val}) | imgs={imgs}")
            break
