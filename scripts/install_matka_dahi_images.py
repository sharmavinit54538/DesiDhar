import os
from PIL import Image

DEST_DIR = r"d:\desi\DesiDhar\public\images\products\curd-dahi\traditional-matka-curd"
os.makedirs(DEST_DIR, exist_ok=True)

images_map = {
    'main': r"C:\Users\Dell\.gemini\antigravity-ide\brain\046f169d-6b18-4bc1-89eb-c27b462a03d8\matka_dahi_main_1792472390280.jpg",
    'closeup': r"C:\Users\Dell\.gemini\antigravity-ide\brain\046f169d-6b18-4bc1-89eb-c27b462a03d8\matka_dahi_closeup_1792472416709.jpg",
    'packaging': r"C:\Users\Dell\.gemini\antigravity-ide\brain\046f169d-6b18-4bc1-89eb-c27b462a03d8\matka_dahi_packaging_1792472449789.jpg",
    'serving': r"C:\Users\Dell\.gemini\antigravity-ide\brain\046f169d-6b18-4bc1-89eb-c27b462a03d8\matka_dahi_serving_1792472477825.jpg",
}

for img_type, src_path in images_map.items():
    if not os.path.exists(src_path):
        print(f"Error: {src_path} not found!")
        continue
    
    img = Image.open(src_path)
    w, h = img.size
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = (h - min_dim) // 2
    img = img.crop((left, top, left + min_dim, top + min_dim))
    
    for size in [1200, 800, 400]:
        resized = img.resize((size, size), Image.Resampling.LANCZOS)
        out_name = f"{img_type}-{size}.webp"
        out_path = os.path.join(DEST_DIR, out_name)
        resized.save(out_path, 'WEBP', quality=90)
        print(f"Saved: {out_path} ({size}x{size})")

print("All Matka Dahi images processed and saved successfully in WebP format!")
