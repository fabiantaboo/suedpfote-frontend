@echo off
cd /d "%~dp0"
magick -size 1200x630 xc:#18181b ^
  ( logo-t.png -resize 180x180 ) -gravity northwest -geometry +60+60 -composite ^
  -gravity center ^
  -font Arial-Bold -pointsize 72 -fill white ^
  -annotate +0-50 "SUDPFOTE" ^
  -font Arial -pointsize 36 -fill #a1a1aa ^
  -annotate +0+40 "Premium Produkte fur Linkshander" ^
  -font Arial -pointsize 28 -fill #22c55e ^
  -annotate +0+100 "Weil 10%% der Welt auch 100%% verdienen" ^
  og-image.png
echo Done!
