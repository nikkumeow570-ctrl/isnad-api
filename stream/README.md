# 24/7 Quran live on YouTube (no OBS)
1. YouTube Studio -> Go live -> Stream -> copy the **Stream key**. Turn on "Enable DVR" off if you like; set the stream to start automatically.
2. Get an always-on Linux machine (any small VPS, 2 vCPU / 2 GB is enough at 720p). GitHub Actions or free app hosts cannot run 24/7.
3. On it:
   ```
   git clone <your repo> isnad-api && cd isnad-api
   docker build -f stream/Dockerfile -t isnad-live .
   docker run -d --restart unless-stopped -e YT_KEY=xxxx-xxxx-xxxx-xxxx isnad-live
   ```
4. Change what plays with `-e LIVE_QUERY="surah=18&audio=1&en=1"`, or `surah=0` for all 114 surahs in a loop. Reciter: `reciter=Alafasy_128kbps` (any folder name from everyayah.com).
Notes: audio is streamed from everyayah.com, so the machine needs internet. Check the reciter's and YouTube's rules for recitation audio before going public. YouTube may cap DVR at 12 hours; the stream itself can run continuously.
