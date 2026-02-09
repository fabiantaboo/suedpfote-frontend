import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

BASE = 'https://suedpfote-backend.onrender.com'

# Login
login_data = json.dumps({"email": "admin@suedpfote.de", "password": "Suedpfote2026!"}).encode()
req = urllib.request.Request(f'{BASE}/auth/user/emailpass', data=login_data, headers={'Content-Type': 'application/json'})
resp = urllib.request.urlopen(req, context=ctx, timeout=30)
token_data = json.loads(resp.read())
print(f'Login response: {json.dumps(token_data)[:200]}')

# Extract token
token = token_data.get('token') or token_data.get('access_token') or token_data.get('jwt')
if not token:
    # Try nested
    for k, v in token_data.items():
        if isinstance(v, str) and len(v) > 20:
            token = v
            break
print(f'Token: {token[:30] if token else "NOT FOUND"}...')

products = {
    'prod_01KH10B5DX21W45HZ7BT518XE3': '/products/suppenkelle.jpg',
    'prod_01KH10BBXNYQJFDF8BAGTHBSDD': '/products/brotmesser.jpg',
    'prod_01KH10BJ8SBJ6RTNDME3YXKTSH': '/products/kinderschere.jpg',
    'prod_01KH10BRJAXG4C5C11DTGAT1YT': '/products/anspitzer.jpg',
    'prod_01KH10BYW49WRQY2TYWJKW3YXP': '/products/collegeblock.jpg',
    'prod_01KH10C54S7SEBCWQ8KHP9RKCJ': '/products/bleistift.jpg',
    'prod_01KH10CBF0DZYR27M7SYA79M4X': '/products/korkenzieher.jpg',
    'prod_01KH10CHRFQF3KDX992AYH1AYP': '/products/baseballhandschuh.jpg',
    'prod_01KH10CR0WMVZ34607H8C66TT8': '/products/lineal.jpg',
    'prod_01KH10CYBRSQTHMSHB1KA4H6K0': '/products/kartoffelschaeler.jpg',
    'prod_01KH10D4P53YSTMMEAAQ1GNKSJ': '/products/fueller.jpg',
    'prod_01KH10DAYJGS814XP1EYBBQX05': '/products/bumerang.jpg',
}

for pid, thumb in products.items():
    body = json.dumps({"thumbnail": thumb}).encode()
    req = urllib.request.Request(
        f'{BASE}/admin/products/{pid}',
        data=body,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}',
        },
        method='POST'
    )
    try:
        resp = urllib.request.urlopen(req, context=ctx, timeout=30)
        result = json.loads(resp.read())
        name = thumb.split('/')[-1]
        print(f'OK: {name} -> {pid[:30]}...')
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f'ERROR {e.code} for {thumb}: {body[:200]}')

print('\nDone!')
