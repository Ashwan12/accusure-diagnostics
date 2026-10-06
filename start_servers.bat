@echo off
title ACCUSURE DIAGNOSTICS - Server Launcher
echo ========================================================
echo        ACCUSURE DIAGNOSTICS - FULL STACK SYSTEM
echo   Smart Healthcare & Diagnostic Management System
echo ========================================================
echo.
echo Starting Django REST Framework Backend on port 8000...
start "Accusure Backend" cmd /k "cd /d %~dp0backend && python manage.py runserver 0.0.0.0:8000"

timeout /t 2 /nobreak >nul

echo Starting Vite React Frontend on port 5173...
start "Accusure Frontend" cmd /k "cd /d %~dp0frontend && npm.cmd run dev -- --host"

echo.
echo ========================================================
echo  ACCUSURE DIAGNOSTICS is now running!
echo  Laptop / Desktop:  http://localhost:5173/
echo  Mobile / Network:  Open your phone browser with the
echo                     network IP shown in the frontend window!
echo ========================================================
echo.
pause

