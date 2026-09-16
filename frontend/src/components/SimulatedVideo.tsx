/**
 * "Vídeo simulado" — recria a sensação do vídeo de fundo do hero
 * (palestrante no palco) usando apenas CSS/SVG, em tom DOURADO.
 * Camadas: ambiente + holofotes varrendo + motivo de fundo +
 * silhueta do palestrante + partículas de luz + vinheta/grão.
 */
export default function SimulatedVideo() {
  const particles = Array.from({ length: 14 });

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0805]">
      {/* Camada com zoom contínuo (efeito de vídeo) */}
      <div
        className="absolute inset-0"
        style={{ animation: "bcs-kenburns 22s ease-in-out infinite" }}
      >
        {/* Ambiente dourado sobre fundo escuro */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 65% 30%, #6b4e12 0%, #2a1e08 45%, #0a0805 78%)",
          }}
        />

        {/* Motivo de fundo: seta + palavra, como no original */}
        <svg
          className="absolute -right-10 top-4 h-[85%] w-auto opacity-[0.14]"
          viewBox="0 0 600 600"
          fill="none"
          aria-hidden
        >
          <path
            d="M120 460 L430 150 M430 150 H250 M430 150 V330"
            stroke="#e8c86a"
            strokeWidth="46"
            strokeLinecap="square"
          />
        </svg>
        <div
          className="absolute left-[-4%] top-[8%] select-none whitespace-nowrap"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(90px, 16vw, 240px)",
            lineHeight: 0.82,
            color: "rgba(232,200,106,0.06)",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          MAIOR
          <br />
          VENDEDOR
        </div>

        {/* Holofotes de palco */}
        <div
          className="absolute -left-1/4 -top-1/4 h-[150%] w-[80%]"
          style={{
            background:
              "conic-gradient(from 90deg at 50% 0%, rgba(232,200,106,0) 0deg, rgba(232,200,106,0.28) 20deg, rgba(232,200,106,0) 45deg)",
            filter: "blur(6px)",
            animation: "bcs-spot-a 12s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -right-1/4 -top-1/4 h-[150%] w-[80%]"
          style={{
            background:
              "conic-gradient(from 270deg at 50% 0%, rgba(212,175,55,0) 0deg, rgba(212,175,55,0.22) 18deg, rgba(212,175,55,0) 42deg)",
            filter: "blur(8px)",
            animation: "bcs-spot-b 15s ease-in-out infinite",
          }}
        />

        {/* Glow central pulsante (foco no palestrante) */}
        <div
          className="absolute left-[55%] top-[45%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,200,106,0.35) 0%, rgba(232,200,106,0) 62%)",
            animation: "bcs-glow 7s ease-in-out infinite",
          }}
        />

        {/* Silhueta do palestrante com microfone */}
        <div
          className="absolute bottom-0 left-[50%] h-[78%] w-auto -translate-x-1/2"
          style={{ animation: "bcs-breathe 6s ease-in-out infinite" }}
        >
          <svg
            viewBox="0 0 320 460"
            className="h-full w-auto"
            aria-hidden
            style={{ filter: "drop-shadow(0 0 30px rgba(232,200,106,0.25))" }}
          >
            <defs>
              <linearGradient id="sil" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1a1204" />
                <stop offset="1" stopColor="#050403" />
              </linearGradient>
              <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#e8c86a" stopOpacity="0" />
                <stop offset="1" stopColor="#e8c86a" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {/* corpo/ombros */}
            <path
              d="M60 460 C60 350 90 300 160 300 C230 300 260 350 260 460 Z"
              fill="url(#sil)"
            />
            {/* cabeça */}
            <circle cx="160" cy="235" r="52" fill="url(#sil)" />
            {/* braço levando o microfone ao rosto */}
            <path
              d="M205 330 C245 320 250 275 210 258 L188 250 L182 272 L200 280 C214 286 210 300 196 302 L185 320 Z"
              fill="url(#sil)"
            />
            {/* microfone */}
            <rect x="150" y="238" width="16" height="40" rx="8" fill="#111" />
            <circle cx="158" cy="236" r="12" fill="#1c1c1c" />
            {/* rim light dourada no contorno direito */}
            <path
              d="M260 460 C260 350 230 300 160 300 C205 305 232 355 232 460 Z"
              fill="url(#rim)"
              opacity="0.7"
            />
            <circle cx="200" cy="212" r="52" fill="url(#rim)" opacity="0.25" />
          </svg>
        </div>

        {/* Piso do palco iluminado */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[22%]"
          style={{
            background:
              "linear-gradient(to top, rgba(232,200,106,0.12), transparent)",
          }}
        />
      </div>

      {/* Partículas de luz (fora do zoom para não distorcer) */}
      {particles.map((_, i) => {
        const left = (i * 71) % 100;
        const delay = (i % 7) * 1.1;
        const dur = 6 + (i % 5);
        const size = 3 + (i % 3);
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              bottom: "18%",
              width: size,
              height: size,
              background: "rgba(232,200,106,0.9)",
              boxShadow: "0 0 8px rgba(232,200,106,0.9)",
              animation: `bcs-float ${dur}s linear ${delay}s infinite`,
            }}
          />
        );
      })}

      {/* Vinheta para legibilidade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 30% 40%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
