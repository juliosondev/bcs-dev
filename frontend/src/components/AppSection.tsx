/**
 * Seção do aplicativo mobile — segue o padrão do layout do site
 * (tipografia display, paleta dourada da marca, colunas, cantos
 * arredondados). Fundo dourado escuro para dialogar com o hero.
 * Mockup do celular feito em CSS (sem imagem externa).
 */
import { useLang, type Translatable } from "../i18n";

const FEATURES: Translatable[] = [
  { pt: "Consulte saldos e movimentos das suas contas em tempo real", en: "Check your account balances and transactions in real time" },
  { pt: "Faça transferências e pagamentos de serviços com segurança", en: "Make transfers and service payments securely" },
  { pt: "Simule créditos e depósitos a prazo em poucos toques", en: "Simulate loans and term deposits in a few taps" },
  { pt: "Receba notificações e controle os seus cartões a qualquer hora", en: "Get notifications and manage your cards anytime" },
];

export default function AppSection() {
  const { t } = useLang();
  return (
    <section
      className="w-full overflow-hidden px-6 py-20 md:py-28"
      style={{ background: "var(--gradient-champagne)", color: "#30170a" }}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-16">
        {/* Texto */}
        <div>
          <h2
            className="leading-[1.03]"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(30px, 4.4vw, 50px)",
            }}
          >
            {t({ pt: "O seu banco", en: "Your bank" })}{" "}
            <span style={{ color: "#8a5a12" }}>{t({ pt: "no bolso", en: "in your pocket" })}</span>
          </h2>

          <p
            className="mt-5 max-w-md text-[15px] leading-relaxed"
            style={{ color: "rgba(48,23,10,0.75)" }}
          >
            {t({
              pt: "Com o MyBCS, o aplicativo do Banco BCS, gere as suas contas, transferências, pagamentos e simulações a qualquer hora e em qualquer lugar — de forma simples, rápida e com toda a segurança.",
              en: "With MyBCS, the Banco BCS app, manage your accounts, transfers, payments and simulations anytime, anywhere — simply, quickly and securely.",
            })}
          </p>

          {/* Lista de recursos */}
          <ul className="mt-7 space-y-3">
            {FEATURES.map((f) => (
              <li
                key={f.pt}
                className="flex items-start gap-3 text-sm"
                style={{ color: "rgba(48,23,10,0.85)" }}
              >
                <span
                  className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full"
                  style={{ background: "linear-gradient(135deg, #e8c86a, #b8860b)" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#0a0805" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {t(f)}
              </li>
            ))}
          </ul>

          {/* Badges das lojas */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              className="flex items-center gap-3 rounded-xl px-5 py-3 text-left text-white transition-transform hover:scale-[1.03]"
              style={{ background: "#30170a" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                <path d="M16.4 12.9c0-2 1.6-3 1.7-3-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7s-1.6-.7-2.6-.7c-1.3 0-2.6.8-3.2 2-1.4 2.4-.4 6 1 8 .7 1 1.4 2 2.4 2 .9 0 1.3-.6 2.4-.6s1.4.6 2.4.6 1.7-.9 2.3-1.9c.7-1.1 1-2.1 1-2.2 0 0-1.9-.7-1.9-2.9zM14.7 6.3c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.2 1.1-.5.6-.9 1.5-.8 2.3.8.1 1.7-.4 2.2-1z" />
              </svg>
              <span className="leading-tight">
                <span className="block text-[10px] text-white/60">{t({ pt: "Baixe na", en: "Download on the" })}</span>
                <span className="block text-sm font-bold">App Store</span>
              </span>
            </button>

            <button
              className="flex items-center gap-3 rounded-xl px-5 py-3 text-left text-white transition-transform hover:scale-[1.03]"
              style={{ background: "#30170a" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M3.6 2.3c-.2.2-.3.5-.3.9v17.6c0 .4.1.7.3.9l.1.1L13.5 12 3.7 2.2l-.1.1z" fill="#e8c86a" />
                <path d="M17 15.3l-3.5-3.3 3.5-3.3 4 2.3c1.1.6 1.1 1.7 0 2.3l-4 2z" fill="#d4af37" />
                <path d="M3.7 21.8l9.8-9.8 3.5 3.3-11 6.3c-.9.5-1.7.4-2.3.2z" fill="#b8860b" />
                <path d="M3.7 2.2l13.3 6.5-3.5 3.3L3.7 2.2z" fill="#f4dd94" />
              </svg>
              <span className="leading-tight">
                <span className="block text-[10px] text-white/60">{t({ pt: "Disponível no", en: "Get it on" })}</span>
                <span className="block text-sm font-bold">Google Play</span>
              </span>
            </button>
          </div>
        </div>

        {/* Mockup do celular */}
        <div className="relative flex justify-center md:justify-end">
          {/* Glow dourado */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(232,200,106,0.28) 0%, rgba(232,200,106,0) 62%)",
            }}
          />

          <div
            className="relative w-[270px] rounded-[42px] border border-white/10 p-3 shadow-2xl"
            style={{ background: "#0f0b05" }}
          >
            {/* Notch */}
            <div className="absolute left-1/2 top-3 z-10 h-6 w-28 -translate-x-1/2 rounded-full bg-black" />

            {/* Tela */}
            <div
              className="relative overflow-hidden rounded-[32px]"
              style={{ aspectRatio: "9/19", background: "#14100a" }}
            >
              {/* Cabeçalho do app */}
              <div className="flex items-center justify-between px-5 pt-9">
                <span
                  className="flex items-center gap-1.5 text-lg font-extrabold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <img src="/logo.png" alt="" className="h-6 w-auto" />
                  Banco BCS
                </span>
                <span
                  className="grid h-8 w-8 place-items-center rounded-full"
                  style={{ background: "linear-gradient(135deg, #e8c86a, #b8860b)" }}
                >
                  <img src="/logo.png" alt="" className="h-5 w-auto" />
                </span>
              </div>

              {/* Card destaque */}
              <div className="mx-4 mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #d4af37, #b8860b)" }}>
                <span className="text-[10px] font-semibold text-[#0a0805]/70">{t({ pt: "CONTINUE DE ONDE PAROU", en: "PICK UP WHERE YOU LEFT OFF" })}</span>
                <p className="mt-1 text-sm font-bold text-[#0a0805]">{t({ pt: "Fechamento de vendas", en: "Closing sales" })}</p>
                <div className="mt-3 h-1.5 w-full rounded-full bg-black/20">
                  <div className="h-full w-2/3 rounded-full bg-[#0a0805]" />
                </div>
                <span className="mt-1.5 block text-[10px] text-[#0a0805]/70">{t({ pt: "68% concluído", en: "68% complete" })}</span>
              </div>

              {/* Lista de trilhas */}
              <div className="mt-5 space-y-2.5 px-4">
                {[
                  { pt: "Prospecção ativa", en: "Active prospecting" },
                  { pt: "Negociação avançada", en: "Advanced negotiation" },
                  { pt: "Gestão de time", en: "Team management" },
                ].map((item, i) => (
                  <div
                    key={item.pt}
                    className="flex items-center gap-3 rounded-xl border border-white/5 p-3"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold text-gold"
                      style={{ background: "rgba(232,200,106,0.12)" }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-xs text-white/85">{t(item)}</span>
                  </div>
                ))}
              </div>

              {/* Barra inferior */}
              <div
                className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-white/5 py-3"
                style={{ background: "rgba(10,8,5,0.6)" }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: i === 0 ? "#e8c86a" : "rgba(255,255,255,0.25)" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
