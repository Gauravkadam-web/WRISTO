Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path "docs\40_images_2.png").Path)

$rowStarts = @(51, 295, 547, 795)
$photoHeight = 158
$colWidth = 153.6

$testIndices = @(0, 5, 10, 15, 20, 25, 30, 31, 35, 39)

foreach ($idx in $testIndices) {
    $r = [Math]::Floor($idx / 10)
    $c = $idx % 10
    
    $x = [int][Math]::Round($c * $colWidth)
    $y = $rowStarts[$r]
    $w = [int][Math]::Round($colWidth)
    $h = $photoHeight
    
    if ($x + $w -gt $img.Width) { $w = $img.Width - $x }
    if ($y + $h -gt $img.Height) { $h = $img.Height - $y }
    
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $crop = $img.Clone($rect, $img.PixelFormat)
    $crop.Save("assets\test\perfect_watch_$($idx+1).png", [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
}

$img.Dispose()
Write-Host "Perfect test crops saved!"
