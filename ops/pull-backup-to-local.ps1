# Azubi-App - Backup vom VPS auf lokalen PC ziehen

$VPS_HOST    = "api.smartbaden.de"
$VPS_USER    = "root"
$VPS_PATH    = "/opt/azubi-app/backups"
$LOCAL_DIR   = "$env:USERPROFILE\Backups\azubi-app"
$KEEP_COPIES = 30

$ErrorActionPreference = "Stop"

Write-Host "Azubi-App Backup-Sync startet..." -ForegroundColor Cyan

if (-not (Test-Path $LOCAL_DIR)) {
    New-Item -ItemType Directory -Path $LOCAL_DIR | Out-Null
    Write-Host "  Ordner erstellt: $LOCAL_DIR"
}

Write-Host "  Verbinde mit $VPS_HOST..."

$latestFile = ssh "$VPS_USER@$VPS_HOST" "ls -t $VPS_PATH/backup_*.sql 2>/dev/null | head -1"

if (-not $latestFile) {
    Write-Host "FEHLER: Keine Backup-Datei gefunden." -ForegroundColor Red
    exit 1
}

$fileName = Split-Path $latestFile -Leaf
$localTarget = Join-Path $LOCAL_DIR $fileName

if (Test-Path $localTarget) {
    Write-Host "  Backup bereits vorhanden: $fileName" -ForegroundColor Green
    exit 0
}

Write-Host "  Lade herunter: $fileName"
scp "$VPS_USER@${VPS_HOST}:$latestFile" $localTarget

$sizeKB = [math]::Round((Get-Item $localTarget).Length / 1024, 0)
Write-Host "  Gespeichert: $localTarget ($sizeKB KB)" -ForegroundColor Green

$allBackups = Get-ChildItem -Path $LOCAL_DIR -Filter "backup_*.sql" |
              Sort-Object LastWriteTime -Descending

if ($allBackups.Count -gt $KEEP_COPIES) {
    $toDelete = $allBackups | Select-Object -Skip $KEEP_COPIES
    foreach ($old in $toDelete) {
        Remove-Item $old.FullName
        Write-Host "  Alte Kopie entfernt: $($old.Name)"
    }
}

Write-Host "Fertig." -ForegroundColor Cyan
