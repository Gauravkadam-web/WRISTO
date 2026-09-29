Add-Type -AssemblyName System.Drawing

# Create output directories
$dirs = @(
    "assets\products",
    "assets\brand",
    "assets\banners",
    "assets\occasions",
    "assets\blog"
)
foreach ($d in $dirs) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
    }
}

# 1. EXTRACT 40 WATCH PRODUCTS from 40_images_2.png
$catalogImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "docs\40_images_2.png").Path)

$rowStarts = @(51, 295, 547, 795)
$photoHeight = 150 # Clean crop avoiding text at bottom
$colWidth = 153.6

for ($i = 0; $i -lt 40; $i++) {
    $r = [Math]::Floor($i / 10)
    $c = $i % 10
    
    $x = [int][Math]::Round($c * $colWidth)
    $y = $rowStarts[$r]
    $w = [int][Math]::Round($colWidth)
    $h = $photoHeight
    
    if ($x + $w -gt $catalogImg.Width) { $w = $catalogImg.Width - $x }
    if ($y + $h -gt $catalogImg.Height) { $h = $catalogImg.Height - $y }
    
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $crop = $catalogImg.Clone($rect, $catalogImg.PixelFormat)
    
    $watchNum = ($i + 1).ToString("D2")
    $outPath = "assets\products\watch-$watchNum.png"
    $crop.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
}
$catalogImg.Dispose()
Write-Host "Extracted all 40 watch product images!"

# 2. EXTRACT BRAND ASSETS from ChatGPT Image Sep 28, 2026, 10_32_53 PM.png (1536 x 1024)
$brandImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "docs\ChatGPT Image Sep 28, 2026, 10_32_53 PM.png").Path)

# Dark Logo on Ivory (x=90, y=60, w=570, h=330)
$rectLogoDark = New-Object System.Drawing.Rectangle(80, 50, 600, 360)
$cropLogoDark = $brandImg.Clone($rectLogoDark, $brandImg.PixelFormat)
$cropLogoDark.Save("assets\brand\logo-dark-full.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropLogoDark.Dispose()

# Light Logo on Dark (x=760, y=50, w=430, h=360)
$rectLogoLight = New-Object System.Drawing.Rectangle(770, 60, 410, 340)
$cropLogoLight = $brandImg.Clone($rectLogoLight, $brandImg.PixelFormat)
$cropLogoLight.Save("assets\brand\logo-light-full.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropLogoLight.Dispose()

# App Icon (x=1280, y=30, w=180, h=170)
$rectAppIcon = New-Object System.Drawing.Rectangle(1280, 30, 180, 170)
$cropAppIcon = $brandImg.Clone($rectAppIcon, $brandImg.PixelFormat)
$cropAppIcon.Save("assets\brand\app-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropAppIcon.Dispose()

# Circular Brand Seal (x=1275, y=240, w=190, h=190)
$rectSeal = New-Object System.Drawing.Rectangle(1275, 235, 190, 195)
$cropSeal = $brandImg.Clone($rectSeal, $brandImg.PixelFormat)
$cropSeal.Save("assets\brand\brand-seal.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropSeal.Dispose()

# Horizontal Lockup (x=30, y=510, w=440, h=135)
$rectLockup = New-Object System.Drawing.Rectangle(30, 500, 440, 150)
$cropLockup = $brandImg.Clone($rectLockup, $brandImg.PixelFormat)
$cropLockup.Save("assets\brand\horizontal-lockup.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropLockup.Dispose()

# Bronze W Tag / Dark Hero dial (x=960, y=690, w=570, h=330)
$rectDarkHero = New-Object System.Drawing.Rectangle(960, 690, 570, 330)
$cropDarkHero = $brandImg.Clone($rectDarkHero, $brandImg.PixelFormat)
$cropDarkHero.Save("assets\brand\brand-editorial-hero.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropDarkHero.Dispose()

$brandImg.Dispose()
Write-Host "Extracted brand assets!"

# 3. EXTRACT EDITORIAL BANNERS from ChatGPT Image Sep 28, 2026, 10_28_21 PM.png (1448 x 1086)
$desktopImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "docs\ChatGPT Image Sep 28, 2026, 10_28_21 PM.png").Path)

# Desktop Hero Banner Watch Section (top left panel: x=0, y=0, w=470, h=340)
$rectHero = New-Object System.Drawing.Rectangle(5, 5, 470, 335)
$cropHero = $desktopImg.Clone($rectHero, $desktopImg.PixelFormat)
$cropHero.Save("assets\banners\desktop-hero-banner.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropHero.Dispose()

# Editorial: "Modern Looks. Timeless Feel." (middle left: x=5, y=350, w=470, h=250)
$rectModern = New-Object System.Drawing.Rectangle(5, 350, 470, 250)
$cropModern = $desktopImg.Clone($rectModern, $desktopImg.PixelFormat)
$cropModern.Save("assets\banners\banner-modern-looks.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropModern.Dispose()

# Explore Premium Brands Banner (middle: x=485, y=475, w=475, h=125)
$rectExpBrands = New-Object System.Drawing.Rectangle(485, 475, 475, 125)
$cropExpBrands = $desktopImg.Clone($rectExpBrands, $desktopImg.PixelFormat)
$cropExpBrands.Save("assets\banners\banner-explore-brands.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropExpBrands.Dispose()

# Curated Occasion Cards (x=965, y=350, w=475, h=250)
# 4 Occasion cards: Formal, Casual, Sports, Luxury
$occW = [int](150 / 4) # let's crop the entire occasion panel
$rectOcc = New-Object System.Drawing.Rectangle(965, 350, 475, 250)
$cropOcc = $desktopImg.Clone($rectOcc, $desktopImg.PixelFormat)
$cropOcc.Save("assets\occasions\occasions-panel.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropOcc.Dispose()

# App Promotion Banner (x=5, y=615, w=470, h=270)
$rectApp = New-Object System.Drawing.Rectangle(5, 615, 470, 270)
$cropApp = $desktopImg.Clone($rectApp, $desktopImg.PixelFormat)
$cropApp.Save("assets\banners\app-promo-banner.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropApp.Dispose()

# Blog Images (x=10, y=920, w=460, h=120)
$rectBlog = New-Object System.Drawing.Rectangle(10, 920, 460, 120)
$cropBlog = $desktopImg.Clone($rectBlog, $desktopImg.PixelFormat)
$cropBlog.Save("assets\blog\blog-cards-strip.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropBlog.Dispose()

$desktopImg.Dispose()
Write-Host "Extracted desktop editorial banners!"

# 4. EXTRACT MOBILE BANNERS from ChatGPT Image Sep 28, 2026, 10_27_30 PM.png (1448 x 1086)
$mobileImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path "docs\ChatGPT Image Sep 28, 2026, 10_27_30 PM.png").Path)

# Bottom banner 1: Luxury Watches For Every Occasion (x=5, y=945, w=390, h=135)
$rectMob1 = New-Object System.Drawing.Rectangle(5, 945, 395, 135)
$cropMob1 = $mobileImg.Clone($rectMob1, $mobileImg.PixelFormat)
$cropMob1.Save("assets\banners\mobile-banner-luxury.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropMob1.Dispose()

# Bottom banner 2: Style Speaks Louder Than Time (x=405, y=945, w=550, h=135)
$rectMob2 = New-Object System.Drawing.Rectangle(405, 945, 550, 135)
$cropMob2 = $mobileImg.Clone($rectMob2, $mobileImg.PixelFormat)
$cropMob2.Save("assets\banners\banner-style-speaks.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropMob2.Dispose()

# Bottom banner 3: Experience WRISTO on your phone (x=960, y=945, w=480, h=135)
$rectMob3 = New-Object System.Drawing.Rectangle(960, 945, 480, 135)
$cropMob3 = $mobileImg.Clone($rectMob3, $mobileImg.PixelFormat)
$cropMob3.Save("assets\banners\mobile-app-store.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropMob3.Dispose()

$mobileImg.Dispose()
Write-Host "All assets extracted successfully!"
