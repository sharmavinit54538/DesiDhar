import re
import json

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Load the verified specific map
verified_images = {
    'shuddh-desi-ghee-kaju-katli': [
        '/images/products/mithai/shuddh-desi-ghee-kaju-katli/main-800.webp',
        '/images/products/mithai/shuddh-desi-ghee-kaju-katli/serving-800.webp'
    ],
    'farm-fresh-malai-paneer': [
        '/images/products/paneer/farm-fresh-malai-paneer/main-800.webp',
        '/images/products/paneer/farm-fresh-malai-paneer/closeup-800.webp',
        '/images/products/paneer/farm-fresh-malai-paneer/serving-800.webp'
    ],
    'shuddh-masala-badam-kesar-milk': [
        '/images/products/milk/shuddh-masala-badam-kesar-milk/main-800.webp'
    ],
    'pure-clotted-desi-malai': [
        '/images/products/cream/pure-clotted-desi-malai/main-800.webp'
    ],
    'desi-a2-gir-cow-bilona-ghee': [
        '/images/products/ghee/desi-a2-gir-cow-bilona-ghee/main-800.webp',
        '/images/products/ghee/desi-a2-gir-cow-bilona-ghee/serving-800.webp'
    ],
    'daily-morning-essentials-combo': [
        '/images/products/combo-packs/daily-morning-essentials-combo/main-800.webp'
    ],
    'royal-shahi-feast-combo': [
        '/images/products/combo-packs/royal-shahi-feast-combo/main-800.webp'
    ],
    'fresh-a2-gir-cow-raw-milk': [
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80'
    ],
    'desi-safed-makkhan': [
        'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80'
    ],
    'desi-cow-milk-cheddar-block': [
        'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80'
    ],
    'sweet-celebration-duo-combo': [
        '/images/products/mithai/shuddh-desi-ghee-kaju-katli/serving-800.webp'
    ],
    'royal-shahi-heritage-brass-mithai-box': [
        '/images/products/mithai/shuddh-desi-ghee-kaju-katli/packaging-800.webp'
    ]
}

# Regex replacement function for each product block
def replace_product_images(block):
    slug_m = re.search(r'slug:\s*[\'"]([^\'"]+)[\'"]', block)
    cat_m = re.search(r'category:\s*[\'"]([^\'"]+)[\'"]', block)
    if not slug_m or not cat_m:
        return block
    slug = slug_m.group(1)
    cat = cat_m.group(1)

    if slug in verified_images:
        imgs = verified_images[slug]
    else:
        imgs = [f"/images/placeholders/category-{cat}.svg"]

    formatted_imgs = "images: [\n" + ",\n".join(f"      '{img}'" for img in imgs) + "\n    ],"
    
    # Replace existing images array in block
    block_replaced = re.sub(r'images:\s*\[(.*?)\]\s*,', formatted_imgs, block, flags=re.DOTALL)
    return block_replaced

# Process blocks
blocks = content.split('  {\n    id: ')
new_blocks = [blocks[0]]
for b in blocks[1:]:
    new_blocks.append(replace_product_images(b))

new_content = '  {\n    id: '.join(new_blocks)

with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated src/data/products.ts with clean authentic and placeholder images!")
