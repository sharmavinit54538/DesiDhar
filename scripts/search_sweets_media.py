import urllib.request
import urllib.parse
import json
import os

def search_commons(query, limit=15):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit={limit}&prop=imageinfo&iiprop=url|size|mime|extmetadata&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'DesiDharApp/1.0 (https://desidhar.com; contact@desidhar.com)'})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read())
        pages = data.get('query', {}).get('pages', {})
        results = []
        for pid, pinfo in pages.items():
            title = pinfo.get('title', '')
            ii = pinfo.get('imageinfo', [{}])[0]
            iurl = ii.get('url', '')
            w = ii.get('width', 0)
            h = ii.get('height', 0)
            mime = ii.get('mime', '')
            meta = ii.get('extmetadata', {})
            artist = meta.get('Artist', {}).get('value', 'Wikimedia Commons')
            desc = meta.get('ImageDescription', {}).get('value', '')
            lic = meta.get('UsageTerms', {}).get('value', 'Creative Commons')
            
            # Filter high quality photos
            if mime in ['image/jpeg', 'image/png', 'image/webp'] and w >= 1000 and h >= 1000:
                results.append({
                    'title': title,
                    'url': iurl,
                    'width': w,
                    'height': h,
                    'artist': artist,
                    'desc': desc[:100],
                    'license': lic
                })
        return results
    except Exception as e:
        print(f"Error searching {query}: {e}")
        return []

queries = {
    'gulab_jamun': 'Gulab jamun',
    'rasmalai': 'Rasmalai',
    'rasgulla': 'Rasgulla',
    'motichoor': 'Motichoor',
    'mathura_peda': 'Mathura peda OR Pera Vrindavan OR Dharwad peda OR Khoya peda'
}

all_found = {}
for key, q in queries.items():
    res = search_commons(q)
    all_found[key] = res
    print(f"\n=================== {key} ({len(res)} matches) ===================")
    for idx, r in enumerate(res[:6]):
        print(f"[{idx+1}] {r['title']} ({r['width']}x{r['height']})")
        print(f"    URL: {r['url']}")

with open('scripts/sweets_search_results.json', 'w') as f:
    json.dump(all_found, f, indent=2)
print("\nSaved search results to scripts/sweets_search_results.json")
