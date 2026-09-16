import { useRef, useState } from "react";

/**
 * Seção "Acompanhamos o seu ritmo" — recriação do slider de duas colunas do
 * site nomadglobal.com. Título fixo à esquerda; subtítulo + descrição + CTA e
 * imagem à direita mudam por slide, com transição fade/slide. Setas circulares
 * e contador "X de N" no canto inferior. No mobile também responde a swipe.
 * Imagens são placeholders (picsum) — troque pelas fotos oficiais.
 */
const SLIDES = [
  {
    title: "Mais do que um cartão, uma porta para o mundo",
    desc: "Ao aderir ao cartão BCS Mastercard Gold, pode usufruir de serviços exclusivos e experiências únicas e memoráveis.",
    cta: "Conhecer o cartão Gold",
    img: "/card-front.png",
    front: "/card-front.png",
    back: "/card-back.png",
    contain: true,
  },
  {
    title: "Mais do que um cartão, um reconhecimento a nível mundial",
    desc: "Ao aderir ao cartão BCS Mastercard World, pode desfrutar de experiências únicas, em todo o mundo.",
    cta: "Conhecer o cartão World",
    img: "/card2-front.png",
    front: "/card2-front.png",
    back: "/card2-back.png",
    contain: true,
  },
  {
    title: "Mais do que um cartão, flexibilidade e tranquilidade garantida",
    desc: "Ao aderir ao cartão Pré-pago Sublime, tem como garantido um meio de pagamento conveniente e seguro para as suas viagens ou compras online.",
    cta: "Conhecer o Pré-pago",
    img: "/card3-front.svg",
    contain: true,
  },
];

export default function RhythmSlider() {
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const s = SLIDES[index];

  const go = (dir: number) =>
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <section
      className="w-full px-6 py-20 md:py-28"
      style={{ background: "#fcfcfc", color: "#30170a" }}
    >
      <div
        className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-14"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Coluna de texto */}
        <div>
          <h2
            className="leading-[1.05]"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(30px, 4.2vw, 48px)",
            }}
          >
            Conheça os nossos{" "}
            <span style={{ color: "#b8860b" }}>cartões</span>
          </h2>

          {/* Conteúdo do slide (anima ao trocar) */}
          <div key={index} style={{ animation: "bcs-slide-in 0.5s ease-out" }}>
            <h3
              className="mt-8"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(20px, 2.4vw, 26px)",
              }}
            >
              {s.title}
            </h3>
            <p
              className="mt-3 max-w-md text-[15px] leading-relaxed"
              style={{ color: "rgba(48,23,10,0.75)" }}
            >
              {s.desc}
            </p>
            <button
              className="mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
              style={{ background: "#30170a" }}
            >
              {s.cta}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="#e8c86a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Controles: setas + contador */}
          <div className="mt-10 flex items-center gap-4">
            <button
              onClick={() => go(-1)}
              aria-label="Anterior"
              className="grid h-12 w-12 place-items-center rounded-full border border-black/10 transition-colors hover:bg-black/5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="#30170a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="text-sm font-semibold tabular-nums" style={{ color: "rgba(48,23,10,0.7)" }}>
              {index + 1} de {SLIDES.length}
            </span>
            <button
              onClick={() => go(1)}
              aria-label="Próximo"
              className="grid h-12 w-12 place-items-center rounded-full border border-black/10 transition-colors hover:bg-black/5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="#30170a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Coluna de imagem (anima ao trocar) */}
        <div className="relative">
          <div
            key={index}
            className={`flex aspect-[11/9] items-center justify-center rounded-3xl ${s.front ? "" : "overflow-hidden"}`}
            style={{
              animation: "bcs-slide-in 0.55s ease-out",
              boxShadow: s.contain ? "none" : "0 20px 50px -20px rgba(48,23,10,0.5)",
              background: "transparent",
            }}
          >
            {s.front ? (
              /* Frente e verso sobrepostos (estilo Nomad) */
              <div className="relative flex h-full w-full items-center justify-center">
                <img
                  src={s.back}
                  alt=""
                  loading="lazy"
                  className="absolute h-[72%] w-auto translate-x-[26%] rotate-[11deg]"
                  style={{ filter: "drop-shadow(0 18px 30px rgba(48,23,10,0.35))" }}
                />
                <img
                  src={s.front}
                  alt={s.title}
                  loading="lazy"
                  className="relative h-[78%] w-auto -translate-x-[14%] -rotate-[7deg]"
                  style={{ filter: "drop-shadow(0 22px 34px rgba(48,23,10,0.4))" }}
                />
              </div>
            ) : s.contain ? (
              <img
                src={s.img}
                alt={s.title}
                loading="lazy"
                className="w-[74%] max-h-[80%] -rotate-[7deg]"
                style={{ filter: "drop-shadow(0 22px 34px rgba(48,23,10,0.4))" }}
              />
            ) : (
              <img
                src={s.img}
                alt={s.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
