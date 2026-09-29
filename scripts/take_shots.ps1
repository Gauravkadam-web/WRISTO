$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$outDir = "C:\Users\Gaurav Kadam\.gemini\antigravity-ide\brain\d2d22725-60a1-4293-a689-433da217e64e"

& $chrome --headless --screenshot="$outDir\shot_1440.png" --window-size=1440,1400 http://localhost:3333/
& $chrome --headless --screenshot="$outDir\shot_768.png" --window-size=768,1400 http://localhost:3333/
& $chrome --headless --screenshot="$outDir\shot_375.png" --window-size=375,1400 http://localhost:3333/

Write-Output "Screenshots captured successfully"
