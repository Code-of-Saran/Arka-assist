@echo off
cd /d "%~dp0"
npm.cmd install --no-audit --no-fund
echo NPM INSTALL FINISHED WITH CODE %ERRORLEVEL%
