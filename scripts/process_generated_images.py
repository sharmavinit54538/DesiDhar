import os
from PIL import Image

BRAIN_DIR = r"C:\Users\Dell\.gemini\antigravity-ide\brain\e16f923d-9169-407f-8d72-f979012a02d9"
BASE_OUT = r"d:\desi\DesiDhar\public\images\products"

TASKS = [
    # (source_filename, relative_dest_folder, shot_name)
    ("paneer_malai_main_1792314098216.jpg", "paneer/farm-fresh-malai-paneer", "main"),
    ("paneer_malai_closeup_1792314116098.jpg", "paneer/farm-fresh-malai-paneer", "closeup"),
    ("paneer_malai_serving_1792314296474.jpg", "paneer/farm-fresh-malai-paneer", "serving"),
    
    ("badam_kesar_milk_main_1792314136066.jpg", "milk/shuddh-masala-badam-kesar-milk", "main"),
    
    ("clotted_desi_malai_main_1792314157606.jpg", "cream/pure-clotted-desi-malai", "main"),
    
    ("gir_cow_ghee_main_1792314179841.jpg", "ghee/desi-a2-gir-cow-bilona-ghee", "main"),
    ("gir_cow_ghee_serving_1792314262966.jpg", "ghee/desi-a2-gir-cow-bilona-ghee", "serving"),
    
    ("morning_combo_main_1792314205184.jpg", "combo-packs/daily-morning-essentials-combo", "main"),
    ("shahi_feast_combo_main_1792314230971.jpg", "combo-packs/royal-shahi-feast-combo", "main"),
]

def crop_and_save(img, dest_path, size):
    w, h = img.size
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = (h - min_dim) // 2
    cropped = img.crop((left, top, left + min_dim, top + min_dim))
    resized = cropped.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(dest_path, "WEBP", quality=88)

for src_name, rel_folder, shot_name in TASKS:
    src_path = os.path.join(BRAIN_DIR, src_name)
    dest_dir = os.path.join(BASE_OUT, rel_folder)
    os.makedirs(dest_dir, exist_ok=True)
    
    if not os.path.exists(src_path):
        print(f"Missing source: {src_path}")
        continue
        
    print(f"Processing {src_name} -> {rel_folder}/{shot_name}...")
    with Image.open(src_path) as im:
        im = im.convert("RGB")
        for sz in [1200, 800, 400]:
            out_file = os.path.join(dest_dir, f"{shot_name}-{sz}.webp")
            crop_and_save(im, out_file, sz)
            print(f"   Created {out_file} ({sz}x{sz})")

print("All real images processed successfully!")
