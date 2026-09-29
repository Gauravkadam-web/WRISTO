Add-Type -AssemblyName System.Drawing

$img1 = [System.Drawing.Bitmap]::FromFile((Resolve-Path "docs\40_images_watches.png").Path)
$img2 = [System.Drawing.Bitmap]::FromFile((Resolve-Path "docs\40_images_2.png").Path)

if (-not (Test-Path "assets\test")) {
    New-Item -ItemType Directory -Path "assets\test" -Force | Out-Null
}

# Test 40_images_watches.png (8 cols x 5 rows)
# Let's test top-bar height: 35px or 40px
$top1 = 36
$cellW1 = 1536 / 8 # 192
$cellH1 = (1024 - $top1) / 5 # 197.6

for ($i = 0; $i -lt 3; $i++) {
    $x = [int]($i * $cellW1)
    $y = [int]($top1)
    $w = [int]$cellW1
    $h = [int]$cellH1
    
    # Full cell
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $crop = $img1.Clone($rect, $img1.PixelFormat)
    $crop.Save("assets\test\watch_grid1_cell_$($i+1).png", [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
    
    # Watch body only (top ~75% of cell, excluding SKU/price text at bottom)
    $hWatch = [int]($cellH1 * 0.72)
    $rectWatch = New-Object System.Drawing.Rectangle($x, $y, $w, $hWatch)
    $cropWatch = $img1.Clone($rectWatch, $img1.PixelFormat)
    $cropWatch.Save("assets\test\watch_grid1_clean_$($i+1).png", [System.Drawing.Imaging.ImageFormat]::Png)
    $cropWatch.Dispose()
}

# Test 40_images_2.png (10 cols x 4 rows)
$top2 = 50
$cellW2 = 1536 / 10 # 153.6
$cellH2 = (1024 - $top2) / 4 # 243.5

for ($i = 0; $i -lt 3; $i++) {
    $x = [int]($i * $cellW2)
    $y = [int]($top2)
    $w = [int]$cellW2
    $h = [int]$cellH2
    
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $crop = $img2.Clone($rect, $img2.PixelFormat)
    $crop.Save("assets\test\watch_grid2_cell_$($i+1).png", [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
    
    # Watch body only in grid2
    $hWatch2 = [int]($cellH2 * 0.75)
    $rectWatch2 = New-Object System.Drawing.Rectangle($x, $y, $w, $hWatch2)
    $cropWatch2 = $img2.Clone($rectWatch2, $img2.PixelFormat)
    $cropWatch2.Save("assets\test\watch_grid2_clean_$($i+1).png", [System.Drawing.Imaging.ImageFormat]::Png)
    $cropWatch2.Dispose()
}

$img1.Dispose()
$img2.Dispose()
Write-Host "Test crops generated successfully!"
