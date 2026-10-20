import urllib.request
import urllib.parse
import json
import os

queries = {
    'pure-murrah-buffalo-ghee': 'Ghee jar OR Buffalo ghee OR Pure ghee',
    'vedic-cultured-grass-fed-cow-ghee': 'Clarified butter ghee OR Cow ghee OR Bilona ghee',
    'brahmi-shankhpushpi-medhya-ghee': 'Ayurvedic ghee OR Medicated ghee OR Ghrita OR Herbal ghee',
    'low-fat-toned-cow-milk': 'Glass of milk OR Fresh milk glass OR Milk bottle dairy',
    'golden-table-butter-salted': 'Butter block OR Table butter OR Fresh butter dairy',
    'desi-garlic-coriander-butter': 'Garlic butter OR Herb butter OR Parsley butter',
    'artisanal-unsalted-sweet-cream-butter': 'White butter OR Makhan OR Unsalted butter churned',
    'smoked-chilli-herb-makkhan': 'Spiced butter OR Chili butter OR Compound butter',
    'jeera-mint-spiced-fresh-paneer': 'Paneer cubes OR Fresh paneer cottage cheese',
    'smoked-clay-oven-paneer-blocks': 'Paneer tikka OR Tandoori paneer OR Grilled paneer',
    'fresh-dairy-cooking-cream': 'Pouring cream OR Fresh cream dairy OR Heavy cream pitcher',
    'pure-heavy-whipping-cream': 'Whipped cream bowl OR Whipping cream peaks OR Whipped cream whisk',
    'royal-kesar-dessert-malai': 'Malai cream OR Clotted cream OR Rabri dessert OR Kesar malai'
}

def search_commons(q, limit=12):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit={limit}&prop=imageinfo&iiprop=url|size|mime|extmetadata&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'DesiDharApp/1.0 (https://desidhar.com; contact@desidhar.com)'})
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
            meta = ii.get('extmetadata', {})
            artist = meta.get('Artist', {}).get('value', 'Wikimedia Commons')
            lic = meta.get('UsageTerms', {}).get('value', 'Creative Commons')
            if mime in ['image/jpeg', 'image/png'] and w >= 800 and h >= 800:
                results.append({
                    'title': pinfo.get('title', ''),
                    'url': iurl,
                    'width': w,
                    'height': h,
                    'artist': artist,
                    'license': lic
                })
        return results
    except Exception as e:
        print(f"Error {q}: {e}")
        return []

all_res = {}
for slug, q in queries.items():
    res = search_commons(q)
    all_res[slug] = res
    print(f"{slug}: found {len(res)} matches")

with open('scripts/13_search_results.json', 'w') as f:
    json.dump(all_res, f, indent=2)
print("Saved search results to scripts/13_search_results.json")
