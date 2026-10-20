import re
import json

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

items = [
    'low-fat-toned-cow-milk',
    'Roasted Jeera & Mint Spiced Paneer',
    'Smoked Clay-Oven Paneer Cubes',
    'Fresh Cooking Cream (35% Fat)',
    'Heavy Whipping Cream (38% Fat)',
    'Royal Kesar & Cardamom Dessert Malai',
    'Pure Murrah Buffalo Ghee (Heavy & Rich)',
    'Cultured Himalayan Grass-Fed Ghee',
    'Medhya Herb Brahmi Desi Ghee',
    'Golden Table Butter (Lightly Salted)',
    'Garlic & Fresh Coriander Makkhan',
    'Artisanal Sweet Cream Unsalted Butter',
    'Smoked Kashmiri Mirch & Herb Makkhan'
]

product_blocks = text.split("  {\n    id: '")

results = []
for block in product_blocks[1:]:
    id_match = re.search(r"^([^']+)'", block)
    slug_match = re.search(r"slug:\s*'([^']+)'", block)
    name_match = re.search(r"name:\s*'([^']+)'", block)
    cat_match = re.search(r"category:\s*'([^']+)'", block)
    
    if slug_match and name_match and cat_match:
        pid = id_match.group(1) if id_match else ''
        slug = slug_match.group(1)
        name = name_match.group(1)
        cat = cat_match.group(1)
        
        for item in items:
            if item.lower() in slug.lower() or item.lower() in name.lower():
                results.append({
                    'id': pid,
                    'slug': slug,
                    'name': name,
                    'category': cat
                })
                break

print(f"Matched {len(results)} of {len(items)} items:")
for r in results:
    print(f"- slug: {r['slug']}, cat: {r['category']}, name: {r['name']}")

with open('scripts/13_products_list.json', 'w') as f:
    json.dump(results, f, indent=2)
