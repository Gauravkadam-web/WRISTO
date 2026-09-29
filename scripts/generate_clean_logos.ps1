Add-Type -AssemblyName System.Drawing

$srcPath = "e:\WRISTO\assets\brand\horizontal-lockup.png"
$bmp = [System.Drawing.Bitmap]::new($srcPath)
$w = $bmp.Width
$h = $bmp.Height

# We clip the bottom text "HORIZONTAL LOCKUP" by setting valid height to 120 (from y=15 to y=115)
$top = 18
$bottom = 112
$cropH = $bottom - $top

$outLight = [System.Drawing.Bitmap]::new($w, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$outDark  = [System.Drawing.Bitmap]::new($w, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Background ivory reference: R=247, G=243, B=236
for ($y = $top; $y -lt $bottom; $y++) {
    $outY = $y - $top
    for ($x = 0; $x -lt $w; $x++) {
        $p = $bmp.GetPixel($x, $y)
        $r = [int]$p.R
        $g = [int]$p.G
        $b = [int]$p.B

        # Darkness value (0 = background ivory, 255 = fully dark/colored)
        # Background brightness is ~242
        $bgBrightness = 242.0
        $curBrightness = ($r * 0.299 + $g * 0.587 + $b * 0.114)
        $diff = $bgBrightness - $curBrightness

        if ($diff -le 3.0) {
            # Fully transparent
            $outLight.SetPixel($x, $outY, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            $outDark.SetPixel($x, $outY, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            $alpha = [int]($diff * 3.5)
            if ($alpha -gt 255) { $alpha = 255 }
            if ($diff -gt 60) { $alpha = 255 }

            # REGION 1: W MARK (x < 135)
            if ($x -lt 135) {
                # Preserve the genuine bronze tones
                # In light mode:
                $outLight.SetPixel($x, $outY, [System.Drawing.Color]::FromArgb($alpha, $r, $g, $b))
                # In dark mode: vibrant champagne bronze (#C9A070 to #D4AF37)
                # Boost brightness so it gleams on dark backgrounds
                $drR = [Math]::Min(255, [int]($r * 1.35 + 20))
                $drG = [Math]::Min(255, [int]($g * 1.25 + 15))
                $drB = [Math]::Min(255, [int]($b * 1.15 + 10))
                $outDark.SetPixel($x, $outY, [System.Drawing.Color]::FromArgb($alpha, $drR, $drG, $drB))
            }
            # REGION 2: VERTICAL DIVIDER (135 <= x <= 150)
            elseif ($x -le 150) {
                # Divider line
                $outLight.SetPixel($x, $outY, [System.Drawing.Color]::FromArgb($alpha, 40, 40, 40))
                $outDark.SetPixel($x, $outY, [System.Drawing.Color]::FromArgb([int]($alpha * 0.45), 200, 168, 118))
            }
            # REGION 3: WRISTO WORDMARK & TAGLINE (x > 150)
            else {
                # In light mode: Charcoal #1A1A1A for WRISTO, bronze for tagline
                if ($y -gt 80) {
                    # Tagline "YOUR TIME. YOUR STYLE." (Bronze)
                    $outLight.SetPixel($x, $outY, [System.Drawing.Color]::FromArgb($alpha, 140, 105, 70))
                    $outDark.SetPixel($x, $outY, [System.Drawing.Color]::FromArgb($alpha, 195, 160, 115))
                } else {
                    # Main WRISTO text
                    $outLight.SetPixel($x, $outY, [System.Drawing.Color]::FromArgb($alpha, 20, 20, 20))
                    # In dark mode: Ivory white #F7F3EC
                    $outDark.SetPixel($x, $outY, [System.Drawing.Color]::FromArgb($alpha, 247, 243, 236))
                }
            }
        }
    }
}

# Trim horizontal transparent edges
$minX = $w
$maxX = 0
for ($y = 0; $y -lt $cropH; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        if ($outLight.GetPixel($x, $y).A -gt 20) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
        }
    }
}

$trimmedW = ($maxX - $minX) + 1
$finalLight = [System.Drawing.Bitmap]::new($trimmedW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$finalDark  = [System.Drawing.Bitmap]::new($trimmedW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$gL = [System.Drawing.Graphics]::FromImage($finalLight)
$gL.DrawImage($outLight, [System.Drawing.Rectangle]::new(0, 0, $trimmedW, $cropH), [System.Drawing.Rectangle]::new($minX, 0, $trimmedW, $cropH), [System.Drawing.GraphicsUnit]::Pixel)

$gD = [System.Drawing.Graphics]::FromImage($finalDark)
$gD.DrawImage($outDark, [System.Drawing.Rectangle]::new(0, 0, $trimmedW, $cropH), [System.Drawing.Rectangle]::new($minX, 0, $trimmedW, $cropH), [System.Drawing.GraphicsUnit]::Pixel)

$finalLight.Save("e:\WRISTO\assets\brand\logo-horizontal-light.png", [System.Drawing.Imaging.ImageFormat]::Png)
$finalDark.Save("e:\WRISTO\assets\brand\logo-horizontal-dark.png", [System.Drawing.Imaging.ImageFormat]::Png)

$gL.Dispose()
$gD.Dispose()
$finalLight.Dispose()
$finalDark.Dispose()
$outLight.Dispose()
$outDark.Dispose()
$bmp.Dispose()

Write-Output "Successfully generated high-fidelity logo-horizontal-light.png and logo-horizontal-dark.png (Trimmed width: $trimmedW, height: $cropH)"
