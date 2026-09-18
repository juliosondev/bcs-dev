import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { openAuth } from "./AuthModal";

type CardInfo = {
  name: string;
  badge: string;
  tagline: string;
  desc: string;
  image: string;
  features: { title: string; text: string; icon: FeatureIconName }[];
  benefits: { title: string; text: string }[];
  faq: { q: string; a: string }[];
};

type FeatureIconName =
  | "globe" | "shield" | "star" | "refresh" | "online"
  | "tap" | "clock" | "phone" | "crown" | "plane" | "wallet" | "gift";

function FeatureIcon({ name }: { name: FeatureIconName }) {
  const p = { fill: "none", stroke: "#0a0805", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<FeatureIconName, React.ReactNode> = {
    globe: <><circle cx="12" cy="12" r="9" {...p} /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" {...p} /></>,
    shield: <><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" {...p} /><path d="M9 12l2 2 4-4" {...p} /></>,
    star: <path d="M12 3l2.6 5.6 6 .7-4.4 4.1 1.2 6L12 16.9 6.6 19.5l1.2-6L3.4 9.3l6-.7L12 3Z" {...p} />,
    refresh: <><path d="M20 12a8 8 0 1 1-2.3-5.6" {...p} /><path d="M20 4v4h-4" {...p} /></>,
    online: <><rect x="3" y="4" width="18" height="13" rx="2" {...p} /><path d="M8 21h8M12 17v4" {...p} /><path d="M8 10l2 2 4-4" {...p} /></>,
    tap: <><path d="M8 11V6a2 2 0 1 1 4 0v5" {...p} /><path d="M12 11V4.5a2 2 0 1 1 4 0V13" {...p} /><path d="M16 8.5a2 2 0 1 1 4 0V15a6 6 0 0 1-6 6h-2.5a4 4 0 0 1-3.1-1.5L4 15" {...p} /></>,
    clock: <><circle cx="12" cy="12" r="9" {...p} /><path d="M12 7v5l3 2" {...p} /></>,
    phone: <><rect x="7" y="2.5" width="10" height="19" rx="2.5" {...p} /><path d="M11 18.5h2" {...p} /></>,
    crown: <><path d="M4 8l3.5 3L12 5l4.5 6L20 8l-1.5 10h-13L4 8Z" {...p} /></>,
    plane: <path d="M10.5 3.5c.4-.4 1.1-.4 1.5 0l.6.6c.3.3.4.8.2 1.2L11 9l5 5 1.5-.6c.5-.2 1 0 1.3.4.3.4.2 1-.2 1.3l-2 1.6 1 3.2c.1.4 0 .8-.3 1l-.3.2-3-3-2.5 2 .2 2.1-1 .7-1.4-3.1-3.1-1.4.7-1 2.1.2 2-2.5-3-3-.2.3c-.3.3-.7.4-1 .3l-3.2-1 1.6-2c.3-.4.9-.5 1.3-.2l.4 1.3L10 13l3.7-3.6-.7-4.5c-.1-.4 0-.9.3-1.2l.6-.6Z" {...p} />,
    wallet: <><rect x="3" y="6" width="18" height="13" rx="2" {...p} /><path d="M16 12h2" {...p} /></>,
    gift: <><rect x="4" y="9" width="16" height="12" rx="1.5" {...p} /><path d="M3 9h18v3H3zM12 9v12M12 9S9.5 4 7.5 5.5 9 9 12 9ZM12 9s2.5-5 4.5-3.5S15 9 12 9Z" {...p} /></>,
  };
  return (
    <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: "linear-gradient(135deg, #e8c86a, #b8860b)" }}>
      <svg width="22" height="22" viewBox="0 0 24 24">{paths[name]}</svg>
    </span>
  );
}

const CARDS: Record<string, CardInfo> = {
  "mastercard-gold": {
    name: "Cartão BCS Mastercard Gold",
    badge: "Gold",
    tagline: "Mais do que um cartão, uma porta para o mundo",
    desc: "Ao aderir ao cartão BCS Mastercard Gold, pode usufruir de serviços exclusivos e experiências únicas e memoráveis, dentro e fora de Angola.",
    image: "/card-front.png",
    features: [
      { title: "Aceitação global", text: "Pague e levante em milhões de estabelecimentos e ATMs em todo o mundo.", icon: "globe" },
      { title: "Seguro e protegido", text: "Tecnologia contactless e chip EMV, com controlo total pelo MyBCS.", icon: "shield" },
      { title: "Programa Mastercard Gold", text: "Assistência em viagem, apoio 24/7 e vantagens exclusivas do programa Gold.", icon: "star" },
      { title: "Pagamentos por aproximação", text: "Aproxime e pague com rapidez e segurança no dia a dia.", icon: "tap" },
      { title: "Cartão físico e digital", text: "Use o cartão físico ou o cartão no telemóvel, como preferir.", icon: "phone" },
      { title: "Apoio 24/7", text: "Assistência disponível a qualquer hora, esteja onde estiver.", icon: "clock" },
    ],
    benefits: [
      { title: "Controlo total", text: "Bloqueie, desbloqueie e acompanhe os seus gastos em tempo real pelo MyBCS." },
      { title: "Compras online seguras", text: "Cartão físico e digital, com confirmação segura em cada transação." },
      { title: "Contactless", text: "Aproxime e pague com rapidez e segurança no dia a dia." },
      { title: "Tranquilidade no estrangeiro", text: "Um cartão que o acompanha em cada viagem, sem complicações." },
    ],
    faq: [
      { q: "Como solicito o meu cartão Mastercard Gold?", a: "Abra a sua conta no MyBCS ou dirija-se a uma agência BCS. Após a aprovação, o cartão fica disponível para levantamento ou entrega." },
      { q: "Quais as taxas aplicáveis?", a: "As condições e o preçário dependem do seu perfil. Consulte o preçário do BCS ou fale com o seu gestor." },
      { q: "Posso usar o cartão fora de Angola?", a: "Sim. O Mastercard Gold é aceite globalmente em estabelecimentos e ATMs da rede Mastercard." },
    ],
  },
  "mastercard-world": {
    name: "Cartão BCS Mastercard World",
    badge: "World",
    tagline: "Mais do que um cartão, um reconhecimento a nível mundial",
    desc: "Ao aderir ao cartão BCS Mastercard World, pode desfrutar de experiências únicas em todo o mundo, com o mais alto nível de serviço e conforto.",
    image: "/card2-front.png",
    features: [
      { title: "Estatuto mundial", text: "Reconhecimento e aceitação premium em qualquer parte do mundo.", icon: "globe" },
      { title: "Experiências exclusivas", text: "Acesso a benefícios de viagem, conforto e serviços de assistência.", icon: "star" },
      { title: "Segurança de topo", text: "Contactless, chip EMV e gestão completa pelo MyBCS.", icon: "shield" },
      { title: "Serviço concierge", text: "Apoio dedicado para reservas, viagens e imprevistos.", icon: "crown" },
      { title: "Conforto em viagem", text: "Vantagens em aeroportos e viagens para quem viaja com frequência.", icon: "plane" },
      { title: "Apoio 24/7", text: "Assistência premium disponível a qualquer hora do dia.", icon: "clock" },
    ],
    benefits: [
      { title: "Concierge e assistência", text: "Apoio dedicado para as suas viagens e imprevistos." },
      { title: "Conforto em viagem", text: "Vantagens pensadas para quem viaja com frequência." },
      { title: "Controlo total", text: "Acompanhe e gira o seu cartão em tempo real pelo MyBCS." },
      { title: "Compras seguras", text: "Proteção reforçada em compras físicas e online." },
    ],
    faq: [
      { q: "Quem pode aderir ao Mastercard World?", a: "O cartão World destina-se a clientes com perfil premium. Fale com o seu gestor para conhecer as condições de adesão." },
      { q: "Que benefícios de viagem inclui?", a: "Inclui vantagens de assistência e conforto em viagem, de acordo com o programa Mastercard World." },
      { q: "Posso gerir o cartão pela app?", a: "Sim. Através do MyBCS pode consultar, bloquear e controlar o cartão a qualquer momento." },
    ],
  },
  "pre-pago-sublime": {
    name: "Cartão Pré-pago Sublime",
    badge: "Pré-pago",
    tagline: "Mais do que um cartão, flexibilidade e tranquilidade garantida",
    desc: "Ao aderir ao cartão Pré-pago Sublime, tem garantido um meio de pagamento conveniente e seguro para as suas viagens ou compras online.",
    image: "/card3-front.svg",
    features: [
      { title: "Recarregável", text: "Carregue apenas o valor que precisa e gaste com total controlo.", icon: "refresh" },
      { title: "Ideal para compras online", text: "Um meio de pagamento seguro para a internet, sem expor a sua conta.", icon: "online" },
      { title: "Prático em viagem", text: "Leve consigo um cartão simples, aceite na rede Mastercard.", icon: "globe" },
      { title: "Controlo de gastos", text: "Só gasta o que carrega — perfeito para orçamentos e mesadas.", icon: "wallet" },
      { title: "Ideal para presentear", text: "Um cartão prático para oferecer a quem gosta.", icon: "gift" },
      { title: "Recarga pelo MyBCS", text: "Carregue e acompanhe o saldo diretamente na aplicação.", icon: "phone" },
    ],
    benefits: [
      { title: "Controlo de gastos", text: "Só gasta o que carrega — perfeito para orçamentos e presentes." },
      { title: "Sem surpresas", text: "Um cartão simples e transparente para o dia a dia." },
      { title: "Segurança", text: "Proteja a sua conta principal usando o pré-pago para compras online." },
      { title: "Fácil de gerir", text: "Acompanhe e recarregue o cartão pelo MyBCS." },
    ],
    faq: [
      { q: "Como carrego o meu Pré-pago Sublime?", a: "Pode carregar o cartão pelo MyBCS ou numa agência BCS, no valor que pretender." },
      { q: "Preciso de ter conta no BCS?", a: "Fale connosco para conhecer as condições de adesão ao cartão pré-pago." },
      { q: "Posso usar em compras internacionais?", a: "Sim, o cartão é aceite na rede Mastercard para compras online e no estrangeiro." },
    ],
  },
};

function Faq({ item }: { item: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[15px] font-bold" style={{ color: "#30170a" }}>{item.q}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 transition-transform" style={{ transform: open ? "rotate(180deg)" : "none" }}>
          <path d="M6 9l6 6 6-6" stroke="#b8860b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="grid transition-all duration-300" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed" style={{ color: "rgba(48,23,10,0.7)" }}>{item.a}</p>
        </div>
      </div>
    </div>
  );
}

const PHOTOS = ["/cartoes.jpg", "/reacao-2.jpg"];

const REACTIONS: { platform: "ig" | "fb" | "li"; name: string; handle: string; text: string; likes: number }[] = [
  { platform: "ig", name: "Ana Fernandes", handle: "@ana.fdes", text: "Usei o cartão na viagem e foi aceite em todo o lado, sem stress! 🙌", likes: 128 },
  { platform: "fb", name: "Miguel Sousa", handle: "Miguel S.", text: "Contactless super rápido e o controlo pelo MyBCS é excelente.", likes: 86 },
  { platform: "ig", name: "José Tavares", handle: "@jose.t", text: "Finalmente um cartão que funciona lá fora. Recomendo! 🔥", likes: 203 },
  { platform: "li", name: "Teresa Lopes", handle: "Teresa L.", text: "Adoro os benefícios e o atendimento do Banco BCS.", likes: 54 },
];

function SocialIcon({ platform }: { platform: "ig" | "fb" | "li" }) {
  if (platform === "ig")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="#8a5a12" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" fill="none" stroke="#8a5a12" strokeWidth="1.8" /><circle cx="17.5" cy="6.5" r="1.2" fill="#8a5a12" /></svg>
    );
  if (platform === "li")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#8a5a12"><path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.4 8h4.16v12H.4zM8 8h3.99v1.64h.06c.56-1.06 1.94-2.18 4-2.18 4.28 0 5.07 2.82 5.07 6.48V20h-4.16v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V20H8z" /></svg>
    );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#8a5a12"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h3v6h3v-6h3l1-3h-4v-2c0-.55.45-1 1-1z" /></svg>
  );
}

function PhotoSlider({ photos }: { photos: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % photos.length), 4000);
    return () => clearInterval(t);
  }, [photos.length]);
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl" style={{ boxShadow: "0 24px 60px -28px rgba(48,23,10,0.5)" }}>
      {/* crossfade suave entre as fotos */}
      {photos.map((p, idx) => (
        <img
          key={idx}
          src={p}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: i === idx ? 1 : 0 }}
        />
      ))}
      {/* indicadores */}
      <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2">
        {photos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Foto ${idx + 1}`}
            className="h-2 rounded-full transition-all"
            style={{ width: i === idx ? 22 : 8, background: i === idx ? "#fff" : "rgba(255,255,255,0.55)" }}
          />
        ))}
      </div>
    </div>
  );
}

function FeaturesCarousel({ features }: { features: { title: string; text: string; icon: FeatureIconName }[] }) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    const t = track.current;
    if (!t) return;
    const card = t.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : t.clientWidth * 0.8;
    t.scrollBy({ left: dir * step, behavior: "smooth" });
  };
  return (
    <div>
      {/* Botões de navegação */}
      <div className="mb-5 flex justify-end gap-3">
        <button
          onClick={() => scroll(-1)}
          aria-label="Ver anteriores"
          className="grid h-11 w-11 place-items-center rounded-full border border-black/10 transition-colors hover:bg-black/5"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#30170a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Ver mais"
          className="grid h-11 w-11 place-items-center rounded-full border border-black/10 transition-colors hover:bg-black/5"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#30170a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {features.map((f) => (
          <div
            key={f.title}
            data-card
            className="w-[85%] shrink-0 snap-start rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:w-[47%] lg:w-[31.5%]"
          >
            <FeatureIcon name={f.icon} />
            <h3 className="mt-5 text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(48,23,10,0.7)" }}>{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CardDetailPage() {
  const { slug } = useParams();
  const card = slug ? CARDS[slug] : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!card) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#fcfcfc] px-6 text-center" style={{ color: "#30170a" }}>
        <div>
          <h1 className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>Cartão não encontrado</h1>
          <Link to="/" className="mt-4 inline-block font-bold" style={{ color: "#b8860b" }}>← Voltar ao início</Link>
        </div>
      </div>
    );
  }

  const isSvg = card.image.endsWith(".svg");

  return (
    <div className="font-body">
      <Navbar />

      {/* Hero do cartão */}
      <section
        className="w-full overflow-hidden px-6 pb-12 pt-24 text-white md:pb-16 md:pt-28"
        style={{ background: "linear-gradient(135deg, #1a1204 0%, #2a1e08 55%, #14100a 100%)" }}
      >
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h1 className="leading-[1.05]" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(32px, 4.6vw, 56px)" }}>
              {card.tagline}
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/75">{card.desc}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => openAuth("signup")}
                className="rounded-lg px-7 py-3.5 text-sm font-bold text-[#0a0805] transition-transform hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg, #f4dd94 0%, #d4af37 55%, #b8860b 100%)" }}
              >
                Aderir ao cartão
              </button>
              <Link
                to="/"
                className="rounded-lg border border-white/20 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/5"
              >
                Voltar
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <img
              src={card.image}
              alt={card.name}
              className={isSvg ? "w-[86%] max-w-[440px] rotate-[-6deg]" : "h-auto w-[62%] max-w-[300px] rotate-[-6deg]"}
              style={{ filter: "drop-shadow(0 26px 50px rgba(0,0,0,0.5))" }}
            />
          </div>
        </div>
      </section>

      {/* Reação do público: slide de fotos + comentários das redes sociais */}
      <section className="w-full px-6 py-16 md:py-24" style={{ background: "#ffffff", color: "#30170a" }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 leading-[1.1]" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(26px, 3.6vw, 40px)" }}>
            A reação de quem <span style={{ color: "#b8860b" }}>já usa</span>
          </h2>
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            {/* Slide de fotos */}
            <PhotoSlider photos={PHOTOS} />

            {/* Comentários das redes sociais */}
            <div className="space-y-4">
              {REACTIONS.map((c) => (
                <div key={c.handle} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold" style={{ background: "rgba(232,200,106,0.18)", color: "#8a5a12" }}>
                      {c.name.charAt(0)}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold" style={{ color: "#30170a" }}>{c.name}</p>
                      <p className="text-xs" style={{ color: "rgba(48,23,10,0.5)" }}>{c.handle}</p>
                    </div>
                    <SocialIcon platform={c.platform} />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(48,23,10,0.8)" }}>{c.text}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs" style={{ color: "rgba(48,23,10,0.5)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.35-9.5-8.5C.9 9.5 2.5 6 6 6c2 0 3.2 1.1 4 2.3C10.8 7.1 12 6 14 6c3.5 0 5.1 3.5 3.5 6.5C19 16.65 12 21 12 21Z" fill="#e8c86a" /></svg>
                    {c.likes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Destaques (3 colunas) */}
      <section className="w-full px-6 py-16 md:py-24" style={{ background: "#fcfcfc", color: "#30170a" }}>
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-2xl leading-[1.1]" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(26px, 3.6vw, 40px)" }}>
            Um cartão <span style={{ color: "#b8860b" }}>sem fronteiras</span>
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed" style={{ color: "rgba(48,23,10,0.7)" }}>
            Quer explorar as vantagens exclusivas que este cartão oferece?
          </p>
          <div className="mt-10">
            <FeaturesCarousel features={card.features} />
          </div>
        </div>
      </section>

      {/* Benefícios (grid) */}
      <section className="w-full px-6 py-16 md:py-24" style={{ background: "var(--gradient-champagne)", color: "#30170a" }}>
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-2xl leading-[1.1]" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(26px, 3.6vw, 40px)" }}>
            Feito para funcionar, <span style={{ color: "#8a5a12" }}>no seu ritmo</span>
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {card.benefits.map((b) => (
              <div key={b.title} className="flex gap-4 rounded-2xl bg-white/70 p-5">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full" style={{ background: "linear-gradient(135deg, #e8c86a, #b8860b)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#0a0805" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-[15px] font-bold">{b.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "rgba(48,23,10,0.7)" }}>{b.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full px-6 py-16 md:py-24" style={{ background: "#fcfcfc", color: "#30170a" }}>
        <div className="mx-auto max-w-3xl">
          <h2 className="leading-[1.1]" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(26px, 3.6vw, 40px)" }}>
            Perguntas <span style={{ color: "#b8860b" }}>frequentes</span>
          </h2>
          <div className="mt-8">
            {card.faq.map((item) => (
              <Faq key={item.q} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="w-full px-6 py-20 text-white" style={{ background: "linear-gradient(135deg, #1a1204 0%, #14100a 100%)" }}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="leading-[1.1]" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(28px, 4vw, 44px)" }}>
            Pronto para ter o seu <span className="text-gold">{card.badge}</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
            Abra a sua conta no Banco BCS e adira ao {card.name} em poucos minutos.
          </p>
          <button
            onClick={() => openAuth("signup")}
            className="mt-8 rounded-lg px-8 py-4 text-sm font-bold text-[#0a0805] transition-transform hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg, #f4dd94 0%, #d4af37 55%, #b8860b 100%)" }}
          >
            Abrir uma conta
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
