Add-Type -AssemblyName System.Drawing
$b = [System.Drawing.Bitmap]::new("e:\WRISTO\assets\banners\banner-modern-looks.png")
Write-Output "Size: $($b.Width) x $($b.Height)"
for ($y = 0; $y -lt 60; $y += 4) {
    $p = $b.GetPixel(10, $y)
    Write-Output "y=$($y) R=$($p.R) G=$($p.G) B=$($p.B)"
}
$b.Dispose()
