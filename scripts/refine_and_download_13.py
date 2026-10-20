import urllib.request
import urllib.parse
import json
import os

HEADERS = {'User-Agent': 'DesiDharApp/1.0 (https://desidhar.com; contact@desidhar.com)'}

def search_commons(q, limit=10):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit={limit}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read())
        pages = data.get('query', {}).get('pages', {})
        results = []
        for pid, pinfo in pages.items():
            ii = pinfo.get('imageinfo', [{}])[0]
            iurl = ii.get('url', '')
            w = ii.get('width', 0)
            h = ii.get('height', 0)
            mime = ii.get('mime', '')
            if mime in ['image/jpeg', 'image/png'] and w >= 800 and h >= 800:
                results.append(iurl)
        return results
    except Exception as e:
        print(f"Error {q}: {e}")
        return []

# Specific high quality fallbacks / search queries for each product:
target_queries = {
    'pure-murrah-buffalo-ghee': 'Ghee jar OR Buffalo ghee',
    'vedic-cultured-grass-fed-cow-ghee': 'Clarified butter ghee OR Bilona ghee',
    'brahmi-shankhpushpi-medhya-ghee': 'Ayurvedic medicated ghee OR Herbal ghee OR Clarified butter jar',
    'low-fat-toned-cow-milk': 'Glass of milk OR Fresh milk glass',
    'golden-table-butter-salted': 'Butter dish OR Fresh butter block OR Table butter',
    'desi-garlic-coriander-butter': 'Garlic butter OR Herb butter compound',
    'artisanal-unsalted-sweet-cream-butter': 'Churned butter OR Fresh butter dairy',
    'smoked-chilli-herb-makkhan': 'Spiced butter OR Chili butter paprika',
    'jeera-mint-spiced-fresh-paneer': 'Paneer cottage cheese OR Fresh paneer',
    'smoked-clay-oven-paneer-blocks': 'Paneer tikka tandoori OR Grilled paneer cubes',
    'fresh-dairy-cooking-cream': 'Pouring cream pitcher OR Fresh dairy cream',
    'pure-heavy-whipping-cream': 'Whipped cream bowl OR Whipping cream peaks',
    'royal-kesar-dessert-malai': 'Malai dessert OR Rabri clotted cream'
}

TEMP_DIR = r"d:\desi\DesiDhar\scripts\temp_13"
os.makedirs(TEMP_DIR, exist_ok=True)

selected_urls = {}

for slug, q in target_queries.items():
    urls = search_commons(q, limit=6)
    if not urls:
        # Broad fallback
        broader = q.split('OR')[0].strip()
        urls = search_commons(broader, limit=6)
    print(f"{slug}: found {len(urls)} urls")
    selected_urls[slug] = urls

with open('scripts/13_urls.json', 'w') as f:
    json.dump(selected_urls, f, indent=2)

print("\nDone searching all 13 products.")
