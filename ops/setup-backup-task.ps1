# ============================================================
# Einmalig als Administrator ausführen um den Aufgabenplaner
# für den wöchentlichen Backup-Download einzurichten.
# ============================================================

$scriptPath = Join-Path $PSScriptRoot "pull-backup-to-local.ps1"

$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NonInteractive -WindowStyle Hidden -File `"$scriptPath`""

# Jeden Sonntag um 10:00 Uhr (PC muss an sein — startet nach, wenn er zwischendurch aus war)
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 10am

$settings = New-ScheduledTaskSettingsSet `
    -RunOnlyIfNetworkAvailable `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 10)

Register-ScheduledTask `
    -TaskName "AzubiApp-Backup-Sync" `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "Wöchentlicher Backup-Download vom Azubi-App VPS nach $env:USERPROFILE\Backups\azubi-app" `
    -Force

Write-Host "Aufgabe 'AzubiApp-Backup-Sync' wurde eingerichtet." -ForegroundColor Green
Write-Host "Backups werden jeden Sonntag um 10:00 Uhr gezogen."
Write-Host "Gespeichert in: $env:USERPROFILE\Backups\azubi-app"
