# Exports the local "travel" MySQL database into database/init/01-travel.sql.
# Docker imports that file automatically the first time the mysql container starts.
#
# Usage (from the project root, with your local MySQL running):
#   powershell -ExecutionPolicy Bypass -File database\export-db.ps1
param(
    [string]$User = "root",
    [string]$Password = "123456",
    [string]$Database = "travel",
    [string]$MySqlBin = "C:\Program Files\MySQL\MySQL Server 9.1\bin"
)

$out = Join-Path $PSScriptRoot "init\01-travel.sql"
New-Item -ItemType Directory -Force (Split-Path $out) | Out-Null

& "$MySqlBin\mysqldump.exe" -u $User "-p$Password" `
    --default-character-set=utf8mb4 `
    --single-transaction --routines --triggers `
    --no-tablespaces --set-gtid-purged=OFF `
    --result-file="$out" $Database

if ($LASTEXITCODE -eq 0) { Write-Host "Exported to $out" } else { Write-Error "mysqldump failed" }
