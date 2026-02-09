import urllib.request
import os
import re
import ssl
import time
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

d = r'C:\Users\Shadow\suedpfote\public\products'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

# Direct Amazon product ASINs where possible
direct_products = {
    'brotmesser': ['B000IAZC4Q', 'B07YZWF6DS'],  # Victorinox bread knife
    'kinderschere': ['B000KJR6MO', 'B001BKHHGS'],  # Maped scissors
    'anspitzer': ['B000KJMUKY', 'B001G7R1RW'],  # KUM sharpener
    'collegeblock': ['B07BRGGB3M'],  # Oxford left-hand
    'bleistift': ['B004L6MUKY', 'B00BXWUHB6'],  # Pelikan Griffix
    'korkenzieher': ['B001E5BQTK'],  # corkscrew
    'baseballhandschuh': ['B0002LY6AO', 'B07K1QWFNY'],  # Rawlings
    'lineal': ['B004L6MUKY'],  # Wedo
    'kartoffelschaeler': ['B000SE5GY4'],  # peeler
    'fueller': ['B07MZKHG1J', 'B07YZK2SJW'],  # ONLINE Switch
    'bumerang': ['B001DXJL3S'],  # boomerang
}

def fetch_page(url):
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except:
        return None

def extract_main_image(html):
    if not html:
        return None
    patterns = [
        r'"hiRes"\s*:\s*"(https://m\.media-amazon\.com/images/I/[^"]+)"',
        r'"large"\s*:\s*"(https://m\.media-amazon\.com/images/I/[^"]+)"',
        r'"mainUrl"\s*:\s*"(https://m\.media-amazon\.com/images/I/[^"]+)"',
        r'data-old-hires="(https://m\.media-amazon\.com/images/I/[^"]+)"',
        r'id="landingImage"[^>]*src="(https://m\.media-amazon\.com/images/I/[^"]+)"',
        r'(https://m\.media-amazon\.com/images/I/[A-Za-z0-9+%-]+\._AC_SL\d+_\.jpg)',
    ]
    for pat in patterns:
        matches = re.findall(pat, html)
        if matches:
            url = matches[0].replace('\\u002F', '/')
            return url
    return None

def download(url, path):
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = resp.read()
            if len(data) > 2000:
                with open(path, 'wb') as f:
                    f.write(data)
                return True
    except Exception as e:
        print(f'  DL error: {e}')
    return False

for name, asins in direct_products.items():
    filepath = os.path.join(d, f'{name}.jpg')
    print(f'\n{name}:')
    found = False
    for asin in asins:
        url = f'https://www.amazon.de/dp/{asin}'
        print(f'  Trying {asin}...')
        html = fetch_page(url)
        img = extract_main_image(html)
        if img:
            print(f'  Image: {img[:70]}')
            if download(img, filepath):
                print(f'  OK!')
                found = True
                break
        time.sleep(0.5)
    if not found:
        print(f'  No image found')

# Also try some product pages from other shops
other_sources = {
    'kinderschere': 'https://www.schreibwaren-shop.de/maped-vivo-linkshander-schere',
    'anspitzer': 'https://www.lafueliki.de/kum-linkshander-anspitzer',
    'fueller': 'https://www.online-pen.de/switch-starter-set-left',
}

print('\n\nDone!')
