$dataJsPath = ".\data.js"
$imagesDir  = ".\images"
$webPath    = "images"

Write-Host "Reading data.js..." -ForegroundColor Cyan
$rawJs = [System.IO.File]::ReadAllText($dataJsPath, [System.Text.Encoding]::UTF8)

$prefix = "window.IT_HELPDESK_DATA = "
$startIndex = $rawJs.IndexOf($prefix)
if ($startIndex -lt 0) {
    Write-Host "Error: Could not find valid prefix inside data.js" -ForegroundColor Red
    exit 1
}

$rawJson = $rawJs.Substring($startIndex + $prefix.Length).Trim()
if ($rawJson.EndsWith(";")) {
    $rawJson = $rawJson.Substring(0, $rawJson.Length - 1)
}

Write-Host "Parsing JSON (length: $($rawJson.Length))..." -ForegroundColor Cyan
$data = $rawJson | ConvertFrom-Json
Write-Host "Done parsing." -ForegroundColor Green

if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir | Out-Null
}

$converted = 0
$skipped   = 0
$updatedData = @{}

$props = $data | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name

foreach ($key in $props) {
    $value = $data.$key

    if ($value -is [string] -and $value.StartsWith("data:image/")) {
        if ($value -match '^data:([^;]+);base64,(.+)$') {
            $mimeType = $Matches[1]
            $b64Data  = $Matches[2]

            $ext = switch ($mimeType.ToLower()) {
                "image/jpeg" { "jpg" }
                "image/jpg"  { "jpg" }
                "image/png"  { "png" }
                "image/gif"  { "gif" }
                "image/webp" { "webp" }
                "image/bmp"  { "bmp" }
                default      { "bin" }
            }

            $filename = "img$key.$ext"
            $filepath = Join-Path $imagesDir $filename

            try {
                $bytes = [Convert]::FromBase64String($b64Data)
                [System.IO.File]::WriteAllBytes($filepath, $bytes)
                $sizeKB = [math]::Round($bytes.Length / 1024, 1)
                Write-Host "  OK key=$key -> $filename ($sizeKB KB)" -ForegroundColor Green
                $updatedData[$key] = "$webPath/$filename"
                $converted++
            } catch {
                Write-Host "  ERR key=$key : $_" -ForegroundColor Red
                $updatedData[$key] = $value
                $skipped++
            }
        } else {
            Write-Host "  SKIP key=$key (cannot parse)" -ForegroundColor Yellow
            $updatedData[$key] = $value
            $skipped++
        }
    } else {
        $updatedData[$key] = $value
    }
}

Write-Host "Writing updated data.js..." -ForegroundColor Cyan
$newJson = $updatedData | ConvertTo-Json -Depth 10 -Compress
$newJs = "window.IT_HELPDESK_DATA = $newJson;"
[System.IO.File]::WriteAllText($dataJsPath, $newJs, [System.Text.Encoding]::UTF8)

$newSize = (Get-Item $dataJsPath).Length
Write-Host "DONE! Converted=$converted Skipped=$skipped NewSize=$([math]::Round($newSize/1024,1))KB" -ForegroundColor Magenta
