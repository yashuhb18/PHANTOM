@echo off
title PHANTOM-TEST-PROBE
color 0c
echo ======================================================================
echo           PHANTOM AUTONOMOUS SENTINEL LIVE VERIFICATION PROBE
echo ======================================================================
echo.
echo [1] Simulating suspicious script host execution from USB drive...
echo [2] Spawning background evasive PowerShell task (PID will be monitored)...
echo [3] If PHANTOM is active, this task will be SURGICALLY KILLED within 1s!
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Write-Host 'PHANTOM-TEST: Simulating unauthorized USB execution...'; Start-Sleep -Seconds 60"
echo.
echo ======================================================================
echo [RESULT] Process terminated or completed.
echo Check your PHANTOM Dashboard: Neutralizations should now be +1!
echo ======================================================================
pause
