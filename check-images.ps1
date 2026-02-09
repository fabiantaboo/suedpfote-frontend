$files = Get-ChildItem 'C:\Users\Shadow\suedpfote\public\products\*.jpg'
$good = ($files | Where-Object { $_.Length -gt 5000 }).Count
$bad = $files | Where-Object { $_.Length -le 5000 }
Write-Host "Total: $($files.Count), Good: $good, Bad: $($bad.Count)"
if ($bad.Count -gt 0) {
    $bad | ForEach-Object { Write-Host "  $($_.Name) = $($_.Length) bytes" }
}
