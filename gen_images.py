from PIL import Image, ImageDraw, ImageFont
import os

products = {
    'suppenkelle': 'WMF Suppenkelle\nLinkshaender',
    'brotmesser': 'Victorinox\nBrotmesser 21cm',
    'kinderschere': 'Maped Vivo\nKinderschere',
    'anspitzer': 'KUM\nAnspitzer',
    'collegeblock': 'Oxford\nCollegeblock A4',
    'bleistift': 'Pelikan Griffix\nBleistift',
    'korkenzieher': 'Kellnermesser\nKorkenzieher',
    'baseballhandschuh': 'Rawlings\nBaseballhandschuh',
    'lineal': 'Wedo Lineal\n30cm',
    'kartoffelschaeler': 'Kartoffel-\nschaeler',
    'fueller': 'ONLINE Switch\nFueller Rosegold',
    'bumerang': 'Bumerang\nClassic',
}

d = r'C:\Users\Shadow\suedpfote\public\products'
os.makedirs(d, exist_ok=True)

for fname, label in products.items():
    img = Image.new('RGB', (600, 600), (245, 245, 245))
    draw = ImageDraw.Draw(img)
    # Draw a simple product silhouette circle
    draw.ellipse([150, 150, 450, 450], fill=(230, 230, 230), outline=(200, 200, 200), width=2)
    # Add text
    try:
        font = ImageFont.truetype("arial.ttf", 28)
        sfont = ImageFont.truetype("arial.ttf", 18)
    except:
        font = ImageFont.load_default()
        sfont = font
    draw.multiline_text((300, 280), label, fill=(60, 60, 60), font=font, anchor='mm', align='center')
    draw.text((300, 520), 'Suedpfote.de', fill=(180, 180, 180), font=sfont, anchor='mm')
    img.save(os.path.join(d, f'{fname}.jpg'), 'JPEG', quality=90)
    print(f'OK: {fname}.jpg')

print('All done!')
