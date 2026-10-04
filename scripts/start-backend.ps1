# Load .env into process environment variables
$envFile = Join-Path $PSScriptRoot "..\.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#")) {
            $split = $line.Split("=", 2)
            if ($split.Length -eq 2) {
                $key = $split[0].Trim()
                $val = $split[1].Trim()
                [System.Environment]::SetEnvironmentVariable($key, $val, "Process")
            }
        }
    }
}

Set-Location (Join-Path $PSScriptRoot "..\wristo-backend")
mvn spring-boot:run
