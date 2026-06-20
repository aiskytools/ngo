@echo off
echo Starting local development server...
start "NGO Local Server" cmd /k "title NGO Local Server && npm run dev"
echo Server is running in a new window.
