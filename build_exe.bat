@echo off
title PHANTOM Executable Builder
echo ======================================================================
echo           PHANTOM: Building Standalone Windows .exe App
echo ======================================================================
echo.

echo [1/3] Building React Frontend Production Assets...
cd /d "%~dp0\frontend"
call npm run build
if %errorlevel% neq 0 (
    echo Error: Frontend build failed.
    pause
    exit /b 1
)
cd /d "%~dp0"

echo.
echo [2/3] Compiling Standalone Executable via PyInstaller...
pyinstaller PHANTOM.spec --noconfirm --clean
if %errorlevel% neq 0 (
    echo Error: PyInstaller build failed.
    pause
    exit /b 1
)

echo.
echo ======================================================================
echo [3/3] BUILD COMPLETE!
echo.
echo Standalone Executable is located at:
echo   %~dp0dist\PHANTOM.exe
echo.
echo You can now distribute dist\PHANTOM.exe directly to judges or users!
echo ======================================================================
echo.
pause
