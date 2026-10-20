import urllib.request
import os
from PIL import Image

DEST_BASE = r"d:\desi\DesiDhar\public\images\products"
TEMP_BASE = r"d:\desi\DesiDhar\scripts\temp_finish"
os.makedirs(TEMP_BASE, exist_ok=True)

HEADERS = {'User-Agent': 'DesiDharApp/1.0 (https://desidhar.com; contact@desidhar.com)'}

REMAINING = {
    'brahmi-shankhpushpi-medhya-ghee': {
        'cat': 'ghee',
        'shots': {
            'main': 'https://upload.wikimedia.org/wikipedia/commons/d/db/Desi_ghee.JPG',
            'closeup': 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Butterschmalz-3.jpg',
            'serving': 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Cream_to_get_clarified_butter_home_made.Ghee.jpg'
        }
    },
    'fresh-dairy-cooking-cream': {
        'cat': 'cream',
        'shots': {
            'closeup': 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Whipping_cream_%283372596784%29.jpg',
            'serving': 'https://upload.wikimedia.org/wikipedia/commons/4/4f/And_some_whipped_cream_%284315201282%29.jpg'
        }
    },
    'pure-heavy-whipping-cream': {
        'cat': 'cream',
        'shots': {
            'main': 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Whipping_cream_%283372596784%29.jpg',
            'closeup': 'https://upload.wikimedia.org/wikipedia/commons/4/4f/And_some_whipped_cream_%284315201282%29.jpg',
            'serving': 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Stawberries_and_whipped_cream.jpg'
        }
    },
    'royal-kesar-dessert-malai': {
        'cat': 'cream',
        'shots': {
            'main': 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Lucknow_ka_Makhan_Malai-MB45.jpg',
            'closeup': 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Malaiyo.jpg',
            'serving': 'https://upload.wikimedia.org/wikipedia/commons/0/05/Neemus_-_Sheherwali_Milk_Foam.jpg'
        }
    }
}

for slug, data in REMAINING.items():
    cat = data['cat']
    dest_dir = os.path.join(DEST_BASE, cat, slug)
    os.makedirs(dest_dir, exist_ok=True)
    temp_dir = os.path.join(TEMP_BASE, slug)
    os.makedirs(temp_dir, exist_ok=True)
    
    for shot, url in data['shots'].items():
        temp_file = os.path.join(temp_dir, f"{shot}.jpg")
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as resp:
                with open(temp_file, 'wb') as tf:
                    tf.write(resp.read())
            
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
                    out_path = os.path.join(dest_dir, f"{shot}-{sz}.webp")
                    resized.save(out_path, 'WEBP', quality=90)
            print(f"OK: {slug} - {shot}")
        except Exception as e:
            print(f"Error {slug} {shot}: {e}")

print("Done remaining products!")
