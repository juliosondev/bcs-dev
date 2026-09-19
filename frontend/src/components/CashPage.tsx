import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageSkeleton from "./PageSkeleton";
import { openAuth } from "./AuthModal";
import { useLang } from "../i18n";

// Pontos reais do BCS Cash (nome + embed do Google Maps), extraídos do site oficial.
type Point = { name: string; area: string; embed: string };
const POINTS: Point[] = [
  { name: "Kibabo Via-expressa", area: "Luanda", embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20458.1645659145!2d13.20549932059063!3d-8.973611850840799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a521f1fce291809%3A0x7a81072cf3c82324!2sKIBABO%20Imp%C3%A9rio!5e0!3m2!1spt-PT!2sao!4v1728912245788!5m2!1spt-PT!2sao" },
  { name: "Shopping Popular", area: "Luanda", embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d246.33147024678908!2d13.264832171957714!3d-8.94415328317972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f5fe863e573d%3A0x659076c860d93bd5!2zU2hvcHBpbmcgUG9wdWxhciDmtbflsbHllYbotLjln44!5e0!3m2!1spt-PT!2sao!4v1728912327174!5m2!1spt-PT!2sao" },
  { name: "Rua do Kikagil", area: "Luanda", embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d627.1370389677534!2d13.183980092138754!3d-8.895720125731987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f5343f12f9eb%3A0x7a0899dacd138d04!2sSalesagents45!5e0!3m2!1spt-PT!2sao!4v1728912991127!5m2!1spt-PT!2sao" },
  { name: "TotalEnergies Palanca", area: "Luanda", embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d530.7184680299563!2d13.283686663912768!3d-8.849814442439188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f1486e043b83%3A0xeb1db334585a2fd7!2sTotalEnergies%20Palanca!5e0!3m2!1spt-PT!2sao!4v1728913039821!5m2!1spt-PT!2sao" },
  { name: "TotalEnergies Boa Entrada", area: "Luanda", embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d682.8169150396652!2d13.257395217483415!3d-8.835653212470488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f3920ce20713%3A0x1eed93d37916fedd!2sTotalEnergies%20Boa%20Entrada!5e0!3m2!1spt-PT!2sao!4v1728913062456!5m2!1spt-PT!2sao" },
  { name: "TotalEnergies São Paulo", area: "Luanda", embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3797.2570421105856!2d13.252164088508525!3d-8.8155947247472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f22c48a2388d%3A0xbac7af7527fb247e!2sTotal%20Energies%20(S%C3%A3o%20Paulo)!5e0!3m2!1spt-PT!2sao!4v1728913110256!5m2!1spt-PT!2sao" },
  { name: "Pumangol Lar Patriota", area: "Luanda", embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1511.6783527874306!2d13.169384544855333!3d-8.93369266618575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a518ab4f8399b07%3A0xcef5bc68b9508bcd!2sPumangol%20(Lar%20Patriota)!5e0!3m2!1spt-PT!2sao!4v1728913162751!5m2!1spt-PT!2sao" },
  { name: "TotalEnergies Capossoca", area: "Luanda", embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15768.427886555673!2d13.182261962296517!3d-8.869633058966576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f56d102a8d7d%3A0xc72bf3aab6de1fc1!2sTotalEnergies%20Capossoca!5e0!3m2!1spt-PT!2sao!4v1728913667459!5m2!1spt-PT!2sao" },
  { name: "TotalEnergies Camama", area: "Luanda", embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2735.293824135267!2d13.257526135466405!3d-8.890250789593885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f5b7617305d3%3A0xdd8a1136fcde5a3d!2sTotalEnergies%20Camama!5e0!3m2!1spt-PT!2sao!4v1728913734366!5m2!1spt-PT!2sao" },
];

export default function CashPage() {
  const { t } = useLang();
  const [activePoint, setActivePoint] = useState(POINTS[0].name);
  const [mapUrl, setMapUrl] = useState(POINTS[0].embed);
  const trackRef = useRef<HTMLDivElement>(null);

  const selectPoint = (p: Point) => {
    setActivePoint(p.name);
    setMapUrl(p.embed);
  };

  const step = () => {
    const el = trackRef.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    return (card?.offsetHeight ?? 88) + 12; // altura do card + gap
  };

  const scrollCarousel = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
    if (dir > 0 && atBottom) {
      el.scrollTo({ top: 0, behavior: "smooth" });
    } else if (dir < 0 && el.scrollTop <= 4) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else {
      el.scrollBy({ top: dir * step(), behavior: "smooth" });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-body">
      <PageSkeleton variant="easypay" />
      <Navbar />

      {/* Hero — conteúdo à esquerda (igual ao EasyPay) */}
      <section
        className="relative w-full overflow-hidden px-6 pb-14 pt-24 text-white md:pb-20 md:pt-28"
        style={{ background: "#14100a" }}
      >
        {/* Imagem de fundo — mais nítida à esquerda */}
        <img
          src="/bcscash-hero.jpg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0.42 }}
        />
        {/* Overlay em gradiente: mais leve à esquerda (imagem visível), escurece à direita */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(26,18,4,0.58) 0%, rgba(26,18,4,0.66) 45%, rgba(20,16,10,0.74) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="max-w-lg">
            <h1 className="leading-[1.05]" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(32px, 4.6vw, 56px)" }}>
              {t({ pt: "Conheça o", en: "Discover" })}{" "}
              <span style={{ background: "linear-gradient(135deg, #f4dd94, #d4af37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                BCS Cash
              </span>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/75">
              {t({
                pt: "O BCS Cash permite-lhe enquanto nosso cliente executar determinadas transacções financeiras, sem a necessidade de visitar um dos nossos Centros de Negócios.",
                en: "BCS Cash lets you, as our client, carry out certain financial transactions without needing to visit one of our Business Centres.",
              })}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => openAuth("signup")}
                className="rounded-lg px-7 py-3.5 text-sm font-bold text-[#0a0805] transition-transform hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg, #f4dd94 0%, #d4af37 55%, #b8860b 100%)" }}
              >
                {t({ pt: "Aderir ao BCS Cash", en: "Get BCS Cash" })}
              </button>
              <a
                href="tel:+244225300803"
                className="rounded-lg border border-white/20 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/5"
              >
                {t({ pt: "Falar connosco", en: "Talk to us" })}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pontos do BCS Cash — pesquisa no Google Maps */}
      <section className="w-full px-6 py-16 md:py-24" style={{ background: "#fcfcfc", color: "#30170a" }}>
        <div className="mx-auto max-w-7xl">
          {/* Cabeçalho da seção */}
          <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#b8860b" }}>
            {t({ pt: "Encontrar pontos do BCS Cash", en: "Find BCS Cash points" })}
          </span>
          <h2 className="mt-4 leading-[1.1]" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(28px, 3.8vw, 44px)" }}>
            {t({ pt: "Pontos do", en: "BCS Cash" })} <span style={{ color: "#b8860b" }}>{t({ pt: "BCS Cash", en: "points" })}</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: "rgba(48,23,10,0.7)" }}>
            {t({
              pt: "Pesquise pelos pontos do BCS Cash mais próximos de si.",
              en: "Search for the BCS Cash points nearest to you.",
            })}
          </p>

          {/* Localizações (carrossel vertical) + mapa */}
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[380px_1fr] lg:gap-8">
            {/* Carrossel vertical de pontos — auto-rolagem + setas manuais */}
            <div>
              <div className="mb-3 flex justify-end gap-2">
                <button
                  onClick={() => scrollCarousel(-1)}
                  aria-label={t({ pt: "Anterior", en: "Previous" })}
                  className="grid h-10 w-10 place-items-center rounded-full border border-black/10 transition-colors hover:bg-black/5"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 15l6-6 6 6" stroke="#30170a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button
                  onClick={() => scrollCarousel(1)}
                  aria-label={t({ pt: "Próximo", en: "Next" })}
                  className="grid h-10 w-10 place-items-center rounded-full border border-black/10 transition-colors hover:bg-black/5"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#30170a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
              <div
                ref={trackRef}
                className="relative flex h-[300px] flex-col gap-3 overflow-y-auto pr-1 md:h-[406px]"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitMaskImage: "linear-gradient(transparent, #000 7%, #000 93%, transparent)",
                  maskImage: "linear-gradient(transparent, #000 7%, #000 93%, transparent)",
                }}
              >
                {POINTS.map((p) => {
                  const active = activePoint === p.name;
                  return (
                    <button
                      key={p.name}
                      data-card
                      onClick={() => selectPoint(p)}
                      className="flex shrink-0 items-center gap-3 rounded-2xl border p-4 text-left transition-colors"
                      style={{
                        borderColor: active ? "#e0c78c" : "rgba(48,23,10,0.1)",
                        background: active ? "rgba(224,199,140,0.2)" : "#fff",
                      }}
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: "linear-gradient(135deg, #e8c86a, #b8860b)" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10Z" stroke="#0a0805" strokeWidth="1.8" strokeLinejoin="round" />
                          <circle cx="12" cy="11" r="2.2" stroke="#0a0805" strokeWidth="1.8" />
                        </svg>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold" style={{ color: "#30170a" }}>{p.name}</span>
                        <span className="mt-0.5 block text-xs" style={{ color: "rgba(48,23,10,0.6)" }}>{p.area}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mapa */}
            <div
              className="overflow-hidden rounded-3xl border border-black/5 bg-white"
              style={{ boxShadow: "0 24px 60px -30px rgba(48,23,10,0.45)" }}
            >
              <iframe
                title={t({ pt: "Mapa dos pontos do BCS Cash", en: "Map of BCS Cash points" })}
                src={mapUrl}
                className="h-[340px] w-full border-0 md:h-[460px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
