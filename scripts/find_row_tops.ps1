Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path "docs\40_images_2.png").Path)

# Let's check col 0 from y=0 to 1024 to find the exact y where each row's photo background begins.
# The card has a thin border or background change.
for ($r = 0; $r -lt 4; $r++) {
    $searchStartY = 45 + $r * 240
    Write-Host "--- Scanning around y=$searchStartY ---"
    for ($y = $searchStartY; $y -lt ($searchStartY + 40); $y += 2) {
        $c = $img.GetPixel(30, $y)
        Write-Host "y=$y : R=$($c.R) G=$($c.G) B=$($c.B)"
    }
}

$img.Dispose()
