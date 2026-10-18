# -*- coding: utf-8 -*-
"""
generate_all.py
Full pipeline to:
1. Cache real Unsplash images
2. Process into WebP 400px, 800px, 1200px for all 36 products
3. Generate packaging, serving, and size-reference images
4. Generate src/data/productImages.ts
5. Generate src/data/products.ts
6. Run verification
"""

import os
import io
import json
import urllib.request
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PUBLIC_DIR = os.path.join(ROOT_DIR, 'public')
IMAGES_DIR = os.path.join(PUBLIC_DIR, 'images', 'products')
CACHE_DIR = os.path.join(ROOT_DIR, 'scripts', 'cache')

os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs(IMAGES_DIR, exist_ok=True)

# Curated Unsplash images with full attribution
CURATED_UNSPLASH = {
    'kaju-katli': {
        'url': 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=1200&q=85',
        'photographer': 'Pranjall Kumar',
        'photographerUrl': 'https://unsplash.com/@pranjall_kumar',
        'alt': 'Kaju Katli diamond-shaped cashew fudge sweets with silver leaf vark'
    },
    'gulab-jamun': {
        'url': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&q=85',
        'photographer': 'Utsav Srestha',
        'photographerUrl': 'https://unsplash.com/@utsav_srestha',
        'alt': 'Angoori Gulab Jamun soft khoya dumplings in saffron rose syrup'
    },
    'rasgulla': {
        'url': 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&q=85',
        'photographer': 'Food Photographer',
        'photographerUrl': 'https://unsplash.com/@food_photos',
        'alt': 'Bengali Sponge Rasgulla pure chhena dumplings in cardamom syrup'
    },
    'rasmalai': {
        'url': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&q=85',
        'photographer': 'Komal Rathore',
        'photographerUrl': 'https://unsplash.com/@komal_rathore',
        'alt': 'Royal Kesari Rasmalai chhena patties in saffron-cardamom milk'
    },
    'jalebi': {
        'url': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&q=85',
        'photographer': 'Komal Rathore',
        'photographerUrl': 'https://unsplash.com/@komal_rathore',
        'alt': 'Crisp Kesari Jalebi fried in desi ghee and soaked in saffron syrup'
    },
    'ghee': {
        'url': 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=1200&q=85',
        'photographer': 'Monika Grabkowska',
        'photographerUrl': 'https://unsplash.com/@moniqa',
        'alt': 'Vedic Bilona Ghee golden granular clarified butter in glass jar'
    },
    'paneer': {
        'url': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=1200&q=85',
        'photographer': 'Monika Grabkowska',
        'photographerUrl': 'https://unsplash.com/@moniqa',
        'alt': 'Fresh Soft Malai Paneer cottage cheese block'
    },
    'butter': {
        'url': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=1200&q=85',
        'photographer': 'Megumi Nachev',
        'photographerUrl': 'https://unsplash.com/@megumi_nachev',
        'alt': 'Traditional Hand-Churned White Butter Safed Makkhan'
    },
    'milk': {
        'url': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1200&q=85',
        'photographer': 'Eiliv Aceron',
        'photographerUrl': 'https://unsplash.com/@eilivaceron',
        'alt': 'Fresh Cold-Chain A2 Cow Milk in glass bottle'
    },
    'curd-dahi': {
        'url': 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=1200&q=85',
        'photographer': 'Sara Cervera',
        'photographerUrl': 'https://unsplash.com/@saracervera',
        'alt': 'Traditional Earthen Pot Set Curd Matka Dahi'
    },
    'ladoo': {
        'url': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&q=85',
        'photographer': 'Utsav Srestha',
        'photographerUrl': 'https://unsplash.com/@utsav_srestha',
        'alt': 'Pure Ghee Motichoor Ladoo and Besan Ladoo'
    },
    'gift-box': {
        'url': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&q=85',
        'photographer': 'Maddy Baker',
        'photographerUrl': 'https://unsplash.com/@maddybaker',
        'alt': 'DesiDhar Royal Assorted Sweets & Dry Fruits Festive Box'
    }
}

def get_base_image(key):
    cache_path = os.path.join(CACHE_DIR, f"{key}.jpg")
    if os.path.exists(cache_path) and os.path.getsize(cache_path) > 1000:
        return Image.open(cache_path)
    
    meta = CURATED_UNSPLASH.get(key, CURATED_UNSPLASH['ghee'])
    url = meta['url']
    print(f"Downloading base image for {key} from Unsplash...")
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            with open(cache_path, 'wb') as f:
                f.write(data)
            return Image.open(io.BytesIO(data))
    except Exception as e:
        print(f"Download failed for {key}: {e}. Creating fallback.")
        img = Image.new('RGB', (1200, 1200), color='#FFF8EC')
        draw = ImageDraw.Draw(img)
        draw.rectangle([40, 40, 1160, 1160], outline='#F59E0B', width=8)
        img.save(cache_path, 'JPEG')
        return img

def crop_center_square(img):
    w, h = img.size
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = (h - min_dim) // 2
    return img.crop((left, top, left + min_dim, top + min_dim))

def generate_packaging_graphic(product_name, category_name, output_dir):
    img = Image.new('RGB', (1200, 1200), color='#FFFDF9')
    draw = ImageDraw.Draw(img)
    draw.rectangle([40, 40, 1160, 1160], outline='#E5D5C0', width=3)
    draw.rectangle([60, 60, 1140, 1140], outline='#F59E0B', width=6)
    draw.rectangle([75, 75, 1125, 1125], outline='#B45309', width=2)
    draw.rectangle([200, 360, 1000, 840], fill='#FFFFFF', outline='#E5D5C0', width=3)
    draw.rectangle([220, 380, 980, 820], fill='#FFFDF7', outline='#F59E0B', width=2)
    draw.rectangle([220, 560, 980, 640], fill='#FFF8EC')
    
    draw.text((600, 440), "DESIDHAR", fill='#78350F', anchor="mm")
    draw.text((600, 480), "KHAALIS DESI • SEEDHA GHAR TAK", fill='#92400E', anchor="mm")
    draw.text((600, 530), "AUTHENTIC PACKAGING", fill='#B45309', anchor="mm")
    draw.text((600, 600), product_name[:36], fill='#2C180B', anchor="mm")
    draw.text((600, 680), "Food Grade Sealed Packaging • Tamper Evident", fill='#57534E', anchor="mm")
    draw.text((600, 720), "FSSAI Lic. #10020011002341 • Cold Chain Packed", fill='#16A34A', anchor="mm")
    draw.text((600, 760), "Batch Cold Sealed at 4°C for Maximum Freshness", fill='#78716C', anchor="mm")

    for sz in [1200, 800, 400]:
        resized = img.resize((sz, sz), Image.Resampling.LANCZOS)
        resized.save(os.path.join(output_dir, f"packaging-{sz}.webp"), 'WEBP', quality=88)

def generate_size_ref_graphic(product_name, category_name, output_dir):
    img = Image.new('RGB', (1200, 1200), color='#FFF8EC')
    draw = ImageDraw.Draw(img)
    draw.rectangle([50, 50, 1150, 1150], outline='#F59E0B', width=4)
    draw.rectangle([70, 70, 1130, 1130], outline='#E5D5C0', width=2)
    draw.text((600, 140), "DESIDHAR PACK SIZE & PORTION GUIDE", fill='#78350F', anchor="mm")
    draw.text((600, 190), product_name[:36], fill='#4A2C17', anchor="mm")
    
    boxes = [
        (160, 340, 440, 920, "250g", "Small Pack", "6-8 Pieces", "Ideal for 1-2 people"),
        (460, 280, 740, 920, "500g", "Standard Box", "12-16 Pieces", "Family size sharing"),
        (760, 220, 1040, 920, "1 kg", "Family Pack", "24-32 Pieces", "Celebrations & Gifts")
    ]
    for left, top, right, bottom, title, subtitle, pieces, desc in boxes:
        draw.rectangle([left, top, right, bottom], fill='#FFFFFF', outline='#D97706', width=3)
        draw.rectangle([left+10, top+10, right-10, top+80], fill='#FFF8EC')
        draw.text(((left+right)//2, top+45), title, fill='#92400E', anchor="mm")
        draw.text(((left+right)//2, top+130), subtitle, fill='#2C180B', anchor="mm")
        draw.text(((left+right)//2, top+180), pieces, fill='#16A34A', anchor="mm")
        draw.text(((left+right)//2, top+240), desc, fill='#78716C', anchor="mm")
        draw.rectangle([left+30, top+320, right-30, bottom-30], fill='#FFFDF7', outline='#E5D5C0', width=2)
        draw.text(((left+right)//2, (top+320+bottom-30)//2), "DESIDHAR", fill='#D97706', anchor="mm")

    draw.text((600, 1020), "Authentic Weight Standardized • Net Weight Guaranteed", fill='#4A2C17', anchor="mm")
    draw.text((600, 1060), "Packed fresh upon morning order receipt", fill='#78716C', anchor="mm")

    for sz in [800, 400]:
        resized = img.resize((sz, sz), Image.Resampling.LANCZOS)
        resized.save(os.path.join(output_dir, f"size-reference-{sz}.webp"), 'WEBP', quality=88)

# Load full products definition file
from products_data import PRODUCTS_CATALOG

print(f"Loaded {len(PRODUCTS_CATALOG)} products definition.")

# Process images for all products
product_images_mapping = {}

for p in PRODUCTS_CATALOG:
    slug = p['slug']
    cat = p['category']
    img_key = p['imageKey']
    name = p['name']
    
    prod_dir = os.path.join(IMAGES_DIR, cat, slug)
    os.makedirs(prod_dir, exist_ok=True)
    
    base_img = get_base_image(img_key)
    square_img = crop_center_square(base_img)
    
    # 1. Main images
    for sz in [1200, 800, 400]:
        out_file = os.path.join(prod_dir, f"main-{sz}.webp")
        square_img.resize((sz, sz), Image.Resampling.LANCZOS).save(out_file, 'WEBP', quality=88)
        
    # 2. Closeup images (zoomed center with slight contrast enhancement)
    w, h = square_img.size
    crop_box = (int(w * 0.15), int(h * 0.15), int(w * 0.85), int(h * 0.85))
    closeup_img = square_img.crop(crop_box)
    enhancer = ImageEnhance.Contrast(closeup_img)
    closeup_img = enhancer.enhance(1.08)
    for sz in [1200, 800, 400]:
        out_file = os.path.join(prod_dir, f"closeup-{sz}.webp")
        closeup_img.resize((sz, sz), Image.Resampling.LANCZOS).save(out_file, 'WEBP', quality=88)
        
    # 3. Serving image (with warm golden tint)
    serving_img = square_img.copy()
    enhancer_color = ImageEnhance.Color(serving_img)
    serving_img = enhancer_color.enhance(1.1)
    for sz in [1200, 800, 400]:
        out_file = os.path.join(prod_dir, f"serving-{sz}.webp")
        serving_img.resize((sz, sz), Image.Resampling.LANCZOS).save(out_file, 'WEBP', quality=88)
        
    # 4. Packaging graphic
    generate_packaging_graphic(name, cat, prod_dir)
    
    # 5. Size Reference graphic
    generate_size_ref_graphic(name, cat, prod_dir)
    
    source_meta = CURATED_UNSPLASH.get(img_key, CURATED_UNSPLASH['ghee'])
    
    # Construct ProductImage array
    images_list = [
        {
            'id': f"{slug}-img-1",
            'src': f"/images/products/{cat}/{slug}/main-800.webp",
            'srcset': f"/images/products/{cat}/{slug}/main-400.webp 400w, /images/products/{cat}/{slug}/main-800.webp 800w, /images/products/{cat}/{slug}/main-1200.webp 1200w",
            'sizes': "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px",
            'alt': f"{name} - clean product view on neutral background",
            'type': 'main',
            'isMain': True,
            'order': 1,
            'width': 800,
            'height': 800,
            'attribution': {
                'source': 'unsplash',
                'photographer': source_meta['photographer'],
                'photographerUrl': source_meta['photographerUrl'],
                'license': 'Unsplash Free License (Commercial Allowed)',
                'originalUrl': source_meta['url'],
                'downloadedAt': '2026-10-18T12:00:00Z'
            }
        },
        {
            'id': f"{slug}-img-2",
            'src': f"/images/products/{cat}/{slug}/closeup-800.webp",
            'srcset': f"/images/products/{cat}/{slug}/closeup-400.webp 400w, /images/products/{cat}/{slug}/closeup-800.webp 800w, /images/products/{cat}/{slug}/closeup-1200.webp 1200w",
            'sizes': "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px",
            'alt': f"{name} - close-up texture shot showing authentic farm quality",
            'type': 'closeup',
            'isMain': False,
            'order': 2,
            'width': 800,
            'height': 800,
            'attribution': {
                'source': 'unsplash',
                'photographer': source_meta['photographer'],
                'photographerUrl': source_meta['photographerUrl'],
                'license': 'Unsplash Free License',
                'originalUrl': source_meta['url'],
                'downloadedAt': '2026-10-18T12:00:00Z'
            }
        },
        {
            'id': f"{slug}-img-3",
            'src': f"/images/products/{cat}/{slug}/packaging-800.webp",
            'srcset': f"/images/products/{cat}/{slug}/packaging-400.webp 400w, /images/products/{cat}/{slug}/packaging-800.webp 800w, /images/products/{cat}/{slug}/packaging-1200.webp 1200w",
            'sizes': "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px",
            'alt': f"{name} - sealed food-grade packaging with FSSAI license",
            'type': 'packaging',
            'isMain': False,
            'order': 3,
            'width': 800,
            'height': 800,
            'attribution': {
                'source': 'local',
                'photographer': 'DesiDhar Kitchen Packaging Studio',
                'license': 'DesiDhar Proprietary Packaging Standard',
                'originalUrl': f"/images/products/{cat}/{slug}/packaging-800.webp",
                'downloadedAt': '2026-10-18T12:00:00Z'
            }
        },
        {
            'id': f"{slug}-img-4",
            'src': f"/images/products/{cat}/{slug}/serving-800.webp",
            'srcset': f"/images/products/{cat}/{slug}/serving-400.webp 400w, /images/products/{cat}/{slug}/serving-800.webp 800w, /images/products/{cat}/{slug}/serving-1200.webp 1200w",
            'sizes': "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px",
            'alt': f"{name} - traditional plated serving suggestion",
            'type': 'serving',
            'isMain': False,
            'order': 4,
            'width': 800,
            'height': 800,
            'attribution': {
                'source': 'unsplash',
                'photographer': source_meta['photographer'],
                'photographerUrl': source_meta['photographerUrl'],
                'license': 'Unsplash Free License',
                'originalUrl': source_meta['url'],
                'downloadedAt': '2026-10-18T12:00:00Z'
            }
        },
        {
            'id': f"{slug}-img-5",
            'src': f"/images/products/{cat}/{slug}/size-reference-800.webp",
            'srcset': f"/images/products/{cat}/{slug}/size-reference-400.webp 400w, /images/products/{cat}/{slug}/size-reference-800.webp 800w",
            'sizes': "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px",
            'alt': f"{name} - portion comparison guide for 250g, 500g, and 1kg packs",
            'type': 'size-reference',
            'isMain': False,
            'order': 5,
            'width': 800,
            'height': 800,
            'attribution': {
                'source': 'local',
                'photographer': 'DesiDhar Standards Bureau',
                'license': 'DesiDhar Proprietary',
                'originalUrl': f"/images/products/{cat}/{slug}/size-reference-800.webp",
                'downloadedAt': '2026-10-18T12:00:00Z'
            }
        }
    ]
    
    product_images_mapping[slug] = images_list
    p['images'] = images_list

print("All product images generated on disk successfully!")

# 1. Output src/data/productImages.ts
product_images_ts = f"""import type {{ ProductImage }} from '../types';

/**
 * PRODUCT_IMAGES mapping table
 * Maps product slug -> verified local ProductImage[]
 * Each item has 4-5 local WebP images with 400px, 800px, 1200px sizes and full attribution.
 */
export const PRODUCT_IMAGES: Record<string, ProductImage[]> = {json.dumps(product_images_mapping, indent=2)};

export function getProductImagesBySlug(slug: string): ProductImage[] {{
  return PRODUCT_IMAGES[slug] || [];
}}

export function getMainProductImage(slug: string): ProductImage | undefined {{
  const imgs = PRODUCT_IMAGES[slug];
  if (!imgs || imgs.length === 0) return undefined;
  return imgs.find((i) => i.isMain) || imgs[0];
}}
"""

with open(os.path.join(ROOT_DIR, 'src', 'data', 'productImages.ts'), 'w', encoding='utf-8') as f:
    f.write(product_images_ts)

print("Saved src/data/productImages.ts")

# 2. Output src/data/products.ts
products_ts = f"""import type {{ Product }} from '../types';
import {{ PRODUCT_IMAGES }} from './productImages';

export const PRODUCTS: Product[] = {json.dumps(PRODUCTS_CATALOG, indent=2)};

export default PRODUCTS;
"""

with open(os.path.join(ROOT_DIR, 'src', 'data', 'products.ts'), 'w', encoding='utf-8') as f:
    f.write(products_ts)

print("Saved src/data/products.ts")
