# 24/7 YouTube live without OBS: Chromium shows /live, ffmpeg captures screen + audio and pushes RTMP.
FROM mcr.microsoft.com/playwright:v1.48.0-jammy
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg xvfb pulseaudio fonts-noto fonts-noto-core fonts-noto-extra fonts-hosny-amiri nodejs npm && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . /app
RUN chmod +x /app/stream/run.sh
CMD ["/app/stream/run.sh"]
