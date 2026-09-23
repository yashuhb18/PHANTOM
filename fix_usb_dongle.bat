@echo off
:: PHANTOM / Windows USB Code 43 Auto-Repair Utility
:: Must be run as Administrator (Right click -> Run as administrator)
echo ======================================================================
echo    Repairing USB Dongle Code 43 (Descriptor Request Failed)
echo ======================================================================
echo.

echo [1/3] Removing stuck/corrupted USB device descriptor nodes...
powershell -NoProfile -Command "Get-PnpDevice -Class USB | Where-Object { $_.InstanceId -like '*VID_0000&PID_0002*' -or $_.FriendlyName -like '*Descriptor Request Failed*' } | ForEach-Object { Write-Host '  Found stuck node: ' $_.InstanceId; & pnputil /remove-device $_.InstanceId }"

echo.
echo [2/3] Triggering USB bus hardware re-enumeration...
pnputil /scan-devices

echo.
echo [3/3] Checking current USB status...
powershell -NoProfile -Command "$bad = Get-PnpDevice -PresentOnly -Class USB | Where-Object { $_.Problem -eq 'CM_PROB_FAILED_POST_START' }; if ($bad) { Write-Host '  Status: Still in error state. Please UNPLUG the dongle and plug it into a DIFFERENT USB port.' -ForegroundColor Yellow } else { Write-Host '  Status: Clean! No USB devices in error state.' -ForegroundColor Green }"

echo.
echo ======================================================================
echo If the dongle is still not recognized:
echo 1. Unplug the dongle.
echo 2. Plug it into a DIFFERENT USB port on your laptop.
echo 3. If still stuck, do a full Cold Reboot (Hold laptop power button 20s).
echo ======================================================================
pause
