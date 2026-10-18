import urllib.request
import json
import os

with open('scripts/product_audit.json') as f:
    products = json.load(f)

with open('src/data/banners.ts') as f:
    banners_text = f.read()

import re
all_urls = set(re.findall(r'https://images\.unsplash\.com/[^\s\'"]+', banners_text))
for p in products:
    for img in p['images']:
        if img.startswith('http'):
            all_urls.add(img)

print("Unique external URLs:", len(all_urls))
os.makedirs('scripts/test_urls', exist_ok=True)

for idx, url in enumerate(sorted(all_urls)):
    name = url.split('/')[-1].split('?')[0]
    out_file = f"scripts/test_urls/{name}.jpg"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        if not os.path.exists(out_file):
            with urllib.request.urlopen(req, timeout=10) as r:
                data = r.read()
                with open(out_file, 'wb') as f:
                    f.write(data)
        print(f"Downloaded: {name} -> {os.path.getsize(out_file)} bytes")
    except Exception as e:
        print(f"Failed {name}: {e}")
