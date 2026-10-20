import json
import urllib.request
import os
from PIL import Image

with open('scripts/13_urls.json') as f:
    urls_map = json.load(f)

# Supplementary high-res URLs for items needing more shots
SUPPLEMENT = {
    'brahmi-shankhpushpi-medhya-ghee': [
        'https://upload.wikimedia.org/wikipedia/commons/4/47/Ghee.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/d/de/Bowl_of_ghee.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/6/6f/Clarified_butter.jpg'
    ],
    'fresh-dairy-cooking-cream': [
        'https://upload.wikimedia.org/wikipedia/commons/1/1a/Pouring_fresh_cream.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/c/c8/Cream_in_pitcher.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/e/e0/Jug_of_cream.jpg'
    ],
    'pure-murrah-buffalo-ghee': [
        'https://upload.wikimedia.org/wikipedia/commons/4/4b/Ghee_in_jar.jpg'
    ]
}

# Merge supplement
for k, v in SUPPLEMENT.items():
    if k not in urls_map or len(urls_map[k]) < 3:
        urls_map.setdefault(k, []).extend(v)

with open('scripts/13_products_list.json') as f:
    products = json.load(f)

BASE_DEST = r"d:\desi\DesiDhar\public\images\products"
TEMP_DIR = r"d:\desi\DesiDhar\scripts\temp_13"
os.makedirs(TEMP_DIR, exist_ok=True)

HEADERS = {'User-Agent': 'DesiDharApp/1.0 (https://desidhar.com; contact@desidhar.com)'}

shots = ['main', 'closeup', 'serving']

summary_report = []

for p in products:
    slug = p['slug']
    cat = p['category']
    dest_dir = os.path.join(BASE_DEST, cat, slug)
    os.makedirs(dest_dir, exist_ok=True)
    p_temp = os.path.join(TEMP_DIR, slug)
    os.makedirs(p_temp, exist_ok=True)
    
    available_urls = urls_map.get(slug, [])
    if not available_urls:
        # Fallback to general category image if needed
        print(f"Warning: No URLs for {slug}")
        continue
    
    print(f"\nProcessing product: {cat}/{slug} ({len(available_urls)} available URLs)")
    
    for idx, shot_type in enumerate(shots):
        url = available_urls[idx % len(available_urls)]
        temp_file = os.path.join(p_temp, f"{shot_type}.jpg")
        
        # Download
        if not os.path.exists(temp_file) or os.path.getsize(temp_file) == 0:
            try:
                req = urllib.request.Request(url, headers=HEADERS)
                with urllib.request.urlopen(req, timeout=20) as resp:
                    with open(temp_file, 'wb') as tf:
                        tf.write(resp.read())
            except Exception as e:
                print(f"  Error downloading {url}: {e}")
                # Try first url as fallback
                if available_urls and url != available_urls[0]:
                    try:
                        req = urllib.request.Request(available_urls[0], headers=HEADERS)
                        with urllib.request.urlopen(req, timeout=20) as resp:
                            with open(temp_file, 'wb') as tf:
                                tf.write(resp.read())
                    except Exception as e2:
                        print(f"  Fallback also failed: {e2}")
                        continue
                else:
                    continue
        
        # Process into WebP
        try:
            with Image.open(temp_file) as im:
                if im.mode != 'RGB':
                    im = im.convert('RGB')
                w, h = im.size
                min_dim = min(w, h)
                left = (w - min_dim) // 2
                top = (h - min_dim) // 2
                cropped = im.crop((left, top, left + min_dim, top + min_dim))
                
                for sz in [1200, 800, 400]:
                    resized = cropped.resize((sz, sz), Image.Resampling.LANCZOS)
                    out_path = os.path.join(dest_dir, f"{shot_type}-{sz}.webp")
                    resized.save(out_path, 'WEBP', quality=90)
            print(f"  Installed {shot_type} (1200, 800, 400 WebP)")
        except Exception as e:
            print(f"  Error converting {temp_file}: {e}")

print("\nFinished converting all 13 products!")
