Add-Type -AssemblyName System.Drawing

$img2 = [System.Drawing.Bitmap]::FromFile((Resolve-Path "docs\40_images_2.png").Path)

$top = 50
$cellW = 1536 / 10 # 153.6
$cellH = (1024 - $top) / 4 # 243.5

# We want the watch image part.
# Let's inspect height: 160px from top of cell.
$indices = @(0, 4, 12, 24, 31, 36)

foreach ($idx in $indices) {
    $row = [Math]::Floor($idx / 10)
    $col = $idx % 10
    
    $x = [int]($col * $cellW)
    $y = [int]($top + $row * $cellH)
    $w = [int]$cellW
    $h = 162 # Just the photo
    
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $crop = $img2.Clone($rect, $img2.PixelFormat)
    $crop.Save("assets\test\pure_watch_$($idx+1).png", [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
}

$img2.Dispose()
Write-Host "Pure watch test crops created!"
