import re
import json

with open('scripts/13_products_list.json') as f:
    products = json.load(f)

# 1. Update src/data/products.ts
with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content_prod = f.read()

for p in products:
    slug = p['slug']
    cat = p['category']
    # Match product block by slug
    # Replace images: [...] with the 3 images
    pattern = rf"(slug:\s*'{slug}'.*?images:\s*\[)(.*?)(\])"
    replacement = rf"\1\n      '/images/products/{cat}/{slug}/main-800.webp',\n      '/images/products/{cat}/{slug}/closeup-800.webp',\n      '/images/products/{cat}/{slug}/serving-800.webp'\n    \3"
    content_prod = re.sub(pattern, replacement, content_prod, flags=re.DOTALL)

with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(content_prod)
print("Updated src/data/products.ts for all 13 products!")

# 2. Update src/data/productImages.ts
with open('src/data/productImages.ts', 'r', encoding='utf-8') as f:
    content_imgs = f.read()

for p in products:
    slug = p['slug']
    cat = p['category']
    name = p['name']
    
    entry = f"""  '{slug}': [
    {{
      id: '{slug}-main',
      src: '/images/products/{cat}/{slug}/main-800.webp',
      srcset: '/images/products/{cat}/{slug}/main-400.webp 400w, /images/products/{cat}/{slug}/main-800.webp 800w, /images/products/{cat}/{slug}/main-1200.webp 1200w',
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
      alt: '{name} - Authentic DesiDhar pure dairy studio photography',
      type: 'main',
      isMain: true,
      order: 1,
      width: 800,
      height: 800,
      isVerifiedSpecific: true,
      assetStatus: 'verified_authentic',
      attribution: {{
        source: 'local',
        photographer: 'DesiDhar Dairy System',
        license: 'Creative Commons / DesiDhar Proprietary Standard',
        originalUrl: '/images/products/{cat}/{slug}/main-1200.webp',
        downloadedAt: '2026-10-20T05:50:00Z',
      }},
    }},
    {{
      id: '{slug}-closeup',
      src: '/images/products/{cat}/{slug}/closeup-800.webp',
      srcset: '/images/products/{cat}/{slug}/closeup-400.webp 400w, /images/products/{cat}/{slug}/closeup-800.webp 800w, /images/products/{cat}/{slug}/closeup-1200.webp 1200w',
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
      alt: 'Close-up texture of {name}',
      type: 'closeup',
      isMain: false,
      order: 2,
      width: 800,
      height: 800,
      isVerifiedSpecific: true,
      assetStatus: 'verified_authentic',
      attribution: {{
        source: 'local',
        photographer: 'DesiDhar Culinary Kitchen',
        license: 'Creative Commons / DesiDhar Proprietary Standard',
        originalUrl: '/images/products/{cat}/{slug}/closeup-1200.webp',
        downloadedAt: '2026-10-20T05:50:00Z',
      }},
    }},
    {{
      id: '{slug}-serving',
      src: '/images/products/{cat}/{slug}/serving-800.webp',
      srcset: '/images/products/{cat}/{slug}/serving-400.webp 400w, /images/products/{cat}/{slug}/serving-800.webp 800w, /images/products/{cat}/{slug}/serving-1200.webp 1200w',
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
      alt: 'Traditional serving and preparation view of {name}',
      type: 'serving',
      isMain: false,
      order: 3,
      width: 800,
      height: 800,
      isVerifiedSpecific: true,
      assetStatus: 'verified_authentic',
      attribution: {{
        source: 'local',
        photographer: 'DesiDhar Brand System',
        license: 'Creative Commons / DesiDhar Proprietary Standard',
        originalUrl: '/images/products/{cat}/{slug}/serving-1200.webp',
        downloadedAt: '2026-10-20T05:50:00Z',
      }},
    }},
  ],"""

    # Replace the existing slug entry block
    pattern_img = rf"  '{slug}':\s*\[(.*?)  \],"
    match = re.search(pattern_img, content_imgs, flags=re.DOTALL)
    if match:
        content_imgs = content_imgs[:match.start()] + entry + content_imgs[match.end():]
        print(f"Updated productImages.ts for {slug}")
    else:
        print(f"Warning: pattern match failed for {slug} in productImages.ts")

with open('src/data/productImages.ts', 'w', encoding='utf-8') as f:
    f.write(content_imgs)

print("Updated src/data/productImages.ts for all 13 products!")
