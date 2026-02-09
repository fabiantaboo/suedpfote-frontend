$braveKey = "BSAnFE3D7Dl944BC18xfZBHu7wb7Y6O"
$productsDir = "C:\Users\Shadow\suedpfote\public\products"
$items = @(
    @{handle="brotmesser"; query="Brotmesser Linkshänder Edelstahl"},
    @{handle="suppenkelle"; query="Suppenkelle Edelstahl Küche"}
)

foreach ($item in $items) {
    $outPath = Join-Path $productsDir "$($item.handle).jpg"
    $query = [System.Uri]::EscapeDataString("$($item.query) produktbild")
    $searchUrl = "https://api.search.brave.com/res/v1/images/search?q=$query&count=5"
    $headers = @{"X-Subscription-Token" = $braveKey; "Accept" = "application/json"}
    
    $resp = Invoke-RestMethod -Uri $searchUrl -Headers $headers -TimeoutSec 15
    foreach ($result in $resp.results) {
        $imgUrl = $result.properties.url
        if (-not $imgUrl) { $imgUrl = $result.thumbnail.src }
        if (-not $imgUrl) { continue }
        
        try {
            $tempPath = "$outPath.tmp"
            Invoke-WebRequest -Uri $imgUrl -OutFile $tempPath -TimeoutSec 15 -Headers @{"User-Agent"="Mozilla/5.0"}
            if ((Get-Item $tempPath).Length -gt 5000) {
                Move-Item $tempPath $outPath -Force
                Write-Host "Fixed: $($item.handle) ($((Get-Item $outPath).Length) bytes)"
                break
            } else {
                Remove-Item $tempPath -Force
            }
        } catch {
            if (Test-Path "$outPath.tmp") { Remove-Item "$outPath.tmp" -Force }
        }
    }
    Start-Sleep -Seconds 1.1
}
