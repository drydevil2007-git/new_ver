@echo off
title Deploy DaneshYar Cloud Agent to Cloudflare Worker
cd /d "C:\Users\parsa\Downloads\Telegram Desktop\new_ver\cloudflare-agent-bot"
echo ==========================================================
echo   Deploying 24/7 Cloudflare Worker Agent for Telegram...
echo ==========================================================
npx wrangler deploy
pause
