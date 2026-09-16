import BackgroundVideo from "./BackgroundVideo";
import Navbar from "./Navbar";
import { openAuth } from "./AuthModal";

const STATS = [
  { value: "+79 mil", label: ["empresas", "atendidas"] },
  { value: "+1M", label: ["de usuários", "particulares"] },
];

// Taxas de câmbio (valores indicativos, em Kwanza)
const RATES = [
  { code: "USD", flag: "🇺🇸", compra: "900,50", venda: "920,50" },
  { code: "EUR", flag: "🇪🇺", compra: "980,20", venda: "1.002,30" },
  { code: "GBP", flag: "🇬🇧", compra: "1.150,00", venda: "1.175,00" },
  { code: "CHF", flag: "🇨🇭", compra: "1.010,00", venda: "1.035,00" },
  { code: "ZAR", flag: "🇿🇦", compra: "48,50", venda: "50,20" },
  { code: "CNY", flag: "🇨🇳", compra: "124,00", venda: "128,00" },
  { code: "CAD", flag: "🇨🇦", compra: "660,00", venda: "675,00" },
  { code: "JPY", flag: "🇯🇵", compra: "6,05", venda: "6,30" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden font-body text-white">
      {/* Vídeo de fundo (autoplay, silencioso) */}
      <BackgroundVideo />

      {/* Overlay dourado para legibilidade (esquerda + base mais escuras) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(38,27,6,0.92) 0%, rgba(38,27,6,0.35) 38%, rgba(38,27,6,0) 68%), linear-gradient(0deg, rgba(26,18,4,0.92) 0%, rgba(26,18,4,0.15) 38%, rgba(26,18,4,0) 60%)",
        }}
      />

      {/* Navbar com mega-menu (estilo Wise) */}
      <Navbar />

      {/* Conteúdo do hero */}
      <div className="absolute bottom-28 left-0 right-0 z-10 mx-auto max-w-7xl px-6">
        <div className="max-w-md">
          {/* Cards de estatística */}
          <div className="mb-6 grid grid-cols-2 gap-2.5">
            {STATS.map((s) => (
              <div
                key={s.value}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 backdrop-blur-lg"
                style={{ background: "rgba(38,27,6,0.42)" }}
              >
                <span
                  className="text-lg font-extrabold leading-none text-gold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.value}
                </span>
                <span className="text-[10px] leading-tight text-white/75">
                  {s.label[0]}
                  <br />
                  {s.label[1]}
                </span>
              </div>
            ))}
          </div>

          {/* Título */}
          <h1
            className="uppercase text-white"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(32px, 4vw, 56px)",
              lineHeight: 0.95,
            }}
          >
            O futuro é{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #f4dd94, #d4af37)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              dourado
            </span>
          </h1>

          {/* Parágrafo */}
          <p className="mt-4 max-w-md text-[13px] leading-relaxed text-white/80">
            O BCS – Banco de Crédito do Sul, S.A. foi constituído em 2015 e,
            desde então, tem procurado tornar-se uma referência no nosso sistema
            financeiro, conforme delineado no seu Plano Estratégico, e focar a
            sua actividade na gestão personalizada nos segmentos Large Corporate
            e Private.
          </p>

          {/* CTA dourado */}
          <button
            onClick={() => openAuth("signup")}
            className="group mt-6 inline-flex items-center gap-2 rounded-lg text-sm font-bold text-[#0a0805] transition-transform hover:scale-[1.02]"
            style={{
              padding: "12px 32px",
              background: "linear-gradient(135deg, #f4dd94 0%, #d4af37 55%, #b8860b 100%)",
              boxShadow: "0 12px 30px -8px rgba(212,175,55,0.6)",
            }}
          >
            Abrir uma conta
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="transition-transform group-hover:translate-x-1"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="#0a0805"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Marquee de câmbios (compra / venda) */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 py-4 backdrop-blur-md"
        style={{ background: "rgba(26,18,4,0.72)" }}
      >
        <div className="flex w-full overflow-hidden">
          <div
            className="flex shrink-0 items-center gap-10 pr-10"
            style={{ animation: "bcs-marquee 40s linear infinite" }}
          >
            {[...RATES, ...RATES].map((r, i) => (
              <div key={i} className="flex shrink-0 items-center gap-3">
                <span className="text-base">{r.flag}</span>
                <span
                  className="text-base font-bold tracking-wide text-gold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {r.code}
                </span>
                <span className="flex items-center gap-1 text-xs text-white/70">
                  <span className="text-white/45">Compra</span>
                  <span className="font-semibold text-white/90">{r.compra}</span>
                </span>
                <span className="flex items-center gap-1 text-xs text-white/70">
                  <span className="text-white/45">Venda</span>
                  <span className="font-semibold text-white/90">{r.venda}</span>
                </span>
                <span className="ml-1 h-4 w-px bg-white/15" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
