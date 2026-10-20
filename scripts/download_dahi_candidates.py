import os
import urllib.request
from PIL import Image

CANDIDATES = {
    'authentic-kolkata-baked-mishti-doi': [
        ('main', 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Food-Mishti-Doi.jpg'),
        ('closeup', 'https://upload.wikimedia.org/wikipedia/commons/e/ee/A_table_spoon_Mishti_doi_in_Kolkata.jpg'),
        ('serving', 'https://upload.wikimedia.org/wikipedia/commons/2/28/Bengalis%27_favourite_-_mishti_doi.jpg')
    ],
    'pure-cow-milk-thick-dahi': [
        ('main', 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Curd_India.jpg'),
        ('closeup', 'https://upload.wikimedia.org/wikipedia/commons/4/44/Dahi_%28curd%29.jpg'),
        ('serving', 'https://upload.wikimedia.org/wikipedia/commons/7/74/Curd_2.jpg')
    ],
    'alphonso-mango-greek-dahi': [
        ('main', 'https://upload.wikimedia.org/wikipedia/commons/4/43/Mango_Shrikhand.JPG'),
        ('closeup', 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Mango_shrikhand.jpg'),
        ('serving', 'https://upload.wikimedia.org/wikipedia/commons/0/05/Lassi_de_mango.JPG')
    ],
    'desi-tadka-masala-chaas-buttermilk': [
        ('main', 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Masala_chaas.JPG'),
        ('closeup', 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Mint_masala_chaas.JPG'),
        ('serving', 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Masala_Buttermilk.JPG')
    ]
}

TEMP_DIR = r"d:\desi\DesiDhar\scripts\temp_dahi"
os.makedirs(TEMP_DIR, exist_ok=True)

headers = {'User-Agent': 'DesiDharApp/1.0 (https://desidhar.com; support@desidhar.com)'}

for product, shots in CANDIDATES.items():
    print(f"\nDownloading candidates for: {product}")
    p_dir = os.path.join(TEMP_DIR, product)
    os.makedirs(p_dir, exist_ok=True)
    
    for shot_name, url in shots:
        out_file = os.path.join(p_dir, f"{shot_name}.jpg")
        req = urllib.request.Request(url, headers=headers)
        try:
            if not os.path.exists(out_file) or os.path.getsize(out_file) == 0:
                with urllib.request.urlopen(req, timeout=25) as resp:
                    with open(out_file, 'wb') as f:
                        f.write(resp.read())
            
            with Image.open(out_file) as im:
                print(f"  [{shot_name}] OK: {im.size[0]}x{im.size[1]} ({im.format}), {os.path.getsize(out_file)} bytes")
        except Exception as e:
            print(f"  [{shot_name}] FAILED from {url}: {e}")
