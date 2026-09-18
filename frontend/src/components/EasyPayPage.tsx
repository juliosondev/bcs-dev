import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageSkeleton from "./PageSkeleton";
import { openAuth } from "./AuthModal";
import { useLang, type Translatable } from "../i18n";

type Testimonial = {
  company: string;
  logo: string;
  sector: Translatable;
  phone: string;
  email: string;
  quote: Translatable;
  author: Translatable;
};

const TESTIMONIALS: Testimonial[] = [
  {
    company: "Mercado Kwanza, Lda.",
    logo: "Mercado\nKwanza",
    sector: { pt: "Comércio a retalho · Luanda", en: "Retail · Luanda" },
    phone: "(+244) 923 000 000",
    email: "geral@mercadokwanza.ao",
    quote: {
      pt: "Com o BCS EasyPay passámos a receber pagamentos por cartão em segundos. A liquidação rápida na conta melhorou a nossa tesouraria.",
      en: "With BCS EasyPay we now take card payments in seconds. Fast settlement to the account has improved our cash flow.",
    },
    author: { pt: "João Baptista, Gerente", en: "João Baptista, Manager" },
  },
  {
    company: "Farmácia Saúde+, Lda.",
    logo: "Saúde+",
    sector: { pt: "Saúde · Benguela", en: "Healthcare · Benguela" },
    phone: "(+244) 924 111 111",
    email: "geral@saudemais.ao",
    quote: {
      pt: "O acompanhamento em tempo real das vendas facilita imenso o nosso dia a dia. Adesão simples e apoio sempre disponível.",
      en: "Real-time sales tracking makes our day-to-day so much easier. Simple onboarding and support always on hand.",
    },
    author: { pt: "Maria Cassinda, Proprietária", en: "Maria Cassinda, Owner" },
  },
  {
    company: "Auto Peças Talatona",
    logo: "Auto\nPeças",
    sector: { pt: "Automóvel · Luanda", en: "Automotive · Luanda" },
    phone: "(+244) 925 222 222",
    email: "vendas@autotalatona.ao",
    quote: {
      pt: "Aceitar cartões trouxe mais clientes e menos dinheiro em caixa. O EasyPay é seguro e muito prático para o negócio.",
      en: "Accepting cards brought more customers and less cash on hand. EasyPay is secure and very practical for the business.",
    },
    author: { pt: "Nuno Vieira, Diretor", en: "Nuno Vieira, Director" },
  },
];

const SLIDE_H = "h-[420px] sm:h-[320px]";

function TestimonialSlider() {
  const { t } = useLang();
  const [i, setI] = useState(0);
  const n = TESTIMONIALS.length;
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % n), 5000);
    return () => clearInterval(t);
  }, [n]);

  return (
    <div>
      <div className={`relative overflow-hidden rounded-3xl border border-black/5 bg-white ${SLIDE_H}`} style={{ boxShadow: "0 24px 60px -30px rgba(48,23,10,0.4)" }}>
        <div className="transition-transform duration-700 ease-in-out" style={{ transform: `translateY(-${(i * 100) / n}%)` }}>
          {TESTIMONIALS.map((item) => (
            <div key={item.company} className={`grid ${SLIDE_H} grid-cols-1 items-center gap-8 p-6 md:grid-cols-[240px_1fr] md:gap-12 md:p-10`}>
              {/* Esquerda: logo da empresa */}
              <div className="flex items-center justify-center">
                <div className="grid h-28 w-full max-w-[220px] place-items-center rounded-2xl md:h-32" style={{ background: "linear-gradient(135deg, #f4dd94, #d4af37)" }}>
                  <span className="whitespace-pre-line text-center text-2xl font-extrabold leading-tight text-[#0a0805] md:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                    {item.logo}
                  </span>
                </div>
              </div>
              {/* Direita: perfil + testemunho */}
              <div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-black/5 pb-4">
                  <div>
                    <p className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>{item.company}</p>
                    <p className="text-sm" style={{ color: "rgba(48,23,10,0.6)" }}>{t(item.sector)}</p>
                  </div>
                  <div className="flex flex-col gap-1 text-sm md:ml-auto md:text-right" style={{ color: "rgba(48,23,10,0.7)" }}>
                    <span className="inline-flex items-center gap-2 md:justify-end">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 5h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 7a2 2 0 0 1 2-2Z" stroke="#b8860b" strokeWidth="1.8" strokeLinejoin="round" /></svg>
                      {item.phone}
                    </span>
                    <span className="inline-flex items-center gap-2 md:justify-end">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#b8860b" strokeWidth="1.8" /><path d="M4 7l8 6 8-6" stroke="#b8860b" strokeWidth="1.8" strokeLinejoin="round" /></svg>
                      {item.email}
                    </span>
                  </div>
                </div>
                <blockquote className="mt-4">
                  <p className="text-[15px] leading-relaxed md:text-[16px]" style={{ color: "rgba(48,23,10,0.85)" }}>“{t(item.quote)}”</p>
                  <footer className="mt-3 text-sm font-bold" style={{ color: "#8a5a12" }}>— {t(item.author)}</footer>
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores */}
      <div className="mt-5 flex justify-center gap-2">
        {TESTIMONIALS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`${t({ pt: "Testemunho", en: "Testimonial" })} ${idx + 1}`}
            className="h-2 rounded-full transition-all"
            style={{ width: i === idx ? 22 : 8, background: i === idx ? "#b8860b" : "rgba(48,23,10,0.2)" }}
          />
        ))}
      </div>
    </div>
  );
}

export default function EasyPayPage() {
  const { t } = useLang();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-body">
      <PageSkeleton variant="easypay" />
      <Navbar />

      {/* Hero — conteúdo à esquerda */}
      <section
        className="relative w-full overflow-hidden px-6 pb-14 pt-24 text-white md:pb-20 md:pt-28"
        style={{ background: "#14100a" }}
      >
        {/* Imagem de fundo — mais nítida à esquerda */}
        <img
          src="/easypay-hero.jpg"
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
              "linear-gradient(90deg, rgba(26,18,4,0.58) 0%, rgba(26,18,4,0.72) 40%, rgba(20,16,10,0.9) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="max-w-lg">
            <h1 className="leading-[1.05]" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(32px, 4.6vw, 56px)" }}>
              {t({ pt: "Receba pagamentos com", en: "Receive payments with" })}{" "}
              <span style={{ background: "linear-gradient(135deg, #f4dd94, #d4af37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {t({ pt: "facilidade e segurança", en: "ease and security" })}
              </span>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/75">
              {t({
                pt: "O BCS EasyPay é a solução de recebimentos do Banco BCS para o seu negócio: aceite pagamentos de forma simples, rápida e segura, no balcão ou online.",
                en: "BCS EasyPay is Banco BCS's payment-acceptance solution for your business: take payments simply, quickly and securely, in-store or online.",
              })}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => openAuth("signup")}
                className="rounded-lg px-7 py-3.5 text-sm font-bold text-[#0a0805] transition-transform hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg, #f4dd94 0%, #d4af37 55%, #b8860b 100%)" }}
              >
                {t({ pt: "Aderir ao EasyPay", en: "Get EasyPay" })}
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

      {/* O QUE É O BCS EASYPAY (div modelo, com vídeo) */}
      <section className="w-full px-6 py-16 md:py-24" style={{ background: "#ffffff", color: "#30170a" }}>
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#b8860b" }}>
            {t({ pt: "O que é o BCS EasyPay", en: "What is BCS EasyPay" })}
          </span>
          <h2 className="mx-auto mt-4 max-w-3xl uppercase leading-[1.05]" style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(28px, 4.4vw, 48px)" }}>
            {t({ pt: "A solução completa para o seu negócio", en: "The complete solution for your business to" })}{" "}
            <span style={{ color: "#b8860b" }}>{t({ pt: "receber", en: "get paid" })}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed" style={{ color: "rgba(48,23,10,0.8)" }}>
            {t({
              pt: "O BCS EasyPay é um serviço de recebimentos criado para simplificar a gestão de pagamentos da sua empresa — com aceitação de cartões, controlo em tempo real e liquidação rápida na sua conta BCS.",
              en: "BCS EasyPay is a payment-acceptance service built to simplify how your business manages payments — with card acceptance, real-time control and fast settlement to your BCS account.",
            })}
          </p>

          {/* Vídeo */}
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl bg-black shadow-2xl" style={{ boxShadow: "0 30px 70px -30px rgba(48,23,10,0.6)" }}>
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/VuUNnEKKyI4?rel=0"
                title={t({ pt: "O que é o BCS EasyPay", en: "What is BCS EasyPay" })}
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* Experiência de uso */}
      <section className="w-full px-6 py-16 md:py-24" style={{ background: "#ffffff", color: "#30170a" }}>
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 leading-[1.1]" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(26px, 3.6vw, 40px)" }}>
            {t({ pt: "Experiência de", en: "Customer" })} <span style={{ color: "#b8860b" }}>{t({ pt: "uso", en: "experience" })}</span>
          </h2>

          <TestimonialSlider />
        </div>
      </section>

      {/* CTA final */}
      <section className="w-full px-6 py-20 text-white" style={{ background: "linear-gradient(135deg, #1a1204 0%, #14100a 100%)" }}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="leading-[1.1]" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(28px, 4vw, 44px)" }}>
            {t({ pt: "Pronto para começar a receber com o", en: "Ready to start getting paid with" })} <span className="text-gold">BCS EasyPay</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
            {t({ pt: "Abra a sua conta no Banco BCS e adira ao EasyPay para o seu negócio.", en: "Open your account at Banco BCS and get EasyPay for your business." })}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => openAuth("signup")}
              className="rounded-lg px-8 py-4 text-sm font-bold text-[#0a0805] transition-transform hover:scale-[1.03]"
              style={{ background: "linear-gradient(135deg, #f4dd94 0%, #d4af37 55%, #b8860b 100%)" }}
            >
              {t({ pt: "Aderir ao EasyPay", en: "Get EasyPay" })}
            </button>
            <Link to="/" className="rounded-lg border border-white/20 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white/5">
              {t({ pt: "Voltar ao início", en: "Back to home" })}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
