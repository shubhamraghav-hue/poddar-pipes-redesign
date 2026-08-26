#!/usr/bin/env bash
# Builds x265 with ENABLE_ALPHA=ON, which stock Windows FFmpeg/x265 builds do
# NOT ship — Gyan's FFmpeg (8.1.2, x265 4.2+37) advertises `yuva420p` for
# libx265 but fails at runtime with "Loaded libx265 does not support alpha
# layer encoding". Alpha landed in x265 4.0 behind this cmake flag.
#
# Run from an MSYS2 MINGW64 shell:
#   C:\msys64\msys2_shell.cmd -mingw64 -defterm -no-start -here -c "bash scripts/build-x265-alpha.sh"
#
# Produces: build/x265-alpha/x265.exe
#
# NOTE: only x265 is built here, NOT a custom FFmpeg. The encode pipeline
# (scripts/encode-hevc-alpha.ps1) uses the stock ffmpeg for decode and for
# muxing, and this binary only for the one step that needs alpha. Muxing an
# already-encoded .265 into MP4 requires no alpha support at all.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/build/x265-alpha"
SRC="$ROOT/build/x265-src"

echo "==> Installing build dependencies"
pacman -S --noconfirm --needed \
  mingw-w64-x86_64-gcc \
  mingw-w64-x86_64-cmake \
  mingw-w64-x86_64-nasm \
  mingw-w64-x86_64-make \
  git

echo "==> Fetching x265 source"
mkdir -p "$ROOT/build"
# NOT a shallow clone: x265's CMakeLists derives X265_VERSION_MAJOR/MINOR from
# `git describe` output (X265_LATEST_TAG). With --depth 1 there are no tags, so
# that variable is empty and configure dies with "list GET given empty list" at
# CMakeLists.txt:1125. Full history with tags is required.
if [ -d "$SRC/.git" ] && [ -z "$(git -C "$SRC" rev-parse --is-shallow-repository 2>/dev/null | grep true)" ]; then
  git -C "$SRC" fetch --tags origin
  git -C "$SRC" reset --hard origin/master
else
  rm -rf "$SRC"
  git clone https://bitbucket.org/multicoreware/x265_git.git "$SRC"
fi
echo "    tag detected: $(git -C "$SRC" describe --tags --abbrev=0 2>/dev/null || echo NONE)"

echo "==> Configuring with ENABLE_ALPHA=ON"
rm -rf "$SRC/build-alpha"
mkdir -p "$SRC/build-alpha"
cd "$SRC/build-alpha"
# ENABLE_SHARED=OFF keeps it a single self-contained x265.exe with no DLLs to
# place next to it — this binary is invoked directly by the encode script.
cmake ../source \
  -G "MinGW Makefiles" \
  -DCMAKE_BUILD_TYPE=Release \
  -DENABLE_ALPHA=ON \
  -DENABLE_SHARED=OFF \
  -DENABLE_CLI=ON

echo "==> Building"
cmake --build . -j "$(nproc)"

mkdir -p "$OUT"
cp -f x265.exe "$OUT/x265.exe"

echo
echo "==> Built: $OUT/x265.exe"
"$OUT/x265.exe" --version || true
echo
echo "Confirm the flag actually took effect — '--alpha' must appear here:"
"$OUT/x265.exe" --fullhelp 2>&1 | grep -i -- "--alpha" || \
  echo "  !! '--alpha' NOT found: ENABLE_ALPHA did not take effect."
