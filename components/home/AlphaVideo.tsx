"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Transparent video for engines that cannot decode one.
 *
 * Safari/iOS can use neither the site's VP9/WebM alpha nor HEVC-with-alpha
 * (ruled out three ways — see BRAND_IDENTITY.md). So alpha is not stored in
 * the file at all: the source is ORDINARY H.264 with the colour image and its
 * alpha matte stacked vertically, and a shader recombines them into real
 * per-pixel alpha.
 *
 * Two encode details are load-bearing:
 *   - Colour must be PREMULTIPLIED, or transparent regions decode WHITE and
 *     compression bleed shows as haloes around every cutout.
 *   - The matte must be in LUMA, which is not chroma-subsampled in 4:2:0 and
 *     so survives compression intact.
 *
 * `onUnsupported` fires when WebGL is missing, so the caller can fall back to
 * the opaque MP4 rather than rendering nothing.
 */

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  // Flip Y so v_uv.y = 0 is the TOP of the frame, matching how the halves
  // were packed. Cheaper and less error-prone than UNPACK_FLIP_Y_WEBGL,
  // which would flip the half-split along with the image.
  v_uv = vec2((a_pos.x + 1.0) * 0.5, 1.0 - (a_pos.y + 1.0) * 0.5);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
uniform sampler2D u_tex;
uniform vec2 u_scale;
uniform vec2 u_offset;
uniform float u_seam;   // one texel of the PACKED frame height
varying vec2 v_uv;
void main() {
  vec2 uv = v_uv * u_scale + u_offset;            // object-fit: cover
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;

  // Clamp each sample away from y = 0.5, where the colour half meets the
  // matte half. At the very bottom of the box uv.y reaches 1.0, so the
  // colour sample lands exactly on that seam and LINEAR filtering blends the
  // WHITE matte into it — which drew a bright line along the bottom edge of
  // the video, right across the top of the stat cards.
  float cy = clamp(uv.y * 0.5,       0.0,          0.5 - u_seam);
  float my = clamp(uv.y * 0.5 + 0.5, 0.5 + u_seam, 1.0);

  vec3 rgb = texture2D(u_tex, vec2(uv.x, cy)).rgb;   // colour
  float a  = texture2D(u_tex, vec2(uv.x, my)).r;     // matte
  gl_FragColor = vec4(rgb, a);   // rgb is already premultiplied
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) throw new Error("createShader failed");
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s) ?? "shader compile failed");
  }
  return s;
}

/**
 * A packed encode plus its FULL pixel dimensions (height includes the matte
 * half). The dimensions are not cosmetic: WebKit uploads a video texture at
 * the element's RENDERED size, so a small off-screen element yields a
 * downscaled, visibly soft texture. Chromium is unaffected either way.
 */
export type PackedSource = { src: string; width: number; height: number };

type Props = {
  /** Packed encode used at `md`+ (full resolution). */
  desktop: PackedSource;
  /** Packed encode used below `md` — smaller file, ample at phone widths. */
  mobile: PackedSource;
  /** Media query deciding which source to load. */
  mobileQuery: string;
  className?: string;
  /** Horizontal object-position (0–1) below `md`, matching the CSS crop. */
  objectPosXMobile: number;
  /** Horizontal object-position (0–1) at `md`+. */
  objectPosX: number;
  /** Fires once the first frame is actually painted. */
  onPainted?: () => void;
  /** Fires if WebGL is unavailable, so the caller can fall back. */
  onUnsupported?: () => void;
};

export function AlphaVideo({
  desktop,
  mobile,
  mobileQuery,
  className,
  objectPosXMobile,
  objectPosX,
  onPainted,
  onUnsupported,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const paintedRef = useRef(false);

  // Resolved before the <video> exists: the browser starts fetching the
  // moment it does, so the URL must be right first time.
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(mobileQuery);
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mobileQuery]);

  useEffect(() => {
    if (isMobile === null) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    // premultipliedAlpha (the default) is correct here: the shader emits
    // colour already multiplied by alpha, exactly as ffmpeg packed it.
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true });
    if (!gl) {
      onUnsupported?.();
      return;
    }

    let prog: WebGLProgram | null = null;
    try {
      prog = gl.createProgram();
      if (!prog) throw new Error("createProgram failed");
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(prog) ?? "link failed");
      }
    } catch {
      onUnsupported?.();
      return;
    }

    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // premultiplied source
    gl.clearColor(0, 0, 0, 0);

    const uScale = gl.getUniformLocation(prog, "u_scale");
    const uOffset = gl.getUniformLocation(prog, "u_offset");
    const uSeam = gl.getUniformLocation(prog, "u_seam");
    const posX = isMobile ? objectPosXMobile : objectPosX;
    const packed = isMobile ? mobile : desktop;
    // Visible frame is the top half of the packed file.
    const frameAspect = packed.width / (packed.height / 2);
    gl.uniform1f(uSeam, 1 / packed.height);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);

      // Reproduces `object-fit: cover` plus `object-position`, so the crop
      // matches what the plain <video> path shows at the same width.
      const boxAspect = canvas.width / canvas.height;
      let sx = 1;
      let sy = 1;
      if (boxAspect > frameAspect) sy = frameAspect / boxAspect;
      else sx = boxAspect / frameAspect;
      gl.uniform2f(uScale, sx, sy);
      gl.uniform2f(uOffset, (1 - sx) * posX, (1 - sy) * 0.5);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // Render only while on screen and visible. The hero sits atop a long
    // page; without this the texture upload runs the entire time someone
    // reads further down, on the mobile devices this path exists for.
    let onScreen = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!onScreen || document.hidden) return;
      if (video.readyState < 2) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!paintedRef.current) {
        paintedRef.current = true;
        onPainted?.();
      }
    };
    raf = requestAnimationFrame(draw);

    video.play().catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      if (prog) gl.deleteProgram(prog);
    };
    // Callbacks excluded on purpose — including them would rebuild the GL
    // context on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, mobileQuery, objectPosX, objectPosXMobile, desktop, mobile]);

  return (
    <>
      <canvas ref={canvasRef} className={className} aria-hidden="true" />
      {/* Off-screen at FULL RESOLUTION — never `1px`/`opacity:0`, never
          merely small. WebKit hands WebGL no texture data at all for an
          element it treats as non-rendering, and uploads at the RENDERED
          size otherwise. `position: fixed` keeps it out of layout. */}
      {isMobile !== null && (
        <video
          ref={videoRef}
          src={isMobile ? mobile.src : desktop.src}
          width={isMobile ? mobile.width : desktop.width}
          height={isMobile ? mobile.height : desktop.height}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          className="pointer-events-none fixed left-[-40000px] top-0"
          style={{
            width: `${isMobile ? mobile.width : desktop.width}px`,
            height: `${isMobile ? mobile.height : desktop.height}px`,
          }}
        />
      )}
    </>
  );
}
