import urllib.request, os, re, ssl, time, json

ctx = ssl.create_default_context()
ctx.check_hostname = False  
ctx.verify_mode = ssl.CERT_NONE
d = r'C:\Users\Shadow\suedpfote\public\products'
H = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', 'Accept-Language': 'de-DE,de;q=0.9'}

def fetch(url):
    try:
        req = urllib.request.Request(url, headers=H)
        with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
            return r.read()
    except Exception as e:
        print(f'  fetch err: {e}')
        return None

def get_google_image(query):
    """Search Google Images and extract first result image URL"""
    q = urllib.request.quote(query)
    url = f'https://www.google.com/search?q={q}&tbm=isch&tbs=ic:white'
    data = fetch(url)
    if not data:
        return None
    html = data.decode('utf-8', errors='ignore')
    # Google embeds base64 thumbnails and also has URLs
    # Look for image URLs in the page
    matches = re.findall(r'\["(https?://[^"]+\.(?:jpg|jpeg|png|webp))",\d+,\d+\]', html)
    for m in matches:
        if 'gstatic' not in m and 'google' not in m and len(m) > 30:
            return m
    # Fallback: data-src or src attributes
    matches = re.findall(r'(?:data-src|src)="(https?://(?:m\.media-amazon|images-na\.ssl-images-amazon|i\.ebayimg|media\.real|cdn\.idealo)[^"]+)"', html)
    if matches:
        return matches[0]
    return None

def save(url, path):
    data = fetch(url)
    if data and len(data) > 2000:
        with open(path, 'wb') as f:
            f.write(data)
        return True
    return False

# Products still needing real images
needed = {
    'anspitzer': 'KUM Linkshänder Anspitzer Dosenspitzer',
    'collegeblock': 'Oxford Collegeblock Linkshänder A4 liniert',
    'bleistift': 'Pelikan Griffix Schreiblernbleistift Linkshänder grün',
    'korkenzieher': 'Kellnermesser Korkenzieher Linkshänder Edelstahl',
    'baseballhandschuh': 'Rawlings Baseball Handschuh Linkshänder braun',
    'lineal': 'Wedo Linkshänder Lineal 30cm transparent',
    'kartoffelschaeler': 'Kartoffelschäler Linkshänder Edelstahl Sparschäler',
    'fueller': 'ONLINE Switch Füller Linkshänder Rosegold',
    'bumerang': 'Bumerang Linkshänder Holz',
}

# Try specific Amazon product pages with better ASINs
better_asins = {
    'anspitzer': ['B003BVI1KK', 'B07VJY67SX', 'B003BVKWME'],
    'collegeblock': ['B07M8CRCYB', 'B07LCNQ39V'],
    'bleistift': ['B003AZ2KBM', 'B005CJJXAA', 'B07CQHSVTF'],
    'korkenzieher': ['B0077OZ6X0', 'B003FDJ88G'],
    'baseballhandschuh': ['B07PLBJ38P', 'B002H4FWS2', 'B07DWSL2KL'],
    'lineal': ['B001Q3L6MO', 'B007JFKXYA'],
    'kartoffelschaeler': ['B0050AC9VO', 'B003BVKXY6', 'B07F6F5K6P'],
    'fueller': ['B07N2YJPZQ', 'B09MQ8GNQY'],
    'bumerang': ['B00B9OPFHK', 'B001U1MPZA'],
}

for name, asins in better_asins.items():
    fp = os.path.join(d, f'{name}.jpg')
    # Check if already has a real image (>50KB means real, placeholder ~10KB)
    if os.path.exists(fp) and os.path.getsize(fp) > 50000:
        print(f'{name}: already have real image')
        continue
    print(f'\n{name}:')
    found = False
    for asin in asins:
        print(f'  Amazon {asin}...')
        data = fetch(f'https://www.amazon.de/dp/{asin}')
        if data:
            html = data.decode('utf-8', errors='ignore')
            for pat in [
                r'"hiRes"\s*:\s*"(https://m\.media-amazon\.com/images/I/[^"]+)"',
                r'"large"\s*:\s*"(https://m\.media-amazon\.com/images/I/[^"]+)"',
                r'data-old-hires="(https://m\.media-amazon\.com/images/I/[^"]+)"',
            ]:
                ms = re.findall(pat, html)
                if ms:
                    img = ms[0].replace('\\u002F', '/')
                    print(f'  Found: {img[:60]}')
                    if save(img, fp):
                        print(f'  OK!')
                        found = True
                        break
            if found:
                break
        time.sleep(0.3)
    
    if not found:
        print(f'  Trying Google Images...')
        img = get_google_image(needed[name])
        if img:
            print(f'  Google: {img[:60]}')
            if save(img, fp):
                print(f'  OK!')
                found = True
    
    if not found:
        print(f'  Still no image')

print('\n\nFinal check:')
for f in os.listdir(d):
    fp = os.path.join(d, f)
    print(f'  {f}: {os.path.getsize(fp)} bytes')
