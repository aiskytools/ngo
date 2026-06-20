@echo off
echo Stopping NGO Local Server...
taskkill /FI "WindowTitle eq NGO Local Server*" /T /F
echo.
echo Server stopped.
pause
