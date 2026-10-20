import os
from PIL import Image

DEST_DIR = r"d:\desi\DesiDhar\public\images\products\combo-packs\dairy-protein-fitness-pack"
os.makedirs(DEST_DIR, exist_ok=True)

images_map = {
    'main': r"C:\Users\Dell\.gemini\antigravity-ide\brain\e16f923d-9169-407f-8d72-f979012a02d9\morning_combo_main_1792314205184.jpg",
    'paneer': r"C:\Users\Dell\.gemini\antigravity-ide\brain\e16f923d-9169-407f-8d72-f979012a02d9\paneer_malai_main_1792314098216.jpg",
    'closeup': r"C:\Users\Dell\.gemini\antigravity-ide\brain\e16f923d-9169-407f-8d72-f979012a02d9\paneer_malai_closeup_1792314116098.jpg",
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

print("All Dairy Protein Fitness Pack images processed and saved successfully in WebP format!")
