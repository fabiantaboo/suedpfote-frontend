import urllib.request
import os
import json
import re
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

d = r'C:\Users\Shadow\suedpfote\public\products'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

# Try to get images from known product pages
searches = {
    'suppenkelle': 'https://www.amazon.de/dp/B00008XWZ3',
    'brotmesser': 'https://www.amazon.de/s?k=Victorinox+Linksh%C3%A4nder+Brotmesser',
    'kinderschere': 'https://www.amazon.de/s?k=Maped+Vivo+Linksh%C3%A4nder+Kinderschere',
    'anspitzer': 'https://www.amazon.de/s?k=KUM+Linksh%C3%A4nder+Anspitzer',
    'collegeblock': 'https://www.amazon.de/s?k=Oxford+Collegeblock+Linksh%C3%A4nder',
    'bleistift': 'https://www.amazon.de/s?k=Pelikan+Griffix+Linksh%C3%A4nder+Bleistift',
    'korkenzieher': 'https://www.amazon.de/s?k=Linksh%C3%A4nder+Korkenzieher+Kellnermesser',
    'baseballhandschuh': 'https://www.amazon.de/s?k=Rawlings+Baseballhandschuh+Links',
    'lineal': 'https://www.amazon.de/s?k=Wedo+Linksh%C3%A4nder+Lineal',
    'kartoffelschaeler': 'https://www.amazon.de/s?k=Linksh%C3%A4nder+Kartoffelsch%C3%A4ler',
    'fueller': 'https://www.amazon.de/s?k=ONLINE+Switch+Linksh%C3%A4nder+F%C3%BCller',
    'bumerang': 'https://www.amazon.de/s?k=Linksh%C3%A4nder+Bumerang',
}

def download_image(url, filepath):
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = resp.read()
            if len(data) > 1000:
                with open(filepath, 'wb') as f:
                    f.write(data)
                return True
    except Exception as e:
        print(f'  Error downloading: {e}')
    return False

def extract_amazon_images(html):
    # Look for high-res image URLs in Amazon pages
    patterns = [
        r'"hiRes":"(https://m\.media-amazon\.com/images/I/[^"]+)"',
        r'"large":"(https://m\.media-amazon\.com/images/I/[^"]+)"',
        r'src="(https://m\.media-amazon\.com/images/I/[^"]+\._AC_SL1[0-9]+_\.jpg)"',
        r'src="(https://m\.media-amazon\.com/images/I/[^"]+\._AC_SX[0-9]+_\.jpg)"',
        r'(https://m\.media-amazon\.com/images/I/[A-Za-z0-9+%-]+\._AC_SL\d+_\.jpg)',
    ]
    for pat in patterns:
        matches = re.findall(pat, html)
        if matches:
            return matches[0]
    # Fallback: any amazon image
    matches = re.findall(r'(https://m\.media-amazon\.com/images/I/[A-Za-z0-9+%-]+\.jpg)', html)
    if matches:
        # Pick largest looking one
        for m in matches:
            if 'sprite' not in m.lower() and 'icon' not in m.lower():
                return m
    return None

for name, url in searches.items():
    print(f'Fetching {name}...')
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
        img_url = extract_amazon_images(html)
        if img_url:
            # Make it high-res
            img_url = re.sub(r'\._AC_S[XL]\d+_', '._AC_SL500_', img_url)
            print(f'  Found: {img_url[:80]}...')
            filepath = os.path.join(d, f'{name}.jpg')
            if download_image(img_url, filepath):
                print(f'  Downloaded: {name}.jpg')
            else:
                print(f'  Download failed, keeping placeholder')
        else:
            print(f'  No image found, keeping placeholder')
    except Exception as e:
        print(f'  Error: {e}')

print('\nDone!')
