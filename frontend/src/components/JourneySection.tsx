import { useRef, useState } from "react";
import { openAuth } from "./AuthModal";
import { useLang, type Translatable } from "../i18n";

/**
 * Seção "para todos os momentos da sua jornada" — recriação do padrão de
 * cards de imagem expansíveis (accordion) do site nomadglobal.com.
 * Desktop: accordion (um card expande com título + descrição + CTA).
 * Mobile: carrossel horizontal com swipe + scroll-snap e setas.
 * As imagens são placeholders (picsum) — troque pelas fotos oficiais.
 */
type Step = {
  id: string;
  label: Translatable;
  title: Translatable;
  desc: Translatable;
  cta: Translatable;
  img: string;
  auth?: boolean;
};

const STEPS: Step[] = [
  {
    id: "conta",
    label: { pt: "Conta", en: "Account" },
    title: { pt: "Conta", en: "Account" },
    desc: {
      pt: "Ao fazer a abertura de uma conta no BCS, passa a ter acesso aos serviços essenciais e a desfrutar de uma série de benefícios cuidadosamente projectados para facilitar o seu dia-a-dia.",
      en: "By opening an account at BCS, you gain access to essential services and a range of benefits carefully designed to make your day-to-day life easier.",
    },
    cta: { pt: "Abrir conta", en: "Open account" },
    img: "/conta.jpg",
    auth: true,
  },
  {
    id: "cartoes",
    label: { pt: "Cartões", en: "Cards" },
    title: { pt: "Cartões", en: "Cards" },
    desc: {
      pt: "O Cartão de Débito Multicaixa do BCS oferece acesso instantâneo à sua conta corrente, permitindo realizar diversas operações em todo o território nacional.",
      en: "The BCS Multicaixa Debit Card gives you instant access to your current account, letting you carry out a range of operations across the country.",
    },
    cta: { pt: "Conhecer os cartões", en: "Explore the cards" },
    img: "/cartoes.jpg",
  },
  {
    id: "credito",
    label: { pt: "Crédito", en: "Credit" },
    title: { pt: "Crédito", en: "Credit" },
    desc: {
      pt: "Temos a solução de crédito salário que se adapta à sua vida financeira.",
      en: "We have a salary-backed credit solution that adapts to your financial life.",
    },
    cta: { pt: "Pedir crédito", en: "Apply for credit" },
    img: "/credito.jpg",
  },
];

export default function JourneySection() {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const move = (dir: number) => {
    const track = trackRef.current;
    // Mobile: rola o track diretamente (o track está visível)
    if (track && track.offsetParent !== null) {
      const card = cardRefs.current[0];
      const step = (card?.offsetWidth ?? track.clientWidth) + 16; // + gap
      track.scrollBy({ left: dir * step, behavior: "smooth" });
      return;
    }
    // Desktop: alterna o card ativo do accordion
    setActive((i) => (i + dir + STEPS.length) % STEPS.length);
  };

  // Atualiza o indicador conforme o usuário arrasta no mobile
  const onTrackScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const mid = el.offsetLeft + el.offsetWidth / 2;
      const d = Math.abs(mid - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive((prev) => (prev === best ? prev : best));
  };

  return (
    <section
      className="w-full px-6 py-20 md:py-28"
      style={{ background: "#fcfcfc", color: "#30170a" }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Cabeçalho + setas */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2
            className="max-w-2xl leading-[1.05]"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(30px, 4.5vw, 48px)",
            }}
          >
            {t({ pt: "O que precisa, à distância de", en: "Everything you need, just" })}{" "}
            <span style={{ color: "#b8860b" }}>{t({ pt: "um simples clique", en: "a click away" })}</span>
          </h2>

          <div className="flex shrink-0 gap-3">
            <button
              onClick={() => move(-1)}
              aria-label={t({ pt: "Anterior", en: "Previous" })}
              className="grid h-11 w-11 place-items-center rounded-full border border-black/10 transition-colors hover:bg-black/5 md:h-12 md:w-12"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="#30170a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => move(1)}
              aria-label={t({ pt: "Próximo", en: "Next" })}
              className="grid h-11 w-11 place-items-center rounded-full border border-black/10 transition-colors hover:bg-black/5 md:h-12 md:w-12"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="#30170a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* ---------- Desktop: accordion expansível ---------- */}
        <div
          className="hidden gap-5 md:flex"
          style={{ height: "clamp(380px, 56vh, 540px)" }}
        >
          {STEPS.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setActive(i);
                  if (s.auth) openAuth("signup");
                }}
                onMouseEnter={() => setActive(i)}
                className="group relative overflow-hidden rounded-2xl text-left transition-all duration-500 ease-out"
                style={{ flexGrow: isActive ? 3.4 : 1, flexBasis: 0 }}
              >
                <img
                  src={s.img}
                  alt={t(s.title)}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: isActive
                      ? "linear-gradient(0deg, rgba(26,18,4,0.88) 0%, rgba(26,18,4,0.15) 45%, rgba(26,18,4,0) 70%)"
                      : "linear-gradient(0deg, rgba(26,18,4,0.72) 0%, rgba(26,18,4,0) 55%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  {!isActive && (
                    <span className="block text-lg font-bold text-white drop-shadow [writing-mode:vertical-rl] rotate-180">
                      {t(s.label)}
                    </span>
                  )}
                  {isActive && (
                    <div className="max-w-md">
                      <h3
                        className="text-white"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "clamp(26px, 3vw, 38px)",
                          lineHeight: 1,
                        }}
                      >
                        {t(s.title)}
                      </h3>
                      <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85">
                        {t(s.desc)}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-gold">
                        {t(s.cta)}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14M13 6l6 6-6 6" stroke="#e8c86a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ---------- Mobile: carrossel com swipe ---------- */}
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onClick={() => s.auth && openAuth("signup")}
              className="relative h-[440px] w-[82%] shrink-0 snap-center overflow-hidden rounded-2xl"
            >
              <img
                src={s.img}
                alt={t(s.title)}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(26,18,4,0.9) 0%, rgba(26,18,4,0.2) 48%, rgba(26,18,4,0) 72%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3
                  className="text-white"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "30px",
                    lineHeight: 1,
                  }}
                >
                  {t(s.title)}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-white/85">
                  {t(s.desc)}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-gold">
                  {t(s.cta)}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="#e8c86a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Indicadores (mobile) */}
        <div className="mt-5 flex justify-center gap-2 md:hidden">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              aria-label={`${t({ pt: "Ir para", en: "Go to" })} ${t(s.label)}`}
              onClick={() =>
                cardRefs.current[i]?.scrollIntoView({
                  behavior: "smooth",
                  inline: "center",
                  block: "nearest",
                })
              }
              className="h-2 rounded-full transition-all"
              style={{
                width: i === active ? 22 : 8,
                background: i === active ? "#b8860b" : "rgba(48,23,10,0.25)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
