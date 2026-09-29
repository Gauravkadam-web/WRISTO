Add-Type -AssemblyName System.Drawing

$files = @(
    "docs\40_images_watches.png",
    "docs\40_images_2.png",
    "docs\ChatGPT Image Sep 28, 2026, 10_32_53 PM.png",
    "docs\ChatGPT Image Sep 28, 2026, 10_28_21 PM.png",
    "docs\ChatGPT Image Sep 28, 2026, 10_27_30 PM.png"
)

foreach ($f in $files) {
    if (Test-Path $f) {
        $fullPath = (Resolve-Path $f).Path
        $img = [System.Drawing.Bitmap]::FromFile($fullPath)
        Write-Host "$f : $($img.Width) x $($img.Height)"
        $img.Dispose()
    } else {
        Write-Host "File not found: $f"
    }
}
