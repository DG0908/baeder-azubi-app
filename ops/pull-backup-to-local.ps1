# ============================================================
# Azubi-App — Backup vom VPS auf lokalen PC ziehen
# ============================================================
# Einrichtung:
#   1. VPS_HOST und VPS_USER unten anpassen
#   2. SSH-Key muss in ~/.ssh/ liegen (gleicher Key wie für VPS-Zugang)
#   3. Script einmalig manuell testen: rechtsklick → "Mit PowerShell ausführen"
#   4. Danach per Windows Aufgabenplanung automatisieren (Anleitung am Ende)
# ============================================================

# --- Konfiguration -----------------------------------------------------------
$VPS_HOST    = "api.smartbaden.de"   # VPS-Hostname oder IP-Adresse
$VPS_USER    = "root"                # SSH-Benutzername auf dem VPS
$VPS_PATH    = "/opt/azubi-app/backups"  # Pfad zu den Backups auf dem VPS
$LOCAL_DIR   = "$env:USERPROFILE\Backups\azubi-app"  # Lokaler Speicherort
$KEEP_COPIES = 8                     # Wie viele lokale Kopien behalten (8 Wochen)
# -----------------------------------------------------------------------------

$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"

Write-Host "[$timestamp] Azubi-App Backup-Sync startet..." -ForegroundColor Cyan

# Lokalen Ordner anlegen falls nicht vorhanden
if (-not (Test-Path $LOCAL_DIR)) {
    New-Item -ItemType Directory -Path $LOCAL_DIR | Out-Null
    Write-Host "  Ordner erstellt: $LOCAL_DIR"
}

# Neueste Backup-Datei auf dem VPS ermitteln
Write-Host "  Verbinde mit $VPS_HOST..."
try {
    $latestFile = ssh "$VPS_USER@$VPS_HOST" `
        "ls -t $VPS_PATH/azubi-app-*.sql.gz 2>/dev/null | head -1"
} catch {
    Write-Host "FEHLER: SSH-Verbindung fehlgeschlagen." -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

if (-not $latestFile) {
    Write-Host "FEHLER: Keine Backup-Datei auf dem VPS gefunden." -ForegroundColor Red
    exit 1
}

$fileName = Split-Path $latestFile -Leaf
$localTarget = Join-Path $LOCAL_DIR $fileName

# Prüfen ob diese Datei lokal schon existiert
if (Test-Path $localTarget) {
    Write-Host "  Backup bereits vorhanden: $fileName — nichts zu tun." -ForegroundColor Green
    exit 0
}

# Datei herunterladen
Write-Host "  Lade herunter: $fileName"
try {
    scp "$VPS_USER@${VPS_HOST}:$latestFile" $localTarget
} catch {
    Write-Host "FEHLER: Download fehlgeschlagen." -ForegroundColor Red
    Write-Host $_.Exception.Message
    if (Test-Path $localTarget) { Remove-Item $localTarget }
    exit 1
}

$sizeKB = [math]::Round((Get-Item $localTarget).Length / 1KB, 0)
Write-Host "  Gespeichert: $localTarget ($sizeKB KB)" -ForegroundColor Green

# Alte lokale Kopien bereinigen (nur $KEEP_COPIES behalten)
$allBackups = Get-ChildItem -Path $LOCAL_DIR -Filter "azubi-app-*.sql.gz" |
              Sort-Object LastWriteTime -Descending

if ($allBackups.Count -gt $KEEP_COPIES) {
    $toDelete = $allBackups | Select-Object -Skip $KEEP_COPIES
    foreach ($old in $toDelete) {
        Remove-Item $old.FullName
        Write-Host "  Alte Kopie entfernt: $($old.Name)"
    }
}

Write-Host "[$timestamp] Fertig. Lokale Kopien: $([math]::Min($allBackups.Count, $KEEP_COPIES))/$KEEP_COPIES" -ForegroundColor Cyan

# ============================================================
# AUFGABENPLANUNG EINRICHTEN (einmalig, als Admin ausführen):
#
#   $action  = New-ScheduledTaskAction -Execute "powershell.exe" `
#                -Argument "-NonInteractive -File `"$PSCommandPath`""
#   $trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 10am
#   $settings = New-ScheduledTaskSettingsSet -RunOnlyIfNetworkAvailable `
#                 -StartWhenAvailable
#   Register-ScheduledTask -TaskName "AzubiApp-Backup-Sync" `
#     -Action $action -Trigger $trigger -Settings $settings `
#     -Description "Wöchentlicher Backup-Download vom Azubi-App VPS"
#
# Danach unter: Aufgabenplanung → AzubiApp-Backup-Sync sichtbar
# ============================================================
