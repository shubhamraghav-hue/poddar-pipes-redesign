# Produces public/hero/hero-fittings-alpha.mp4 — HEVC (hvc1) carrying a real
# alpha channel, the only transparent-video format WebKit/Safari supports
# (iOS 13+). This is what lets iOS match Figma and the WebM instead of
# rendering the pre-composited, fully-opaque H.264 fallback.
#
#   powershell -File scripts/encode-hevc-alpha.ps1
#
# Requires build/x265-alpha/x265.exe from scripts/build-x265-alpha.sh —
# stock Windows x265 builds omit ENABLE_ALPHA and cannot do this.
#
# SOURCE NOTE: the original 91 MB GIF master is not in this repo, but it is
# not needed. hero-fittings.webm carries real VP9 alpha, and ffmpeg CAN read
# it — but ONLY via `-c:v libvpx-vp9`. ffmpeg's default/native VP9 decoder
# silently reports yuv420p and drops the alpha entirely (confirmed on 8.1.2:
# `alphaextract` fails with "Requested planes not available"). Do not remove
# that flag.
#
# VERIFY NOTE: ffmpeg cannot check its own output here — decoding HEVC alpha
# in ffmpeg returns an all-0xFF alpha plane regardless of what is really in
# the file. Real verification must happen in WebKit (see the bottom of this
# script) or on a real iPhone.

$ErrorActionPreference = "Stop"

$root   = Split-Path -Parent $PSScriptRoot
$src    = Join-Path $root "public\hero\hero-fittings.webm"
$x265   = Join-Path $root "build\x265-alpha\x265.exe"
$tmpDir = Join-Path $root "build"
$raw265 = Join-Path $tmpDir "hero-fittings-alpha.265"
$outMp4 = Join-Path $root "public\hero\hero-fittings-alpha.mp4"

foreach ($p in @($src, $x265)) {
  if (-not (Test-Path $p)) { throw "Missing required input: $p" }
}
New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

# Fail early and loudly if the binary lacks the flag, rather than silently
# producing an opaque file that only shows up as wrong on a real device.
$help = & $x265 --fullhelp 2>&1 | Out-String
if ($help -notmatch "--alpha") {
  throw "$x265 has no --alpha option; it was not built with ENABLE_ALPHA=ON."
}

$probe = & ffprobe -v error -select_streams v:0 `
  -show_entries "stream=width,height,r_frame_rate" -of csv=p=0:nk=1 $src
$w, $h, $fpsRaw = ($probe -split ",")
$fps = if ($fpsRaw -match "^(\d+)/(\d+)$") { [math]::Round([double]$Matches[1] / [double]$Matches[2], 4) } else { [double]$fpsRaw }
Write-Host "source: ${w}x${h} @ ${fps}fps"

# cmd.exe carries the pipe, NOT PowerShell: a PowerShell pipeline marshals
# objects/text and would corrupt the raw YUVA byte stream.
$ff = "ffmpeg -v error -c:v libvpx-vp9 -i `"$src`" -pix_fmt yuva420p -f rawvideo -"
$xe = "`"$x265`" --input - --input-res ${w}x${h} --fps $fps --input-csp i420 --alpha --crf 24 --preset slow --output `"$raw265`""
Write-Host "`n==> Encoding (this decodes and re-encodes every frame; expect several minutes)"
cmd /c "$ff | $xe"
if ($LASTEXITCODE -ne 0) { throw "x265 encode failed (exit $LASTEXITCODE)" }

Write-Host "`n==> Muxing to MP4 (hvc1)"
# -tag:v hvc1 is required: Safari ignores the 'hev1' flavour in MP4.
# Plain stream copy, so ffmpeg never has to understand the alpha layer.
& ffmpeg -v error -y -r $fps -i $raw265 -c:v copy -tag:v hvc1 $outMp4
if ($LASTEXITCODE -ne 0) { throw "mux failed (exit $LASTEXITCODE)" }

$mb = [math]::Round((Get-Item $outMp4).Length / 1MB, 2)
Write-Host "`n==> Wrote $outMp4 ($mb MB)"
Write-Host @"

Next: verify the alpha actually survived. ffmpeg CANNOT tell you this.
Run the WebKit alpha probe:

    node scripts/verify-hevc-alpha.mjs

A real iPhone remains the final confirmation.
"@
