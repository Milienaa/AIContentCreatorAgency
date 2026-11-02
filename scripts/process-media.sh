#!/usr/bin/env bash
# Media pipeline for the Denoise site.
#   scripts/process-media.sh noise                 -> public/media/noise.webp
#   scripts/process-media.sh placeholders          -> gradient stand-ins for every clip
#   scripts/process-media.sh clip <in.mp4> <name>  -> public/media/<name>.mp4 + .webp poster
#   scripts/process-media.sh storyboard <in.mp4>   -> public/media/storyboard/frame-1..8.webp + final-*.webp
set -euo pipefail

OUT="public/media"
mkdir -p "$OUT" "$OUT/storyboard"

CLIPS=(hero-ink hero-perfume hero-dancer case-lumea case-northline case-oro case-pulse case-kinetic)

noise() {
  ffmpeg -y -loglevel error -f lavfi -i "color=c=gray:s=256x256:d=1" \
    -vf "geq=lum='random(1)*255':cb=128:cr=128,format=yuv420p" \
    -frames:v 1 -c:v libwebp -quality 60 "$OUT/noise.webp"
}

placeholders() {
  local colors=("0x2B2BFF:0xB69CFF" "0xFFD23F:0x2B2BFF" "0x14123A:0xB69CFF" "0xB69CFF:0x7DF0C8"
                "0x14123A:0x2B2BFF" "0xFFD23F:0x14123A" "0x2B2BFF:0x7DF0C8" "0x14123A:0xFFD23F")
  for i in "${!CLIPS[@]}"; do
    local c0="${colors[$i]%%:*}" c1="${colors[$i]##*:}"
    ffmpeg -y -loglevel error -f lavfi \
      -i "gradients=s=720x1280:c0=${c0}:c1=${c1}:x0=0:y0=0:x1=720:y1=1280:speed=0.03:d=6:r=25" \
      -an -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/${CLIPS[$i]}.mp4"
    poster "$OUT/${CLIPS[$i]}.mp4" "${CLIPS[$i]}"
  done
}

poster() {
  ffmpeg -y -loglevel error -ss 0.2 -i "$1" -frames:v 1 -vf "scale=540:-2" -c:v libwebp -quality 70 "$OUT/$2.webp"
}

clip() {
  local in="$1" name="$2"
  ffmpeg -y -loglevel error -i "$in" -t 8 -an \
    -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,fps=25" \
    -c:v libx264 -crf 28 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart \
    "$OUT/$name.mp4"
  poster "$OUT/$name.mp4" "$name"
}

storyboard() {
  local in="$1"
  for i in 1 2 3 4 5 6 7 8; do
    local t
    t=$(awk "BEGIN{print ($i-0.5)}")
    ffmpeg -y -loglevel error -ss "$t" -i "$in" -frames:v 1 \
      -vf "scale=360:640:force_original_aspect_ratio=increase,crop=360:640,edgedetect=low=0.08:high=0.2,negate,format=gray" \
      -c:v libwebp -quality 70 "$OUT/storyboard/frame-$i.webp"
  done
  # before/after pair from the same moment
  ffmpeg -y -loglevel error -ss 3 -i "$in" -frames:v 1 \
    -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,edgedetect=low=0.08:high=0.2,negate,format=gray" \
    -c:v libwebp -quality 70 "$OUT/storyboard/final-sketch.webp"
  ffmpeg -y -loglevel error -ss 3 -i "$in" -frames:v 1 \
    -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280" \
    -c:v libwebp -quality 75 "$OUT/storyboard/final-frame.webp"
}

"$@"
