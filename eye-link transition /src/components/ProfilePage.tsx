import { useState, useEffect, useRef } from "react";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  Mail,
  Youtube,
  BookOpen,
  ExternalLink,
} from "lucide-react";

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  gradient: string;
  glowColor: string;
  delay: number;
}

const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com",
    icon: <Github size={22} />,
    gradient: "from-[#2a0a0a] to-[#1a0505]",
    glowColor: "rgba(200,30,30,0.25)",
    delay: 0,
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com",
    icon: <Linkedin size={22} />,
    gradient: "from-[#200808] to-[#150404]",
    glowColor: "rgba(180,20,20,0.2)",
    delay: 80,
  },
  {
    name: "Twitter / X",
    url: "https://twitter.com",
    icon: <Twitter size={22} />,
    gradient: "from-[#2a0a0a] to-[#180606]",
    glowColor: "rgba(220,40,40,0.2)",
    delay: 160,
  },
  {
    name: "Instagram",
    url: "https://instagram.com",
    icon: <Instagram size={22} />,
    gradient: "from-[#250909] to-[#1a0505]",
    glowColor: "rgba(190,25,25,0.2)",
    delay: 240,
  },
  {
    name: "Blog",
    url: "https://medium.com",
    icon: <BookOpen size={22} />,
    gradient: "from-[#2a0808] to-[#1a0404]",
    glowColor: "rgba(170,20,20,0.2)",
    delay: 320,
  },
  {
    name: "YouTube",
    url: "https://youtube.com",
    icon: <Youtube size={22} />,
    gradient: "from-[#300a0a] to-[#1c0505]",
    glowColor: "rgba(210,35,35,0.25)",
    delay: 400,
  },
  {
    name: "Portfolio",
    url: "https://example.com",
    icon: <Globe size={22} />,
    gradient: "from-[#220808] to-[#160404]",
    glowColor: "rgba(180,25,25,0.2)",
    delay: 480,
  },
  {
    name: "Email",
    url: "mailto:hello@example.com",
    icon: <Mail size={22} />,
    gradient: "from-[#280909] to-[#180505]",
    glowColor: "rgba(200,30,30,0.2)",
    delay: 560,
  },
];

// Floating particle for background
interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    speed: 0.3 + Math.random() * 0.7,
    opacity: 0.1 + Math.random() * 0.4,
    delay: Math.random() * 5,
  }));
}

export function ProfilePage() {
  const [visible, setVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const particlesRef = useRef(createParticles(60));

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setCardsVisible(true), 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-y-auto bg-black">
      {/* Deep red ambient glow spots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse"
          style={{ background: "rgba(80, 5, 5, 0.15)" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] animate-pulse"
          style={{ background: "rgba(60, 3, 3, 0.12)", animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] animate-pulse"
          style={{ background: "rgba(40, 2, 2, 0.1)", animationDelay: "3s" }}
        />
      </div>

      {/* White floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {particlesRef.current.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: 0,
              animation: `particleFloat ${3 + p.speed * 3}s ease-in-out infinite, particleFade ${2 + p.speed * 2}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Scan line effect */}
      <div
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(100,5,5,0.015) 2px, rgba(100,5,5,0.015) 4px)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-16 px-4">
        {/* Profile section */}
        <div
          className="text-center mb-14 transition-all duration-[1200ms] ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(50px)",
          }}
        >
          {/* Avatar */}
          <div className="relative inline-block mb-8">
            {/* Spinning blood-red ring */}
            <div
              className="absolute -inset-3 rounded-full opacity-60 blur-sm"
              style={{
                background: "conic-gradient(from 0deg, #8b1a1a, #2a0000, #cc2222, #1a0000, #8b1a1a)",
                animation: "spinSlow 10s linear infinite",
              }}
            />
            <div
              className="absolute -inset-3 rounded-full opacity-30"
              style={{
                background: "conic-gradient(from 180deg, #8b1a1a, #2a0000, #cc2222, #1a0000, #8b1a1a)",
                animation: "spinSlow 10s linear infinite reverse",
              }}
            />
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#3a0a0a] via-[#1a0303] to-[#0a0000] flex items-center justify-center border-2 border-[#4a1010]/50 shadow-[0_0_40px_rgba(120,10,10,0.3)]">
              {/* Red eye icon inside avatar */}
              <svg viewBox="0 0 60 40" className="w-14 h-10 opacity-80">
                <defs>
                  <radialGradient id="miniIris" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1a0000" />
                    <stop offset="40%" stopColor="#7a1515" />
                    <stop offset="100%" stopColor="#3a0808" />
                  </radialGradient>
                </defs>
                <path
                  d="M 2 20 Q 15 5 30 5 Q 45 5 58 20 Q 45 35 30 35 Q 15 35 2 20 Z"
                  fill="#e8ddd5"
                  stroke="#3a0808"
                  strokeWidth="1"
                />
                <circle cx="30" cy="20" r="10" fill="url(#miniIris)" />
                <circle cx="30" cy="20" r="4" fill="#020000" />
                <ellipse cx="27" cy="17" rx="2.5" ry="1.8" fill="rgba(255,255,255,0.7)" />
              </svg>
            </div>
            {/* Pulse dot */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-3 border-black flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #8b1a1a, #cc2222)" }}>
              <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            John <span className="text-[#cc3333]">Doe</span>
          </h1>
          <p className="text-white/40 text-base md:text-lg font-light max-w-md mx-auto leading-relaxed">
            Full-Stack Developer · Open Source Enthusiast
            <br />
            <span className="text-[#aa3030]/60">Building the future, one commit at a time</span>
          </p>

          {/* Status badge */}
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-[#4a1010]/30 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-[#cc2222] animate-pulse shadow-[0_0_8px_rgba(200,30,30,0.6)]" />
            <span className="text-sm text-white/40">Available for opportunities</span>
          </div>
        </div>

        {/* Social links */}
        <div className="w-full max-w-lg space-y-3">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block w-full"
              style={{
                opacity: cardsVisible ? 1 : 0,
                transform: cardsVisible ? "translateY(0) scale(1)" : "translateY(25px) scale(0.97)",
                transition: `all 700ms cubic-bezier(0.16, 1, 0.3, 1)`,
                transitionDelay: `${link.delay}ms`,
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                style={{ background: link.glowColor }}
              />

              <div className={`relative flex items-center gap-4 px-5 py-4 rounded-xl bg-gradient-to-r ${link.gradient} border border-[#3a0a0a]/40 group-hover:border-[#6a1515]/50 transition-all duration-400 group-hover:shadow-[0_0_25px_rgba(120,10,10,0.15)]`}>
                {/* Icon container */}
                <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-[#1a0505] border border-[#4a1010]/30 flex items-center justify-center text-[#cc4444] group-hover:text-[#ff5555] group-hover:border-[#6a1515]/50 group-hover:shadow-[0_0_12px_rgba(180,20,20,0.2)] transition-all duration-400 group-hover:scale-110">
                  {link.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white/90 font-semibold text-base group-hover:text-white transition-colors duration-300">
                    {link.name}
                  </h3>
                  <p className="text-white/20 text-xs truncate group-hover:text-white/30 transition-colors duration-300">
                    {link.url.replace(/^https?:\/\//, "").replace(/^mailto:/, "")}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 text-white/15 group-hover:text-[#cc4444] transition-all duration-300 group-hover:translate-x-1">
                  <ExternalLink size={18} />
                </div>

                {/* Right edge accent line */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-0 group-hover:h-8 bg-gradient-to-b from-transparent via-[#cc2222]/50 to-transparent transition-all duration-500 rounded-full" />
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div
          className="mt-16 text-center"
          style={{
            opacity: cardsVisible ? 1 : 0,
            transition: "opacity 1000ms ease",
            transitionDelay: "800ms",
          }}
        >
          <div className="h-px w-24 mx-auto mb-5"
            style={{ background: "linear-gradient(to right, transparent, rgba(140,20,20,0.3), transparent)" }} />
          <p className="text-white/10 text-xs tracking-[0.2em] uppercase">
            The eye sees all
          </p>
        </div>
      </div>

      <style>{`
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes particleFade {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.45; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
