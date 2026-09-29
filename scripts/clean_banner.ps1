Add-Type -AssemblyName System.Drawing

$srcPath = "e:\WRISTO\assets\banners\banner-modern-looks.png"
$backupPath = "e:\WRISTO\assets\banners\banner-modern-looks-orig.png"

$b = [System.Drawing.Bitmap]::new($srcPath)
Write-Output "Original dimensions: $($b.Width) x $($b.Height)"

# Backup original
if (-not (Test-Path $backupPath)) {
    Copy-Item $srcPath $backupPath
}

# The dark banner starts at y=32 and has a border on the right/bottom
# Let's inspect borders
$top = 32
$h = $b.Height - $top
$w = $b.Width

$clean = [System.Drawing.Bitmap]::new($w, $h)
$g = [System.Drawing.Graphics]::FromImage($clean)
$g.DrawImage($b, [System.Drawing.Rectangle]::new(0, 0, $w, $h), [System.Drawing.Rectangle]::new(0, $top, $w, $h), [System.Drawing.GraphicsUnit]::Pixel)

$b.Dispose()
$clean.Save($srcPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$clean.Dispose()

Write-Output "Saved clean banner-modern-looks.png with dimensions: $w x $h (removed 32px top white bar)"
