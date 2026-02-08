@echo off
cd /d "%~dp0"
magick logo-backup.png -fuzz 20%% -transparent white PNG32:logo.png
echo Done!
