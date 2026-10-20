import urllib.request
import urllib.parse
import json

def search(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'DesiDharApp/1.0 (https://desidhar.com; contact@desidhar.com)'})
    with urllib.request.urlopen(req) as r:
        d = json.loads(r.read())
    pages = d.get('query', {}).get('pages', {})
    for pid, p in pages.items():
        ii = p.get('imageinfo', [{}])[0]
        if ii.get('width', 0) >= 1000 and ii.get('mime') in ['image/jpeg', 'image/png']:
            print(f"{p.get('title')} ({ii.get('width')}x{ii.get('height')}) -> {ii.get('url')}")

print("=== Mango yogurt ===")
search("Mango yogurt dessert OR Mango mousse yogurt OR Mango parfait yogurt OR Mango shrikhand")
