
$braveKey = "BSAnFE3D7Dl944BC18xfZBHu7wb7Y6O"
$productsDir = "C:\Users\Shadow\suedpfote\public\products"
$lines = Get-Content "C:\Users\Shadow\suedpfote\broken-images.txt" | Where-Object { $_ -match '\|' }

$count = 0
$success = 0
$failed = @()

foreach ($line in $lines) {
    $parts = $line.Split('|')
    $handle = $parts[0].Trim()
    $title = $parts[1].Trim()
    $outPath = Join-Path $productsDir "$handle.jpg"
    
    # Skip if already exists and > 5KB
    if ((Test-Path $outPath) -and (Get-Item $outPath).Length -gt 5120) {
        Write-Host "SKIP: $handle (already good)"
        continue
    }
    
    $count++
    Write-Host "`n[$count] Searching: $title"
    
    # Search Brave for image
    $query = [System.Uri]::EscapeDataString("$title produktbild")
    $searchUrl = "https://api.search.brave.com/res/v1/images/search?q=$query&count=5&safesearch=off"
    
    try {
        $headers = @{"X-Subscription-Token" = $braveKey; "Accept" = "application/json"}
        $resp = Invoke-RestMethod -Uri $searchUrl -Headers $headers -TimeoutSec 15
        
        $downloaded = $false
        foreach ($result in $resp.results) {
            $imgUrl = $result.properties.url
            if (-not $imgUrl) { $imgUrl = $result.thumbnail.src }
            if (-not $imgUrl) { continue }
            
            Write-Host "  Trying: $imgUrl"
            try {
                # Download image
                $tempPath = "$outPath.tmp"
                Invoke-WebRequest -Uri $imgUrl -OutFile $tempPath -TimeoutSec 15 -Headers @{"User-Agent"="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
                
                $fileSize = (Get-Item $tempPath).Length
                if ($fileSize -gt 5120) {
                    Move-Item $tempPath $outPath -Force
                    Write-Host "  SUCCESS: $handle ($fileSize bytes)"
                    $success++
                    $downloaded = $true
                    break
                } else {
                    Remove-Item $tempPath -Force
                    Write-Host "  Too small: $fileSize bytes"
                }
            } catch {
                Write-Host "  Download failed: $_"
                if (Test-Path "$outPath.tmp") { Remove-Item "$outPath.tmp" -Force }
            }
        }
        
        if (-not $downloaded) {
            # Try with different search query
            $query2 = [System.Uri]::EscapeDataString("$title Amazon")
            $searchUrl2 = "https://api.search.brave.com/res/v1/images/search?q=$query2&count=5"
            Start-Sleep -Seconds 1
            
            try {
                $resp2 = Invoke-RestMethod -Uri $searchUrl2 -Headers $headers -TimeoutSec 15
                foreach ($result in $resp2.results) {
                    $imgUrl = $result.properties.url
                    if (-not $imgUrl) { $imgUrl = $result.thumbnail.src }
                    if (-not $imgUrl) { continue }
                    
                    try {
                        $tempPath = "$outPath.tmp"
                        Invoke-WebRequest -Uri $imgUrl -OutFile $tempPath -TimeoutSec 15 -Headers @{"User-Agent"="Mozilla/5.0"}
                        $fileSize = (Get-Item $tempPath).Length
                        if ($fileSize -gt 5120) {
                            Move-Item $tempPath $outPath -Force
                            Write-Host "  SUCCESS (2nd try): $handle ($fileSize bytes)"
                            $success++
                            $downloaded = $true
                            break
                        } else {
                            Remove-Item $tempPath -Force
                        }
                    } catch {
                        if (Test-Path "$outPath.tmp") { Remove-Item "$outPath.tmp" -Force }
                    }
                }
            } catch {}
        }
        
        if (-not $downloaded) {
            $failed += $handle
            Write-Host "  FAILED: $handle"
        }
    } catch {
        Write-Host "  Search error: $_"
        $failed += $handle
    }
    
    # Rate limit: 1 req/sec for Brave free plan
    Start-Sleep -Seconds 1.1
}

Write-Host "`n=== SUMMARY ==="
Write-Host "Processed: $count"
Write-Host "Success: $success"
Write-Host "Failed: $($failed.Count)"
if ($failed.Count -gt 0) {
    Write-Host "`nFailed handles:"
    $failed | ForEach-Object { Write-Host "  $_" }
    $failed | Out-File "C:\Users\Shadow\suedpfote\failed-images.txt" -Encoding utf8
}
