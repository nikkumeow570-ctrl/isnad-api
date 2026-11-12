#!/bin/bash
# Env: YT_KEY (YouTube stream key, required), LIVE_QUERY (default "surah=0&audio=1&en=1"), W/H/FPS/VBR
set -u
: "${YT_KEY:?Set YT_KEY to your YouTube stream key}"
W=${W:-1280}; H=${H:-720}; FPS=${FPS:-15}; VBR=${VBR:-2500k}
Q=${LIVE_QUERY:-surah=0\&audio=1\&en=1}
export DISPLAY=:99
PORT=3000 node /app/server.js & sleep 2
Xvfb :99 -screen 0 ${W}x${H}x24 & sleep 1
pulseaudio --start --exit-idle-time=-1 --daemonize=yes
pactl load-module module-null-sink sink_name=live >/dev/null
pactl set-default-sink live
chromium_bin=$(find / -type f -name chrome -path "*chromium-*" 2>/dev/null | head -1)
"$chromium_bin" --no-sandbox --kiosk --window-size=$W,$H --window-position=0,0 \
  --autoplay-policy=no-user-gesture-required --disable-infobars --user-data-dir=/tmp/chr \
  "http://localhost:3000/live?${Q//\\&/&}" >/dev/null 2>&1 &
sleep 8
while true; do   # restart ffmpeg if YouTube drops the connection
  ffmpeg -loglevel warning -f x11grab -framerate $FPS -video_size ${W}x${H} -i :99 \
    -f pulse -i live.monitor \
    -c:v libx264 -preset veryfast -tune zerolatency -b:v $VBR -maxrate $VBR -bufsize $((2*${VBR%k}))k -pix_fmt yuv420p -g $((FPS*2)) \
    -c:a aac -b:a 128k -ar 44100 \
    -f flv "rtmp://a.rtmp.youtube.com/live2/${YT_KEY}"
  echo "ffmpeg stopped, retrying in 5s"; sleep 5
done
