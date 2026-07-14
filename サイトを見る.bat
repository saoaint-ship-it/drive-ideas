@echo off
rem Drive Ideas 試作サイトを起動してブラウザで開く
cd /d C:\Users\saoai\Desktop\drive-ideas
set "PATH=C:\Program Files\nodejs;%PATH%"
start "" http://localhost:3120
call npm run dev -- -p 3120
