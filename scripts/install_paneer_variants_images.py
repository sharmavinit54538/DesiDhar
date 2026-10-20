import os
from PIL import Image

BASE_DIR = r"d:\desi\DesiDhar\public\images\products\paneer"

tasks = [
    (
        r"C:\Users\Dell\.gemini\antigravity-ide\brain\046f169d-6b18-4bc1-89eb-c27b462a03d8\a2_gir_paneer_main_1792472763777.jpg",
        os.path.join(BASE_DIR, "pure-a2-gir-cow-paneer")
    ),
    (
        r"C:\Users\Dell\.gemini\antigravity-ide\brain\046f169d-6b18-4bc1-89eb-c27b462a03d8\diet_paneer_main_1792472798442.jpg",
        os.path.join(BASE_DIR, "low-fat-high-protein-diet-paneer")
    ),
]

for src_path, dest_dir in tasks:
    os.makedirs(dest_dir, exist_ok=True)
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
        out_name = f"main-{size}.webp"
        out_path = os.path.join(dest_dir, out_name)
        resized.save(out_path, 'WEBP', quality=90)
        print(f"Saved: {out_path} ({size}x{size})")

print("Both Paneer products WebP images processed and saved successfully!")
