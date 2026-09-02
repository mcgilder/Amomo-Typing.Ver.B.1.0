@echo off
chcp 65001 >nul
title 阿墨墨打字通 - 本地服务器
cd /d "%~dp0"
echo.
echo  ================================================
echo    阿墨墨打字通启动中...
echo    启动后会自动打开浏览器 http://localhost:5173
echo    关闭本窗口 = 关闭服务器
echo  ================================================
echo.
start "" http://localhost:5173
npm run dev
pause
