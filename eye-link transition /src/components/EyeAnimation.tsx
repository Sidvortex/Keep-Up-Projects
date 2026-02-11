import { useEffect, useRef, useState } from "react";

interface EyeAnimationProps {
  phase: "idle" | "opening" | "zooming";
  onEyeOpened: () => void;
  onZoomComplete: () => void;
}

export function EyeAnimation({ phase, onEyeOpened, onZoomComplete }: EyeAnimationProps) {
  const [eyeOpenness, setEyeOpenness] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);
  const [irisGlow, setIrisGlow] = useState(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const hasCalledOpened = useRef(false);
  const hasCalledZoom = useRef(false);

  // Eye opening animation
  useEffect(() => {
    if (phase !== "opening") return;
    startTimeRef.current = performance.now();
    hasCalledOpened.current = false;

    const animate = (time: number) => {
      const elapsed = time - startTimeRef.current;
      const duration = 2000;
      const progress = Math.min(elapsed / duration, 1);

      // Eyelid blink effect - slight close then open
      let openness: number;
      if (progress < 0.15) {
        openness = progress / 0.15 * 0.3;
      } else if (progress < 0.25) {
        openness = 0.3 - ((progress - 0.15) / 0.1) * 0.15;
      } else {
        const t = (progress - 0.25) / 0.75;
        openness = 0.15 + easeOutBack(t) * 0.85;
      }

      setEyeOpenness(Math.min(openness, 1));
      setIrisGlow(progress);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        if (!hasCalledOpened.current) {
          hasCalledOpened.current = true;
          onEyeOpened();
        }
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, onEyeOpened]);

  // Zoom into eye animation
  useEffect(() => {
    if (phase !== "zooming") return;
    startTimeRef.current = performance.now();
    hasCalledZoom.current = false;

    const animate = (time: number) => {
      const elapsed = time - startTimeRef.current;
      const duration = 2000;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInCubic(progress);

      setZoomScale(1 + easedProgress * 50);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        if (!hasCalledZoom.current) {
          hasCalledZoom.current = true;
          onZoomComplete();
        }
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, onZoomComplete]);

  function easeOutBack(t: number) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function easeInCubic(t: number) {
    return t * t * t;
  }

  const lidOpenAmount = eyeOpenness * 160;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black"
      style={{
        transform: `scale(${zoomScale})`,
        transition: phase === "zooming" ? "none" : undefined,
      }}
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: `rgba(${100 + Math.random() * 100}, ${150 + Math.random() * 105}, 255, ${0.2 + Math.random() * 0.3})`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: eyeOpenness * 0.8,
            }}
          />
        ))}
      </div>

      <svg
        viewBox="0 0 800 500"
        className="w-full max-w-3xl"
        style={{ filter: `drop-shadow(0 0 ${30 * irisGlow}px rgba(100, 180, 255, ${irisGlow * 0.6}))` }}
      >
        <defs>
          {/* Iris gradient */}
          <radialGradient id="irisGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0a0a0a" />
            <stop offset="30%" stopColor="#1a3a5c" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="70%" stopColor="#1e90ff" />
            <stop offset="85%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e40af" />
          </radialGradient>

          {/* Glow effect */}
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(100, 200, 255, 0.4)" />
            <stop offset="100%" stopColor="rgba(100, 200, 255, 0)" />
          </radialGradient>

          {/* Iris pattern */}
          <radialGradient id="irisPattern" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" />
            <stop offset="25%" stopColor="#0c1929" />
            <stop offset="45%" stopColor="#1a3a6c" />
            <stop offset="60%" stopColor="#2563eb" />
            <stop offset="80%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#1e3a5f" />
          </radialGradient>

          {/* Sclera gradient */}
          <radialGradient id="scleraGradient" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#f8f8f8" />
            <stop offset="60%" stopColor="#e8e8e8" />
            <stop offset="90%" stopColor="#d0d0d0" />
            <stop offset="100%" stopColor="#b0b0b0" />
          </radialGradient>

          {/* Upper eyelid clip */}
          <clipPath id="eyeClip">
            <ellipse
              cx="400"
              cy="250"
              rx="250"
              ry={lidOpenAmount}
            />
          </clipPath>

          {/* Light reflection */}
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
        </defs>

        {/* Eye shape - sclera */}
        <g clipPath="url(#eyeClip)">
          {/* Sclera */}
          <ellipse cx="400" cy="250" rx="250" ry="160" fill="url(#scleraGradient)" />

          {/* Blood vessels */}
          <g opacity={0.15 * eyeOpenness}>
            <path d="M160 230 Q220 240 280 235" stroke="#c44" strokeWidth="0.8" fill="none" />
            <path d="M170 260 Q230 255 290 260" stroke="#c44" strokeWidth="0.6" fill="none" />
            <path d="M520 225 Q570 235 630 230" stroke="#c44" strokeWidth="0.7" fill="none" />
            <path d="M510 265 Q560 260 620 268" stroke="#c44" strokeWidth="0.5" fill="none" />
          </g>

          {/* Iris outer ring */}
          <circle cx="400" cy="250" r="95" fill="#1a2a4a" opacity={eyeOpenness} />

          {/* Iris */}
          <circle cx="400" cy="250" r="90" fill="url(#irisPattern)" opacity={eyeOpenness} />

          {/* Iris fibers */}
          <g opacity={0.3 * eyeOpenness}>
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = (i * 10) * Math.PI / 180;
              const x1 = 400 + Math.cos(angle) * 30;
              const y1 = 250 + Math.sin(angle) * 30;
              const x2 = 400 + Math.cos(angle) * 85;
              const y2 = 250 + Math.sin(angle) * 85;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#4a9eff"
                  strokeWidth="1"
                  opacity={0.3 + Math.random() * 0.4}
                />
              );
            })}
          </g>

          {/* Iris glow ring */}
          <circle
            cx="400"
            cy="250"
            r="88"
            fill="none"
            stroke="rgba(100, 180, 255, 0.3)"
            strokeWidth="3"
            opacity={irisGlow * 0.8}
          />

          {/* Pupil */}
          <circle cx="400" cy="250" r="32" fill="#050505" opacity={eyeOpenness} />

          {/* Pupil depth */}
          <circle cx="400" cy="250" r="28" fill="#020202" opacity={eyeOpenness} />

          {/* Light reflections */}
          <ellipse cx="380" cy="235" rx="12" ry="8" fill="rgba(255,255,255,0.8)" opacity={eyeOpenness} filter="url(#blur)" />
          <ellipse cx="420" cy="260" rx="5" ry="4" fill="rgba(255,255,255,0.4)" opacity={eyeOpenness} filter="url(#blur)" />

          {/* Inner glow */}
          <circle cx="400" cy="250" r="85" fill="url(#glowGradient)" opacity={irisGlow * 0.5} />
        </g>

        {/* Upper eyelid */}
        <path
          d={`M 150 250 Q 275 ${250 - lidOpenAmount * 1.2} 400 ${250 - lidOpenAmount} Q 525 ${250 - lidOpenAmount * 1.2} 650 250`}
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="4"
          opacity={eyeOpenness > 0.05 ? 1 : 0}
        />

        {/* Upper eyelid skin */}
        <path
          d={`M 130 250 Q 275 ${250 - lidOpenAmount * 1.2} 400 ${250 - lidOpenAmount} Q 525 ${250 - lidOpenAmount * 1.2} 670 250 L 670 50 L 130 50 Z`}
          fill="#0a0a0a"
          opacity={eyeOpenness > 0.05 ? 1 : 0}
        />

        {/* Eyelash hints - upper */}
        {eyeOpenness > 0.1 && (
          <g opacity={0.6}>
            {Array.from({ length: 15 }).map((_, i) => {
              const t = (i + 1) / 16;
              const x = 150 + t * 500;
              const baseY = 250 - lidOpenAmount * (1 - Math.pow(2 * t - 1, 2)) * 1.1;
              return (
                <line
                  key={i}
                  x1={x}
                  y1={baseY}
                  x2={x + (t < 0.5 ? -3 : 3)}
                  y2={baseY - 8 - Math.sin(t * Math.PI) * 10}
                  stroke="#222"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        )}

        {/* Lower eyelid */}
        <path
          d={`M 150 250 Q 275 ${250 + lidOpenAmount * 0.8} 400 ${250 + lidOpenAmount * 0.7} Q 525 ${250 + lidOpenAmount * 0.8} 650 250`}
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="3"
          opacity={eyeOpenness > 0.05 ? 1 : 0}
        />

        {/* Lower eyelid skin */}
        <path
          d={`M 130 250 Q 275 ${250 + lidOpenAmount * 0.8} 400 ${250 + lidOpenAmount * 0.7} Q 525 ${250 + lidOpenAmount * 0.8} 670 250 L 670 450 L 130 450 Z`}
          fill="#0a0a0a"
          opacity={eyeOpenness > 0.05 ? 1 : 0}
        />

        {/* Closed eyelid line when fully closed */}
        {eyeOpenness <= 0.05 && (
          <path
            d="M 150 250 Q 400 260 650 250"
            fill="none"
            stroke="#2a2a3e"
            strokeWidth="3"
          />
        )}
      </svg>

      {/* Text hint */}
      <div
        className="absolute bottom-16 text-center transition-opacity duration-1000"
        style={{ opacity: eyeOpenness > 0.8 && phase !== "zooming" ? 1 : 0 }}
      >
        <p className="text-blue-300/60 text-sm tracking-[0.3em] uppercase font-light animate-pulse">
          Entering the portal...
        </p>
      </div>

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {/* CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
