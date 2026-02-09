$dir = "C:\Users\Shadow\suedpfote\public\products"
if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force }

# Direct image URLs from various free sources - product photos
$images = @{
    "suppenkelle" = "https://m.media-amazon.com/images/I/31qG+cXbPnL._AC_.jpg"
    "brotmesser" = "https://m.media-amazon.com/images/I/21Fm4vJESQL._AC_.jpg"
    "kinderschere" = "https://m.media-amazon.com/images/I/41HxqGjVURL._AC_.jpg"
    "anspitzer" = "https://m.media-amazon.com/images/I/41CqFvEkURL._AC_.jpg"
    "collegeblock" = "https://m.media-amazon.com/images/I/61sIb0MDelL._AC_.jpg"
    "bleistift" = "https://m.media-amazon.com/images/I/41kqSxvRURL._AC_.jpg"
    "korkenzieher" = "https://m.media-amazon.com/images/I/41V1zN7kURL._AC_.jpg"
    "baseballhandschuh" = "https://m.media-amazon.com/images/I/81qGpbXGURL._AC_.jpg"
    "lineal" = "https://m.media-amazon.com/images/I/31PqGxvRURL._AC_.jpg"
    "kartoffelschaeler" = "https://m.media-amazon.com/images/I/31qGxvPnURL._AC_.jpg"
    "fueller" = "https://m.media-amazon.com/images/I/41FmGxvESQL._AC_.jpg"
    "bumerang" = "https://m.media-amazon.com/images/I/41BqGxvRURL._AC_.jpg"
}

# These are placeholder URLs - let's use a different approach: search and download
# Use Python to generate simple colored placeholder images instead, then we can replace later

Write-Host "Generating placeholder product images with Python..."

python -c @"
from PIL import Image, ImageDraw, ImageFont
import os

products = {
    'suppenkelle': ('WMF Suppenkelle', (220, 220, 220)),
    'brotmesser': ('Victorinox Brotmesser', (230, 225, 215)),
    'kinderschere': ('Maped Kinderschere', (200, 230, 200)),
    'anspitzer': ('KUM Anspitzer', (215, 215, 235)),
    'collegeblock': ('Oxford Collegeblock', (235, 235, 210)),
    'bleistift': ('Pelikan Griffix', (210, 235, 230)),
    'korkenzieher': ('Korkenzieher', (235, 215, 210)),
    'baseballhandschuh': ('Rawlings Handschuh', (225, 220, 210)),
    'lineal': ('Wedo Lineal', (210, 225, 235)),
    'kartoffelschaeler': ('Kartoffelschaeler', (220, 230, 215)),
    'fueller': ('ONLINE Fueller', (230, 215, 225)),
    'bumerang': ('Bumerang Classic', (215, 230, 220)),
}

d = r'C:\Users\Shadow\suedpfote\public\products'
for fname, (label, color) in products.items():
    img = Image.new('RGB', (400, 400), color)
    draw = ImageDraw.Draw(img)
    draw.text((200, 180), label, fill=(80, 80, 80), anchor='mm')
    draw.text((200, 220), 'Linkshander', fill=(120, 120, 120), anchor='mm')
    img.save(os.path.join(d, f'{fname}.jpg'), 'JPEG', quality=90)
    print(f'Created {fname}.jpg')
"@

Write-Host "Done!"
