Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path "docs\40_images_2.png").Path)

Write-Host "Image size: $($img.Width) x $($img.Height)"

# Let's sample a vertical line at x = 70 (middle of first column)
# and print colors or brightness from y = 0 to 1024
for ($y = 0; $y -lt $img.Height; $y += 5) {
    $col = $img.GetPixel(70, $y)
    # If the pixel is close to black or dark header vs white card
    if ($y % 20 -eq 0) {
        Write-Host "y=$y R=$($col.R) G=$($col.G) B=$($col.B)"
    }
}

$img.Dispose()
