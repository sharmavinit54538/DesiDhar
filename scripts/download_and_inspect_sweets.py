import os
import urllib.request
import json
from PIL import Image

CANDIDATES = {
    'desi-ghee-gulab-jamun': [
        ('main', 'https://upload.wikimedia.org/wikipedia/commons/d/de/Gulab_Jamun-3052.jpg'),
        ('closeup', 'https://upload.wikimedia.org/wikipedia/commons/1/12/Gulab_Jamun_-_Best_dessert.JPG'),
        ('serving', 'https://upload.wikimedia.org/wikipedia/commons/7/77/1_Gulab_Jamun_Mithai_Sweets_of_India.jpg')
    ],
    'royal-kesari-rasmalai': [
        ('main', 'https://upload.wikimedia.org/wikipedia/commons/6/62/Rasmalai-_Indian_dessert.JPG'),
        ('closeup', 'https://upload.wikimedia.org/wikipedia/commons/4/45/Rasa_malai.jpg'),
        ('serving', 'https://upload.wikimedia.org/wikipedia/commons/d/df/Ras_Malai.JPG')
    ],
    'bengali-sponge-rasgulla': [
        ('main', 'https://upload.wikimedia.org/wikipedia/commons/3/39/Rasgulla.jpg'),
        ('closeup', 'https://upload.wikimedia.org/wikipedia/commons/a/af/Rasgulla_Sweet.JPG'),
        ('serving', 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Rasgulla_1.JPG')
    ],
    'shuddh-ghee-motichoor-ladoo': [
        ('main', 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Mothi_Chur_Laddu%2C_one_of_the_most_popular_Indian_Sweets%2C_photographed_in_West_Bengal%2C_by_Yogabrata_Chakraborty.jpg'),
        ('closeup', 'https://upload.wikimedia.org/wikipedia/commons/6/65/Motichoor_Laddu.jpg'),
        ('serving', 'https://upload.wikimedia.org/wikipedia/commons/6/61/Motichoor_Ki_Laadu_Khajrana_Indore.jpg')
    ],
    'authentic-mathura-peda': [
        ('main', 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Dharwad_pedha.jpg'),
        ('closeup', 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Peda_%28bright%29.JPG'),
        ('serving', 'https://upload.wikimedia.org/wikipedia/commons/0/06/Peda_Sweet.jpg')
    ]
}

TEMP_DIR = r"d:\desi\DesiDhar\scripts\temp_sweets"
os.makedirs(TEMP_DIR, exist_ok=True)

headers = {'User-Agent': 'DesiDharApp/1.0 (https://desidhar.com; contact@desidhar.com)'}

for product, shots in CANDIDATES.items():
    print(f"\nDownloading candidates for: {product}")
    p_dir = os.path.join(TEMP_DIR, product)
    os.makedirs(p_dir, exist_ok=True)
    
    for shot_name, url in shots:
        ext = url.split('.')[-1].split('?')[0].lower()
        if ext not in ['jpg', 'jpeg', 'png']:
            ext = 'jpg'
        out_file = os.path.join(p_dir, f"{shot_name}.{ext}")
        
        req = urllib.request.Request(url, headers=headers)
        try:
            if not os.path.exists(out_file) or os.path.getsize(out_file) == 0:
                with urllib.request.urlopen(req, timeout=20) as resp:
                    with open(out_file, 'wb') as f:
                        f.write(resp.read())
            
            with Image.open(out_file) as im:
                print(f"  [{shot_name}] OK: {im.size[0]}x{im.size[1]} ({im.format}), {os.path.getsize(out_file)} bytes")
        except Exception as e:
            print(f"  [{shot_name}] FAILED from {url}: {e}")
