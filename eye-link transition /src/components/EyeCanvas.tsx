import { useEffect, useRef } from "react";

interface Props {
  phase: "idle" | "opening" | "dolby";
  onEyeOpened: () => void;
  onZoomComplete: () => void;
}

function easeOutQuart(t: number) { return 1 - Math.pow(1 - t, 4); }
function easeInQuad(t: number) { return t * t; }
function easeInCubic(t: number) { return t * t * t; }
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }

function bezierPt(p0: number, p1: number, p2: number, p3: number, t: number) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; ph: number; spd: number;
}

export function EyeCanvas({ phase, onEyeOpened, onZoomComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    phase, openProgress: 0, dolbyProgress: 0,
    openStart: 0, dolbyStart: 0,
    firedOpen: false, firedZoom: false,
    particles: [] as Particle[],
    irisAngle: 0,
    // Pre-computed vein paths for consistency
    veins: [] as { pts: [number, number][]; w: number; branches: { from: number; pts: [number, number][]; w: number }[] }[],
  });

  useEffect(() => {
    const s = state.current;
    s.phase = phase;
    if (phase === "opening") { s.openStart = performance.now(); s.firedOpen = false; }
    if (phase === "dolby") { s.dolbyStart = performance.now(); s.firedZoom = false; }
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false })!;
    let raf = 0;

    // Init particles
    const particles: Particle[] = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * 2 - 1, y: Math.random() * 2 - 1,
        vx: (Math.random() - 0.5) * 0.0004, vy: (Math.random() - 0.5) * 0.0004,
        size: 0.8 + Math.random() * 2.2,
        opacity: 0.12 + Math.random() * 0.45,
        ph: Math.random() * Math.PI * 2,
        spd: 0.4 + Math.random() * 1.2,
      });
    }
    state.current.particles = particles;

    // Pre-generate veins with branches
    const veins: typeof state.current.veins = [];
    const veinSeeds = [
      // Left
      { start: [-0.92, -0.04], mid: [-0.6, -0.13], end: [-0.35, -0.07], w: 1.0 },
      { start: [-0.95, 0.06], mid: [-0.7, 0.14], end: [-0.42, 0.09], w: 0.8 },
      { start: [-0.88, -0.18], mid: [-0.58, -0.24], end: [-0.35, -0.15], w: 0.7 },
      { start: [-0.9, 0.2], mid: [-0.62, 0.26], end: [-0.4, 0.17], w: 0.6 },
      { start: [-0.87, -0.1], mid: [-0.5, -0.17], end: [-0.36, -0.11], w: 0.5 },
      // Right
      { start: [0.92, -0.05], mid: [0.62, -0.15], end: [0.38, -0.08], w: 0.9 },
      { start: [0.95, 0.08], mid: [0.7, 0.17], end: [0.45, 0.1], w: 0.7 },
      { start: [0.88, -0.2], mid: [0.6, -0.25], end: [0.38, -0.16], w: 0.6 },
      { start: [0.9, 0.22], mid: [0.65, 0.27], end: [0.42, 0.18], w: 0.5 },
      { start: [0.87, 0.02], mid: [0.55, -0.05], end: [0.4, -0.02], w: 0.4 },
    ];
    for (const vs of veinSeeds) {
      const branches: typeof veins[0]["branches"] = [];
      // 1-2 branches per vein
      const bc = 1 + Math.floor(Math.random() * 2);
      for (let b = 0; b < bc; b++) {
        const fromT = 0.3 + Math.random() * 0.4;
        const fromX = lerp(vs.start[0], vs.end[0], fromT);
        const fromY = lerp(vs.start[1], vs.end[1], fromT);
        const dir = vs.start[0] < 0 ? 1 : -1;
        branches.push({
          from: fromT,
          pts: [
            [fromX, fromY],
            [fromX + dir * (0.05 + Math.random() * 0.08), fromY + (Math.random() - 0.5) * 0.12],
          ],
          w: vs.w * 0.5,
        });
      }
      veins.push({
        pts: [vs.start as [number, number], vs.mid as [number, number], vs.end as [number, number]],
        w: vs.w,
        branches,
      });
    }
    state.current.veins = veins;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2 for perf
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = window.innerWidth + "px";
      canvas!.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    // ——— Drawing ———

    function drawParticles(w: number, h: number, time: number, alpha: number) {
      if (alpha < 0.01) return;
      const pts = state.current.particles;
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -1) p.x = 1; if (p.x > 1) p.x = -1;
        if (p.y < -1) p.y = 1; if (p.y > 1) p.y = -1;
        const flicker = 0.5 + 0.5 * Math.sin(time * 0.001 * p.spd + p.ph);
        const a = p.opacity * flicker * alpha;
        if (a < 0.01) continue;
        const sx = (p.x * 0.5 + 0.5) * w;
        const sy = (p.y * 0.5 + 0.5) * h;
        ctx.beginPath();
        ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      }
    }

    function drawSkinTexture(ecx: number, ecy: number, eyeW: number, _eyeH: number, openness: number) {
      // Subtle skin around eye (dark with slight warmth)
      if (openness < 0.05) return;
      const skinR = eyeW * 1.6;
      const grad = ctx.createRadialGradient(ecx, ecy, eyeW * 0.8, ecx, ecy, skinR);
      grad.addColorStop(0, "rgba(18, 6, 4, 0.4)");
      grad.addColorStop(0.5, "rgba(12, 3, 2, 0.2)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(ecx - skinR, ecy - skinR, skinR * 2, skinR * 2);
    }

    function drawEye(
      cx: number, cy: number, eyeW: number, eyeH: number,
      openness: number, time: number, fovMul: number
    ) {
      const effectiveH = eyeH * fovMul;
      const lidOpen = openness * effectiveH;

      // Micro-saccades
      const microX = Math.sin(time * 0.0007) * 1.2 * openness + Math.sin(time * 0.003) * 0.3;
      const microY = Math.cos(time * 0.0011) * 0.8 * openness + Math.cos(time * 0.0025) * 0.2;
      const ecx = cx + microX;
      const ecy = cy + microY;

      const upperCurve = lidOpen * 1.15;
      const lowerCurve = lidOpen * 0.6;

      // Skin texture behind
      drawSkinTexture(ecx, ecy, eyeW, effectiveH, openness);

      // ——— Clip to eye shape ———
      ctx.save();
      ctx.beginPath();
      // Inner corners are slightly rounded
      ctx.moveTo(ecx - eyeW, ecy);
      ctx.bezierCurveTo(
        ecx - eyeW * 0.55, ecy - upperCurve * 1.05,
        ecx + eyeW * 0.55, ecy - upperCurve * 1.05,
        ecx + eyeW, ecy
      );
      ctx.bezierCurveTo(
        ecx + eyeW * 0.55, ecy + lowerCurve * 1.05,
        ecx - eyeW * 0.55, ecy + lowerCurve * 1.05,
        ecx - eyeW, ecy
      );
      ctx.closePath();
      ctx.clip();

      // ——— Sclera ———
      const scleraGrad = ctx.createRadialGradient(ecx - eyeW * 0.05, ecy - eyeH * 0.05, 0, ecx, ecy, eyeW * 1.1);
      scleraGrad.addColorStop(0, "#f0e8e2");
      scleraGrad.addColorStop(0.3, "#ebe0d8");
      scleraGrad.addColorStop(0.6, "#ddd0c5");
      scleraGrad.addColorStop(0.85, "#c8b5a8");
      scleraGrad.addColorStop(1, "#a08a78");
      ctx.fillStyle = scleraGrad;
      ctx.fillRect(ecx - eyeW - 5, ecy - effectiveH - 5, eyeW * 2 + 10, effectiveH * 2 + 10);

      // ——— Blood vessels with branches ———
      if (openness > 0.15) {
        const vAlpha = 0.18 * clamp((openness - 0.15) / 0.3, 0, 1);
        ctx.globalAlpha = vAlpha;
        for (const vein of state.current.veins) {
          // Main vein
          ctx.beginPath();
          ctx.strokeStyle = "#7a1818";
          ctx.lineWidth = vein.w;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.moveTo(ecx + vein.pts[0][0] * eyeW, ecy + vein.pts[0][1] * effectiveH);
          if (vein.pts.length === 3) {
            ctx.quadraticCurveTo(
              ecx + vein.pts[1][0] * eyeW, ecy + vein.pts[1][1] * effectiveH,
              ecx + vein.pts[2][0] * eyeW, ecy + vein.pts[2][1] * effectiveH
            );
          }
          ctx.stroke();

          // Branches
          for (const br of vein.branches) {
            ctx.beginPath();
            ctx.strokeStyle = "#6a1414";
            ctx.lineWidth = br.w;
            ctx.moveTo(ecx + br.pts[0][0] * eyeW, ecy + br.pts[0][1] * effectiveH);
            ctx.lineTo(ecx + br.pts[1][0] * eyeW, ecy + br.pts[1][1] * effectiveH);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      }

      // ——— Iris ———
      const irisR = eyeW * 0.33;
      const pupilBaseR = irisR * 0.36;

      // Limbal ring (dark outer ring of iris)
      ctx.beginPath();
      ctx.arc(ecx, ecy, irisR + 3, 0, Math.PI * 2);
      ctx.fillStyle = "#0f0000";
      ctx.fill();

      // Iris base
      const irisGrad = ctx.createRadialGradient(ecx, ecy, pupilBaseR * 0.6, ecx, ecy, irisR);
      irisGrad.addColorStop(0, "#1c0000");
      irisGrad.addColorStop(0.15, "#3a0808");
      irisGrad.addColorStop(0.3, "#5a1010");
      irisGrad.addColorStop(0.45, "#8b1a1a");
      irisGrad.addColorStop(0.6, "#9a2020");
      irisGrad.addColorStop(0.75, "#7a1515");
      irisGrad.addColorStop(0.88, "#4a0a0a");
      irisGrad.addColorStop(1, "#200404");
      ctx.beginPath();
      ctx.arc(ecx, ecy, irisR, 0, Math.PI * 2);
      ctx.fillStyle = irisGrad;
      ctx.fill();

      // Iris stroma fibers (radial)
      state.current.irisAngle += 0.0002;
      const fiberCount = 90;
      for (let i = 0; i < fiberCount; i++) {
        const angle = (i / fiberCount) * Math.PI * 2 + state.current.irisAngle;
        const innerR = pupilBaseR + 3;
        const outerR = irisR - 2;
        const wobble = Math.sin(angle * 7 + time * 0.0008) * 1.5;
        const wobble2 = Math.cos(angle * 4 + time * 0.0006) * 1;

        ctx.beginPath();
        ctx.moveTo(ecx + Math.cos(angle) * innerR, ecy + Math.sin(angle) * innerR);
        // Wavy fiber
        const midR = (innerR + outerR) / 2;
        ctx.quadraticCurveTo(
          ecx + Math.cos(angle + 0.02) * (midR + wobble),
          ecy + Math.sin(angle + 0.02) * (midR + wobble),
          ecx + Math.cos(angle) * (outerR + wobble2),
          ecy + Math.sin(angle) * (outerR + wobble2)
        );
        const fa = 0.06 + Math.sin(angle * 5 + time * 0.0004) * 0.03;
        ctx.strokeStyle = `rgba(220, 80, 60, ${fa})`;
        ctx.lineWidth = 0.6 + Math.sin(angle * 3) * 0.3;
        ctx.stroke();
      }

      // Collarette ring
      ctx.beginPath();
      ctx.arc(ecx, ecy, irisR * 0.52, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(160, 50, 40, 0.2)";
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Furrows / crypts
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2 + 0.2;
        const dist = irisR * (0.45 + Math.sin(i * 3.7) * 0.18);
        const sr = 1.5 + Math.sin(i * 2.3) * 1;
        ctx.beginPath();
        ctx.arc(ecx + Math.cos(angle) * dist, ecy + Math.sin(angle) * dist, sr, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(15, 0, 0, 0.25)";
        ctx.fill();
      }

      // Bright accent streaks in iris
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + 1.1;
        const r1 = irisR * 0.4;
        const r2 = irisR * 0.85;
        ctx.beginPath();
        ctx.moveTo(ecx + Math.cos(angle) * r1, ecy + Math.sin(angle) * r1);
        ctx.lineTo(ecx + Math.cos(angle + 0.03) * r2, ecy + Math.sin(angle + 0.03) * r2);
        ctx.strokeStyle = "rgba(200, 90, 60, 0.06)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Pulsing outer glow
      const gPulse = 0.12 + Math.sin(time * 0.002) * 0.06;
      ctx.beginPath();
      ctx.arc(ecx, ecy, irisR + 1, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(180, 25, 25, ${gPulse * openness})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // ——— Pupil ———
      const pupilDilate = 1 + Math.sin(time * 0.0012) * 0.04;
      const pr = pupilBaseR * pupilDilate;

      // Pupil shadow spread
      const pShadow = ctx.createRadialGradient(ecx, ecy, pr * 0.7, ecx, ecy, pr + 4);
      pShadow.addColorStop(0, "#010000");
      pShadow.addColorStop(0.8, "#020000");
      pShadow.addColorStop(1, "rgba(5,0,0,0)");
      ctx.beginPath();
      ctx.arc(ecx, ecy, pr + 4, 0, Math.PI * 2);
      ctx.fillStyle = pShadow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(ecx, ecy, pr, 0, Math.PI * 2);
      ctx.fillStyle = "#020000";
      ctx.fill();

      // ——— Reflections ———
      // Main catchlight — window shape
      ctx.save();
      ctx.beginPath();
      const rlx = ecx - irisR * 0.24;
      const rly = ecy - irisR * 0.28;
      const rlw = irisR * 0.22;
      const rlh = irisR * 0.15;
      ctx.translate(rlx, rly);
      ctx.rotate(-0.15);
      // Rounded rectangle for window-like catchlight
      const rr = 2;
      ctx.moveTo(-rlw / 2 + rr, -rlh / 2);
      ctx.lineTo(rlw / 2 - rr, -rlh / 2);
      ctx.quadraticCurveTo(rlw / 2, -rlh / 2, rlw / 2, -rlh / 2 + rr);
      ctx.lineTo(rlw / 2, rlh / 2 - rr);
      ctx.quadraticCurveTo(rlw / 2, rlh / 2, rlw / 2 - rr, rlh / 2);
      ctx.lineTo(-rlw / 2 + rr, rlh / 2);
      ctx.quadraticCurveTo(-rlw / 2, rlh / 2, -rlw / 2, rlh / 2 - rr);
      ctx.lineTo(-rlw / 2, -rlh / 2 + rr);
      ctx.quadraticCurveTo(-rlw / 2, -rlh / 2, -rlw / 2 + rr, -rlh / 2);
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 255, 255, ${0.82 * openness})`;
      ctx.fill();
      ctx.restore();

      // Secondary reflection
      ctx.beginPath();
      ctx.ellipse(ecx + irisR * 0.2, ecy + irisR * 0.22, irisR * 0.055, irisR * 0.04, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * openness})`;
      ctx.fill();

      // Tiny sparkle
      ctx.beginPath();
      ctx.arc(ecx - irisR * 0.1, ecy - irisR * 0.38, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.45 * openness})`;
      ctx.fill();

      // Limbal ring shadow (where iris meets sclera)
      ctx.beginPath();
      ctx.arc(ecx, ecy, irisR + 2, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(8, 0, 0, 0.55)";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.restore(); // Remove clip

      // ——— Eyelid edges & details ———
      if (openness > 0.04) {
        // Waterline (pinkish inner rim)
        // Upper waterline
        ctx.beginPath();
        ctx.moveTo(ecx - eyeW + 5, ecy);
        ctx.bezierCurveTo(
          ecx - eyeW * 0.5, ecy - upperCurve + 1.5,
          ecx + eyeW * 0.5, ecy - upperCurve + 1.5,
          ecx + eyeW - 5, ecy
        );
        ctx.strokeStyle = `rgba(120, 55, 50, ${0.3 * openness})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Lower waterline
        ctx.beginPath();
        ctx.moveTo(ecx - eyeW + 5, ecy);
        ctx.bezierCurveTo(
          ecx - eyeW * 0.5, ecy + lowerCurve - 1,
          ecx + eyeW * 0.5, ecy + lowerCurve - 1,
          ecx + eyeW - 5, ecy
        );
        ctx.strokeStyle = `rgba(110, 50, 45, ${0.25 * openness})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Upper lid line (lash line)
        ctx.beginPath();
        ctx.moveTo(ecx - eyeW, ecy);
        ctx.bezierCurveTo(
          ecx - eyeW * 0.55, ecy - upperCurve * 1.05,
          ecx + eyeW * 0.55, ecy - upperCurve * 1.05,
          ecx + eyeW, ecy
        );
        ctx.strokeStyle = "rgba(25, 3, 3, 0.9)";
        ctx.lineWidth = 2.8;
        ctx.stroke();

        // Upper lid crease
        ctx.beginPath();
        ctx.moveTo(ecx - eyeW * 0.88, ecy - 2);
        ctx.bezierCurveTo(
          ecx - eyeW * 0.4, ecy - upperCurve - 16,
          ecx + eyeW * 0.4, ecy - upperCurve - 16,
          ecx + eyeW * 0.88, ecy - 2
        );
        ctx.strokeStyle = "rgba(20, 2, 2, 0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Lower lid line
        ctx.beginPath();
        ctx.moveTo(ecx - eyeW, ecy);
        ctx.bezierCurveTo(
          ecx - eyeW * 0.55, ecy + lowerCurve * 1.05,
          ecx + eyeW * 0.55, ecy + lowerCurve * 1.05,
          ecx + eyeW, ecy
        );
        ctx.strokeStyle = "rgba(30, 4, 4, 0.5)";
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // ——— Upper eyelashes (layered, curved) ———
        const lashCount = 35;
        for (let i = 0; i < lashCount; i++) {
          const t = (i + 0.5) / lashCount;
          const bx = bezierPt(ecx - eyeW, ecx - eyeW * 0.55, ecx + eyeW * 0.55, ecx + eyeW, t);
          const by = bezierPt(ecy, ecy - upperCurve * 1.05, ecy - upperCurve * 1.05, ecy, t);

          const fanAngle = -Math.PI / 2 + (t - 0.5) * 0.9;
          const lashLen = 7 + Math.sin(t * Math.PI) * 14;
          const curveBias = (t - 0.5) * 18;

          // Outer lash (darker, longer)
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.quadraticCurveTo(
            bx + Math.cos(fanAngle) * lashLen * 0.55 + curveBias,
            by + Math.sin(fanAngle) * lashLen * 0.55,
            bx + Math.cos(fanAngle) * lashLen + curveBias * 0.6,
            by + Math.sin(fanAngle) * lashLen
          );
          ctx.strokeStyle = `rgba(8, 1, 1, ${0.55 + Math.sin(t * Math.PI) * 0.3})`;
          ctx.lineWidth = 1.2 + Math.sin(t * Math.PI) * 0.6;
          ctx.lineCap = "round";
          ctx.stroke();

          // Inner lash (shorter, thinner — every other)
          if (i % 2 === 0) {
            ctx.beginPath();
            ctx.moveTo(bx, by);
            const shortLen = lashLen * 0.6;
            ctx.quadraticCurveTo(
              bx + Math.cos(fanAngle - 0.1) * shortLen * 0.5 + curveBias * 0.7,
              by + Math.sin(fanAngle - 0.1) * shortLen * 0.5,
              bx + Math.cos(fanAngle - 0.1) * shortLen + curveBias * 0.4,
              by + Math.sin(fanAngle - 0.1) * shortLen
            );
            ctx.strokeStyle = "rgba(12, 2, 2, 0.35)";
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        // Lower lashes
        for (let i = 0; i < 18; i++) {
          const t = (i + 0.5) / 18;
          if (t < 0.08 || t > 0.92) continue; // skip corners
          const bx = bezierPt(ecx - eyeW, ecx - eyeW * 0.55, ecx + eyeW * 0.55, ecx + eyeW, t);
          const by = bezierPt(ecy, ecy + lowerCurve * 1.05, ecy + lowerCurve * 1.05, ecy, t);
          const angle = Math.PI / 2 + (t - 0.5) * 0.45;
          const lashLen = 3 + Math.sin(t * Math.PI) * 5;

          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(bx + Math.cos(angle) * lashLen, by + Math.sin(angle) * lashLen);
          ctx.strokeStyle = "rgba(10, 2, 2, 0.3)";
          ctx.lineWidth = 0.7;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Inner corner (caruncle — pinkish)
        const carX = ecx - eyeW + 5;
        const carGrad = ctx.createRadialGradient(carX, ecy, 0, carX, ecy, 8);
        carGrad.addColorStop(0, `rgba(160, 80, 70, ${0.3 * openness})`);
        carGrad.addColorStop(1, "rgba(160, 80, 70, 0)");
        ctx.fillStyle = carGrad;
        ctx.beginPath();
        ctx.arc(carX, ecy, 8, 0, Math.PI * 2);
        ctx.fill();

        // Shadow under upper lid (on the eyeball)
        const shadowGrad = ctx.createLinearGradient(ecx, ecy - upperCurve, ecx, ecy - upperCurve + 15);
        shadowGrad.addColorStop(0, `rgba(0, 0, 0, ${0.2 * openness})`);
        shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(ecx - eyeW, ecy);
        ctx.bezierCurveTo(ecx - eyeW * 0.55, ecy - upperCurve * 1.05, ecx + eyeW * 0.55, ecy - upperCurve * 1.05, ecx + eyeW, ecy);
        ctx.bezierCurveTo(ecx + eyeW * 0.55, ecy + lowerCurve * 1.05, ecx - eyeW * 0.55, ecy + lowerCurve * 1.05, ecx - eyeW, ecy);
        ctx.clip();
        ctx.fillStyle = shadowGrad;
        ctx.fillRect(ecx - eyeW, ecy - upperCurve, eyeW * 2, 20);
        ctx.restore();
      }

      // Closed slit
      if (openness <= 0.04) {
        ctx.beginPath();
        ctx.moveTo(ecx - eyeW, ecy);
        ctx.bezierCurveTo(ecx - eyeW * 0.3, ecy + 3, ecx + eyeW * 0.3, ecy + 3, ecx + eyeW, ecy);
        ctx.strokeStyle = "rgba(50, 8, 8, 0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    function drawVignette(w: number, h: number, intensity: number) {
      const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.18, w / 2, h / 2, Math.max(w, h) * 0.65);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(0.6, `rgba(0,0,0,${0.35 * intensity})`);
      grad.addColorStop(1, `rgba(0,0,0,${0.9 * intensity})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    function drawRedAmbient(cx: number, cy: number, r: number, alpha: number) {
      if (alpha < 0.01) return;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, `rgba(100, 8, 8, ${alpha * 0.12})`);
      grad.addColorStop(0.4, `rgba(60, 4, 4, ${alpha * 0.06})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }

    // ——— Main loop ———
    function frame(time: number) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const s = state.current;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);

      // ——— Update progress ———
      if (s.phase === "opening") {
        const elapsed = time - s.openStart;
        const duration = 2600;
        const raw = clamp(elapsed / duration, 0, 1);

        let openness: number;
        if (raw < 0.08) {
          // First twitch
          openness = easeOutQuart(raw / 0.08) * 0.2;
        } else if (raw < 0.14) {
          // Reflex close
          openness = lerp(0.2, 0.04, easeInQuad((raw - 0.08) / 0.06));
        } else if (raw < 0.22) {
          // Second small twitch
          openness = lerp(0.04, 0.12, easeOutQuart((raw - 0.14) / 0.08));
        } else if (raw < 0.28) {
          // Brief close again
          openness = lerp(0.12, 0.06, easeInQuad((raw - 0.22) / 0.06));
        } else {
          // Final smooth open
          openness = lerp(0.06, 1, easeInOutCubic((raw - 0.28) / 0.72));
        }
        s.openProgress = clamp(openness, 0, 1);

        if (raw >= 1 && !s.firedOpen) {
          s.firedOpen = true;
          onEyeOpened();
        }
      }

      if (s.phase === "dolby") {
        const elapsed = time - s.dolbyStart;
        const duration = 3200;
        const raw = clamp(elapsed / duration, 0, 1);

        // Dolby zoom: starts slow, accelerates into pupil
        // Use a custom curve that holds briefly then accelerates
        let dp: number;
        if (raw < 0.15) {
          // Brief hold / subtle dolly back
          dp = easeInQuad(raw / 0.15) * 0.02;
        } else {
          // Accelerate into the pupil
          dp = 0.02 + easeInCubic((raw - 0.15) / 0.85) * 0.98;
        }
        s.dolbyProgress = dp;

        if (raw >= 1 && !s.firedZoom) {
          s.firedZoom = true;
          onZoomComplete();
        }
      }

      const dolbyP = s.dolbyProgress;

      // Dolby zoom: camera zooms in while FOV widens (counter-zoom / vertigo)
      // This means the eye stays roughly same apparent size initially but perspective distorts
      const fovMul = 1 + dolbyP * 0.6;
      const zoomScale = 1 + dolbyP * 80;

      // Red flash at climax
      const redFlash = dolbyP > 0.3 && dolbyP < 0.6 ? Math.sin((dolbyP - 0.3) / 0.3 * Math.PI) * 0.08 : 0;

      const eyeW = Math.min(w, h) * 0.3;
      const eyeH = eyeW * 0.48;
      const cx = w / 2;
      const cy = h / 2;

      // Dolby zoom transform
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(zoomScale, zoomScale);
      ctx.translate(-cx, -cy);

      // Particles
      drawParticles(w, h, time, s.openProgress * (1 - dolbyP * 0.9));

      // Red ambient
      drawRedAmbient(cx, cy, eyeW * 2.8, s.openProgress);

      // The eye
      drawEye(cx, cy, eyeW, eyeH, s.openProgress, time, fovMul);

      ctx.restore();

      // Vignette
      drawVignette(w, h, 1);

      // Red flash overlay during dolby climax
      if (redFlash > 0) {
        ctx.fillStyle = `rgba(80, 0, 0, ${redFlash})`;
        ctx.fillRect(0, 0, w, h);
      }

      // Fade to black at end of dolby
      const fadeOut = dolbyP > 0.65 ? (dolbyP - 0.65) / 0.35 : 0;
      if (fadeOut > 0) {
        ctx.fillStyle = `rgba(0,0,0,${fadeOut})`;
        ctx.fillRect(0, 0, w, h);
      }

      // Scan lines (subtle)
      if (s.openProgress > 0.4 && dolbyP < 0.8) {
        const scanAlpha = 0.025 * s.openProgress * (1 - dolbyP);
        const scanY = (time * 0.04) % h;
        ctx.fillStyle = `rgba(80, 3, 3, ${scanAlpha})`;
        ctx.fillRect(0, scanY - 1, w, 2);
        ctx.fillRect(0, (scanY + h * 0.4) % h - 0.5, w, 1);
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [onEyeOpened, onZoomComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
