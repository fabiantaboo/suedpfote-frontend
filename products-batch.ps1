$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rvcl9pZCI6InVzZXJfMDFLR1dCVEVaQTE4VFE2MDBYSkU1NVJQMDUiLCJhY3Rvcl90eXBlIjoidXNlciIsImF1dGhfaWRlbnRpdHlfaWQiOiJhdXRoaWRfMDFLR1dCVEY3TUpLUTFDMVZZMFZHNDFOWDgiLCJhcHBfbWV0YWRhdGEiOnsidXNlcl9pZCI6InVzZXJfMDFLR1dCVEVaQTE4VFE2MDBYSkU1NVJQMDUiLCJyb2xlcyI6W119LCJ1c2VyX21ldGFkYXRhIjp7fSwiaWF0IjoxNzcwNTU0ODIwLCJleHAiOjE3NzA2NDEyMjB9.ByNXSkyT2FdB9F8tgxiOWy_zOR7CwNQLZtbStReB0hw"
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}
$baseUrl = "http://localhost:9000"

# Product 1: Bleistift
$body1 = @{
    title = "STABILO EASYgraph Bleistift für Linkshänder"
    subtitle = "Ergonomischer Dreikant-Bleistift mit rutschfesten Griffmulden"
    handle = "stabilo-easygraph-bleistift-linkshaender"
    is_giftcard = $false
    discountable = $true
    thumbnail = "/products/bleistift.jpg"
    description = "Speziell für Linkshänder entwickelt. Dreikant-Form, rutschfeste Griffmulden, weiche HB-Mine."
    options = @(@{title = "Variante"; values = @("Standard")})
} | ConvertTo-Json -Depth 5
Write-Host "Creating Bleistift..."
$r1 = Invoke-RestMethod -Uri "$baseUrl/admin/products" -Method Post -Headers $headers -Body $body1
Write-Host "Bleistift created: $($r1.product.id)"

# Product 2: Füller
$body2 = @{
    title = "Pelikan Twist Füller für Linkshänder"
    subtitle = "Ergonomischer Schulfüller mit drehbarer Kappe"
    handle = "pelikan-fueller-linkshaender"
    is_giftcard = $false
    discountable = $true
    thumbnail = "/products/fueller.jpg"
    description = "Der Pelikan Twist ist perfekt für Linkshänder. Ergonomische Griffzone, austauschbare Patronen."
    options = @(@{title = "Variante"; values = @("Standard")})
} | ConvertTo-Json -Depth 5
Write-Host "Creating Füller..."
$r2 = Invoke-RestMethod -Uri "$baseUrl/admin/products" -Method Post -Headers $headers -Body $body2
Write-Host "Füller created: $($r2.product.id)"

# Product 3: Lineal
$body3 = @{
    title = "KUM Lineal 30cm für Linkshänder"
    subtitle = "Lineal mit Skala von rechts nach links"
    handle = "lineal-linkshaender"
    is_giftcard = $false
    discountable = $true
    thumbnail = "/products/lineal.jpg"
    description = "Endlich ein Lineal für Linkshänder! Die Skala läuft von rechts nach links."
    options = @(@{title = "Variante"; values = @("Standard")})
} | ConvertTo-Json -Depth 5
Write-Host "Creating Lineal..."
$r3 = Invoke-RestMethod -Uri "$baseUrl/admin/products" -Method Post -Headers $headers -Body $body3
Write-Host "Lineal created: $($r3.product.id)"

# Product 4: Sparschäler
$body4 = @{
    title = "Westmark Sparschäler für Linkshänder"
    subtitle = "Ergonomischer Gemüseschäler mit Linkshänder-Klinge"
    handle = "sparschaeler-linkshaender"
    is_giftcard = $false
    discountable = $true
    thumbnail = "/products/schaeler.jpg"
    description = "Der Westmark Sparschäler für Linkshänder. Die Klinge ist spiegelverkehrt für natürliche Bewegung."
    options = @(@{title = "Variante"; values = @("Standard")})
} | ConvertTo-Json -Depth 5
Write-Host "Creating Sparschäler..."
$r4 = Invoke-RestMethod -Uri "$baseUrl/admin/products" -Method Post -Headers $headers -Body $body4
Write-Host "Sparschäler created: $($r4.product.id)"

# Product 5: Dosenöffner
$body5 = @{
    title = "Zangen-Dosenöffner für Linkshänder"
    subtitle = "Einfaches Öffnen mit der linken Hand"
    handle = "dosenoeffner-linkshaender"
    is_giftcard = $false
    discountable = $true
    thumbnail = "/products/dosenoeffner.jpg"
    description = "Endlich ein Dosenöffner für Linkshänder! Ergonomischer Griff, scharfe Klinge."
    options = @(@{title = "Variante"; values = @("Standard")})
} | ConvertTo-Json -Depth 5
Write-Host "Creating Dosenöffner..."
$r5 = Invoke-RestMethod -Uri "$baseUrl/admin/products" -Method Post -Headers $headers -Body $body5
Write-Host "Dosenöffner created: $($r5.product.id)"

# Product 6: Taschenmesser
$body6 = @{
    title = "Victorinox Taschenmesser für Linkshänder"
    subtitle = "Schweizer Qualität für die linke Hand"
    handle = "victorinox-taschenmesser-linkshaender"
    is_giftcard = $false
    discountable = $true
    thumbnail = "/products/taschenmesser.jpg"
    description = "Das legendäre Schweizer Taschenmesser - jetzt auch für Linkshänder. Alle Werkzeuge spiegelverkehrt."
    options = @(@{title = "Variante"; values = @("Standard")})
} | ConvertTo-Json -Depth 5
Write-Host "Creating Taschenmesser..."
$r6 = Invoke-RestMethod -Uri "$baseUrl/admin/products" -Method Post -Headers $headers -Body $body6
Write-Host "Taschenmesser created: $($r6.product.id)"

Write-Host "`nAlle 6 Produkte erstellt!"
