import urllib.request, time, subprocess, json

opener = urllib.request.build_opener()
opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')]
urllib.request.install_opener(opener)

# Already found URLs
images = {
    'suppenkelle.jpg': 'https://m.media-amazon.com/images/I/51h2-yEtwwL._AC_UL320_.jpg',
    'brotmesser.jpg': 'https://m.media-amazon.com/images/I/517W3dHkwgL._AC_UL320_.jpg',
    'kinderschere.jpg': 'https://m.media-amazon.com/images/I/51ByLGC6M5L._AC_UL320_.jpg',
}

import os
out = r'C:\Users\Shadow\suedpfote\public\products'
for name, url in images.items():
    path = os.path.join(out, name)
    try:
        urllib.request.urlretrieve(url, path)
        print(f'OK: {name} ({os.path.getsize(path)} bytes)')
    except Exception as e:
        print(f'FAIL: {name}: {e}')
