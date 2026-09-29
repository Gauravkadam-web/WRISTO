Add-Type -AssemblyName System.Drawing

# Load source horizontal lockup
$srcPath = "e:\WRISTO\assets\brand\horizontal-lockup.png"
$bmp = [System.Drawing.Bitmap]::new($srcPath)
$w = $bmp.Width
$h = $bmp.Height

# We will create two versions:
# 1. logo-horizontal-light.png: for light backgrounds (transparent bg, original dark text/divider, bronze mark)
# 2. logo-horizontal-dark.png: for dark backgrounds (transparent bg, ivory text/divider, bronze mark)

$outLight = [System.Drawing.Bitmap]::new($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$outDark  = [System.Drawing.Bitmap]::new($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Background color is approximately R=247, G=243, B=236 (Ivory #F7F3EC)
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $p = $bmp.GetPixel($x, $y)
        $r = [int]$p.R
        $g = [int]$p.G
        $b = [int]$p.B
        
        # Calculate brightness/distance from ivory background
        # Background is very light (R>230, G>225, B>215)
        # Foreground marks/text have darkness:
        # Distance from ivory (247, 243, 236):
        $dist = [Math]::Sqrt([Math]::Pow($r - 247, 2) + [Math]::Pow($g - 243, 2) + [Math]::Pow($b - 236, 2))
        
        if ($dist -lt 15) {
            # Fully transparent background
            $outLight.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            $outDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            # Smooth antialiasing alpha based on distance
            $alpha = [Math]::Min(255, [int]($dist * 6))
            if ($dist -gt 45) { $alpha = 255 }
            
            # For light background: keep bronze mark, dark text
            $outLight.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $r, $g, $b))
            
            # For dark background:
            # If it's the bronze mark (R > 130 and G > 90 and B < 120 and R > B + 30):
            # Keep bronze or make it bright champagne bronze: R=215, G=175, B=125
            # If it's dark text/divider (R < 100, G < 100, B < 100):
            # Turn into Ivory #F7F3EC (R=247, G=243, B=236)
            $isBronze = ($r -gt 110 -and $r -gt $b + 25 -and $g -gt 70)
            if ($isBronze) {
                # Enhance bronze metallic tone for dark background
                $brR = [Math]::Min(255, [int]($r * 1.25))
                $brG = [Math]::Min(255, [int]($g * 1.2))
                $brB = [Math]::Min(255, [int]($b * 1.15))
                $outDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $brR, $brG, $brB))
            } else {
                # Text / divider: make Ivory white on dark background
                $invAlpha = [Math]::Min(255, [int]((255 - (($r + $g + $b) / 3)) * 1.2))
                $outDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($invAlpha, 247, 243, 236))
            }
        }
    }
}

$outLight.Save("e:\WRISTO\assets\brand\logo-horizontal-light.png", [System.Drawing.Imaging.ImageFormat]::Png)
$outDark.Save("e:\WRISTO\assets\brand\logo-horizontal-dark.png", [System.Drawing.Imaging.ImageFormat]::Png)

$outLight.Dispose()
$outDark.Dispose()
$bmp.Dispose()

Write-Output "Successfully generated logo-horizontal-light.png and logo-horizontal-dark.png"
