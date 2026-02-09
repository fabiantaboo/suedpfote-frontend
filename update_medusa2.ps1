$base = "https://suedpfote-backend.onrender.com"

Write-Host "Waking up backend..."
try {
    $health = Invoke-WebRequest -Uri "$base/health" -TimeoutSec 120 -UseBasicParsing
    Write-Host "Backend is up: $($health.StatusCode)"
} catch {
    Write-Host "Health check error: $($_.Exception.Message)"
    Write-Host "Trying login anyway..."
}

Write-Host "Logging in..."
$loginBody = '{"email":"admin@suedpfote.de","password":"Suedpfote2026!"}'
try {
    $loginResp = Invoke-RestMethod -Uri "$base/auth/user/emailpass" -Method POST -Body $loginBody -ContentType "application/json" -TimeoutSec 60
    Write-Host "Login response:"
    $loginResp | ConvertTo-Json -Depth 3 | Write-Host
    $token = $loginResp.token
    if (-not $token) { $token = $loginResp.access_token }
    if (-not $token) { $token = $loginResp.jwt }
    Write-Host "Token: $($token.Substring(0,30))..."
} catch {
    Write-Host "Login failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response: $($reader.ReadToEnd())"
    }
    exit 1
}

$products = @{
    "prod_01KH10B5DX21W45HZ7BT518XE3" = "/products/suppenkelle.jpg"
    "prod_01KH10BBXNYQJFDF8BAGTHBSDD" = "/products/brotmesser.jpg"
    "prod_01KH10BJ8SBJ6RTNDME3YXKTSH" = "/products/kinderschere.jpg"
    "prod_01KH10BRJAXG4C5C11DTGAT1YT" = "/products/anspitzer.jpg"
    "prod_01KH10BYW49WRQY2TYWJKW3YXP" = "/products/collegeblock.jpg"
    "prod_01KH10C54S7SEBCWQ8KHP9RKCJ" = "/products/bleistift.jpg"
    "prod_01KH10CBF0DZYR27M7SYA79M4X" = "/products/korkenzieher.jpg"
    "prod_01KH10CHRFQF3KDX992AYH1AYP" = "/products/baseballhandschuh.jpg"
    "prod_01KH10CR0WMVZ34607H8C66TT8" = "/products/lineal.jpg"
    "prod_01KH10CYBRSQTHMSHB1KA4H6K0" = "/products/kartoffelschaeler.jpg"
    "prod_01KH10D4P53YSTMMEAAQ1GNKSJ" = "/products/fueller.jpg"
    "prod_01KH10DAYJGS814XP1EYBBQX05" = "/products/bumerang.jpg"
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

foreach ($prodId in $products.Keys) {
    $thumb = $products[$prodId]
    $body = "{`"thumbnail`":`"$thumb`"}"
    $name = $thumb.Split("/")[-1]
    try {
        $resp = Invoke-RestMethod -Uri "$base/admin/products/$prodId" -Method POST -Body $body -Headers $headers -TimeoutSec 30
        Write-Host "OK: $name"
    } catch {
        Write-Host "ERROR for $name : $($_.Exception.Message)"
        if ($_.Exception.Response) {
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                Write-Host "  Body: $($reader.ReadToEnd().Substring(0,200))"
            } catch {}
        }
    }
}

Write-Host "`nDone!"
