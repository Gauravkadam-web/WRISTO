Add-Type -AssemblyName System.Drawing
$b = [System.Drawing.Bitmap]::new("e:\WRISTO\docs\ChatGPT Image Sep 28, 2026, 10_28_21 PM.png")
Write-Output "ChatGPT Image 2 Size: $($b.Width) x $($b.Height)"
# Row 2, Col 1 is roughly x: 0 to 512, y: 341 to 682
$crop = [System.Drawing.Bitmap]::new(512, 341)
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($b, [System.Drawing.Rectangle]::new(0, 0, 512, 341), [System.Drawing.Rectangle]::new(0, 341, 512, 341), [System.Drawing.GraphicsUnit]::Pixel)
$crop.Save("e:\WRISTO\assets\banners\screen4_crop.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$crop.Dispose()
$b.Dispose()
Write-Output "Saved screen4_crop.png"
