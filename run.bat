@echo off
title Arka-assist Launcher
echo ========================================================
echo   Starting Arka-assist System via index.py...
echo ========================================================
python "%~dp0index.py"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo An error occurred while starting the application.
    pause
)
