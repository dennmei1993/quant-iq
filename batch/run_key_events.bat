@echo off

REM === Get project root (parent of this batch folder) ===
cd /d "%~dp0.."

REM === Ensure logs directory exists ===
if not exist logs mkdir logs

echo ================================ >> logs\keyevents.log
echo Run started at %DATE% %TIME% >> logs\keyevents.log

call npm run keyevents >> logs\keyevents.log 2>&1

if %ERRORLEVEL% neq 0 (
    echo ERROR detected at %DATE% %TIME% >> logs\keyevents.log
    exit /b 1
)

echo Run finished at %DATE% %TIME% >> logs\keyevents.log