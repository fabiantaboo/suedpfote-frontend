
# Step 1: Get admin token
$authBody = @{email="admin@suedpfote.de";password="Suedpfote2026!"} | ConvertTo-Json
$authResp = Invoke-RestMethod -Uri "https://suedpfote-backend.onrender.com/auth/user/emailpass" -Method POST -ContentType "application/json" -Body $authBody
$token = $authResp.token
Write-Host "Token: $token"

# Step 2: Get all products
$headers = @{Authorization="Bearer $token"}
$products = Invoke-RestMethod -Uri "https://suedpfote-backend.onrender.com/admin/products?limit=200" -Headers $headers
Write-Host "Products count: $($products.products.Count)"

# Step 3: Find broken images (284 bytes or missing)
$productsDir = "C:\Users\Shadow\suedpfote\public\products"
$broken = @()

foreach ($p in $products.products) {
    $handle = $p.handle
    $title = $p.title
    $imgPath = Join-Path $productsDir "$handle.jpg"
    
    if (-not (Test-Path $imgPath)) {
        $broken += @{handle=$handle; title=$title; reason="missing"}
    } elseif ((Get-Item $imgPath).Length -lt 1024) {
        $broken += @{handle=$handle; title=$title; reason="placeholder"; size=(Get-Item $imgPath).Length}
    }
}

Write-Host "`nBroken images: $($broken.Count)"
foreach ($b in $broken) {
    Write-Host "$($b.handle) | $($b.title) | $($b.reason)"
}

# Save broken list for processing
$broken | ForEach-Object { "$($_.handle)|$($_.title)" } | Out-File "C:\Users\Shadow\suedpfote\broken-images.txt" -Encoding utf8
