Add-Type -AssemblyName System.Drawing

# 1. Extract pure hero watch from desktop-hero-banner.png
$heroBanner = [System.Drawing.Bitmap]::FromFile((Resolve-Path "assets\banners\desktop-hero-banner.png").Path)
# Watch is on right side
$rectWatch = New-Object System.Drawing.Rectangle(200, 30, 270, 280)
$cropWatch = $heroBanner.Clone($rectWatch, $heroBanner.PixelFormat)
$cropWatch.Save("assets\brand\hero-watch-focal.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropWatch.Dispose()
$heroBanner.Dispose()

# 2. Extract 4 occasion cards from occasions-panel.png
# Total dimensions of occasions-panel.png
$occPanel = [System.Drawing.Bitmap]::FromFile((Resolve-Path "assets\occasions\occasions-panel.png").Path)
# The 4 cards are side-by-side on the right:
# In the 475px width, the left ~150px is text "For Every Occasion", then 4 cards:
# Formal, Casual, Sports, Luxury
# Let's inspect where cards start: around x = 160
$cardW = 75
$cardH = 220
$cardY = 15
$occNames = @("formal", "casual", "sports", "luxury")

for ($j = 0; $j -lt 4; $j++) {
    $cardX = 160 + ($j * 78)
    if ($cardX + $cardW -le $occPanel.Width) {
        $rCard = New-Object System.Drawing.Rectangle($cardX, $cardY, $cardW, $cardH)
        $cropCard = $occPanel.Clone($rCard, $occPanel.PixelFormat)
        $cropCard.Save("assets\occasions\occasion-$($occNames[$j]).png", [System.Drawing.Imaging.ImageFormat]::Png)
        $cropCard.Dispose()
    }
}
$occPanel.Dispose()

Write-Host "Extracted hero focal watch and occasions!"
