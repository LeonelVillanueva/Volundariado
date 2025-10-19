@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════
echo 🚀 INICIANDO SISTEMA DE VOLUNTARIADO
echo ═══════════════════════════════════════════════════════
echo.
echo Se abrirán 3 ventanas:
echo   1️⃣  Backend (Puerto 3000)
echo   2️⃣  Frontend (Puerto 3001)
echo   3️⃣  Móvil (Windows)
echo.
pause

REM Iniciar Backend
start "Backend - Puerto 3000" cmd /k "cd /d "%~dp0Backend" && npm run dev"

REM Esperar 2 segundos
timeout /t 2 /nobreak >nul

REM Iniciar Frontend
start "Frontend - Puerto 3001" cmd /k "cd /d "%~dp0Frontend" && npm run dev"

REM Esperar 2 segundos
timeout /t 2 /nobreak >nul

REM Iniciar Móvil
start "Movil - Flutter" cmd /k "cd /d "%~dp0Movil" && flutter run -d windows"

echo.
echo ✅ Todas las aplicaciones se están iniciando...
echo.
echo 💡 Cierra este archivo cuando termines de trabajar
echo    (las otras ventanas seguirán abiertas)
echo.
pause

