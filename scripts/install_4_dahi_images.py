import os
from PIL import Image

BASE_SRC = r"d:\desi\DesiDhar\scripts\temp_dahi"
BASE_DEST = r"d:\desi\DesiDhar\public\images\products\curd-dahi"

products = [
    'authentic-kolkata-baked-mishti-doi',
    'pure-cow-milk-thick-dahi',
    'alphonso-mango-greek-dahi',
    'desi-tadka-masala-chaas-buttermilk'
]

shots = ['main', 'closeup', 'serving']

for p in products:
    src_dir = os.path.join(BASE_SRC, p)
    dest_dir = os.path.join(BASE_DEST, p)
    os.makedirs(dest_dir, exist_ok=True)
    print(f"\nProcessing product: {p}")
    
    for shot in shots:
        src_path = os.path.join(src_dir, f"{shot}.jpg")
        if not os.path.exists(src_path):
            print(f"  Warning: {src_path} not found!")
            continue
        
        try:
            with Image.open(src_path) as img:
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Center-crop square
                w, h = img.size
                min_dim = min(w, h)
                left = (w - min_dim) // 2
                top = (h - min_dim) // 2
                cropped = img.crop((left, top, left + min_dim, top + min_dim))
                
                for size in [1200, 800, 400]:
                    resized = cropped.resize((size, size), Image.Resampling.LANCZOS)
                    out_path = os.path.join(dest_dir, f"{shot}-{size}.webp")
                    resized.save(out_path, 'WEBP', quality=90)
                    print(f"  Saved: {p}/{shot}-{size}.webp ({size}x{size}) -> {os.path.getsize(out_path)} bytes")
        except Exception as e:
            print(f"  Error processing {src_path}: {e}")

print("\nAll 4 Dahi products converted to responsive WebP successfully!")
