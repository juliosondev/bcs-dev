import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageSkeleton from "./PageSkeleton";
import { openAuth } from "./AuthModal";
import { useLang, type Translatable } from "../i18n";

type CardInfo = {
  name: Translatable;
  badge: Translatable;
  tagline: Translatable;
  desc: Translatable;
  image: string;
  features: { title: Translatable; text: Translatable; icon: FeatureIconName }[];
  benefits: { title: Translatable; text: Translatable }[];
  faq: { q: Translatable; a: Translatable }[];
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
    name: { pt: "Cartão BCS Mastercard Gold", en: "BCS Mastercard Gold Card" },
    badge: { pt: "Gold", en: "Gold" },
    tagline: { pt: "Mais do que um cartão, uma porta para o mundo", en: "More than a card, a gateway to the world" },
    desc: {
      pt: "Ao aderir ao cartão BCS Mastercard Gold, pode usufruir de serviços exclusivos e experiências únicas e memoráveis, dentro e fora de Angola.",
      en: "With the BCS Mastercard Gold, you can enjoy exclusive services and unique, memorable experiences, both inside and outside Angola.",
    },
    image: "/card-front.png",
    features: [
      { title: { pt: "Aceitação global", en: "Global acceptance" }, text: { pt: "Pague e levante em milhões de estabelecimentos e ATMs em todo o mundo.", en: "Pay and withdraw at millions of merchants and ATMs worldwide." }, icon: "globe" },
      { title: { pt: "Seguro e protegido", en: "Safe and secure" }, text: { pt: "Tecnologia contactless e chip EMV, com controlo total pelo MyBCS.", en: "Contactless technology and EMV chip, with full control via MyBCS." }, icon: "shield" },
      { title: { pt: "Programa Mastercard Gold", en: "Mastercard Gold programme" }, text: { pt: "Assistência em viagem, apoio 24/7 e vantagens exclusivas do programa Gold.", en: "Travel assistance, 24/7 support and exclusive Gold programme benefits." }, icon: "star" },
      { title: { pt: "Pagamentos por aproximação", en: "Contactless payments" }, text: { pt: "Aproxime e pague com rapidez e segurança no dia a dia.", en: "Tap and pay quickly and securely every day." }, icon: "tap" },
      { title: { pt: "Cartão físico e digital", en: "Physical and digital card" }, text: { pt: "Use o cartão físico ou o cartão no telemóvel, como preferir.", en: "Use the physical card or the card on your phone, whichever you prefer." }, icon: "phone" },
      { title: { pt: "Apoio 24/7", en: "24/7 support" }, text: { pt: "Assistência disponível a qualquer hora, esteja onde estiver.", en: "Assistance available anytime, wherever you are." }, icon: "clock" },
    ],
    benefits: [
      { title: { pt: "Controlo total", en: "Full control" }, text: { pt: "Bloqueie, desbloqueie e acompanhe os seus gastos em tempo real pelo MyBCS.", en: "Lock, unlock and track your spending in real time via MyBCS." } },
      { title: { pt: "Compras online seguras", en: "Secure online shopping" }, text: { pt: "Cartão físico e digital, com confirmação segura em cada transação.", en: "Physical and digital card, with secure confirmation on every transaction." } },
      { title: { pt: "Contactless", en: "Contactless" }, text: { pt: "Aproxime e pague com rapidez e segurança no dia a dia.", en: "Tap and pay quickly and securely every day." } },
      { title: { pt: "Tranquilidade no estrangeiro", en: "Peace of mind abroad" }, text: { pt: "Um cartão que o acompanha em cada viagem, sem complicações.", en: "A card that goes with you on every trip, hassle-free." } },
    ],
    faq: [
      { q: { pt: "Como solicito o meu cartão Mastercard Gold?", en: "How do I request my Mastercard Gold card?" }, a: { pt: "Abra a sua conta no MyBCS ou dirija-se a uma agência BCS. Após a aprovação, o cartão fica disponível para levantamento ou entrega.", en: "Open your account on MyBCS or visit a BCS branch. Once approved, the card is available for pickup or delivery." } },
      { q: { pt: "Quais as taxas aplicáveis?", en: "What fees apply?" }, a: { pt: "As condições e o preçário dependem do seu perfil. Consulte o preçário do BCS ou fale com o seu gestor.", en: "Terms and pricing depend on your profile. Check the BCS pricing or speak with your account manager." } },
      { q: { pt: "Posso usar o cartão fora de Angola?", en: "Can I use the card outside Angola?" }, a: { pt: "Sim. O Mastercard Gold é aceite globalmente em estabelecimentos e ATMs da rede Mastercard.", en: "Yes. The Mastercard Gold is accepted globally at merchants and ATMs in the Mastercard network." } },
    ],
  },
  "mastercard-world": {
    name: { pt: "Cartão BCS Mastercard World", en: "BCS Mastercard World Card" },
    badge: { pt: "World", en: "World" },
    tagline: { pt: "Mais do que um cartão, um reconhecimento a nível mundial", en: "More than a card, recognition worldwide" },
    desc: {
      pt: "Ao aderir ao cartão BCS Mastercard World, pode desfrutar de experiências únicas em todo o mundo, com o mais alto nível de serviço e conforto.",
      en: "With the BCS Mastercard World, you can enjoy unique experiences all over the world, with the highest level of service and comfort.",
    },
    image: "/card2-front.png",
    features: [
      { title: { pt: "Estatuto mundial", en: "Global status" }, text: { pt: "Reconhecimento e aceitação premium em qualquer parte do mundo.", en: "Premium recognition and acceptance anywhere in the world." }, icon: "globe" },
      { title: { pt: "Experiências exclusivas", en: "Exclusive experiences" }, text: { pt: "Acesso a benefícios de viagem, conforto e serviços de assistência.", en: "Access to travel benefits, comfort and assistance services." }, icon: "star" },
      { title: { pt: "Segurança de topo", en: "Top-tier security" }, text: { pt: "Contactless, chip EMV e gestão completa pelo MyBCS.", en: "Contactless, EMV chip and complete management via MyBCS." }, icon: "shield" },
      { title: { pt: "Serviço concierge", en: "Concierge service" }, text: { pt: "Apoio dedicado para reservas, viagens e imprevistos.", en: "Dedicated support for bookings, travel and the unexpected." }, icon: "crown" },
      { title: { pt: "Conforto em viagem", en: "Travel comfort" }, text: { pt: "Vantagens em aeroportos e viagens para quem viaja com frequência.", en: "Airport and travel perks for frequent travellers." }, icon: "plane" },
      { title: { pt: "Apoio 24/7", en: "24/7 support" }, text: { pt: "Assistência premium disponível a qualquer hora do dia.", en: "Premium assistance available any time of day." }, icon: "clock" },
    ],
    benefits: [
      { title: { pt: "Concierge e assistência", en: "Concierge and assistance" }, text: { pt: "Apoio dedicado para as suas viagens e imprevistos.", en: "Dedicated support for your travels and the unexpected." } },
      { title: { pt: "Conforto em viagem", en: "Travel comfort" }, text: { pt: "Vantagens pensadas para quem viaja com frequência.", en: "Perks designed for frequent travellers." } },
      { title: { pt: "Controlo total", en: "Full control" }, text: { pt: "Acompanhe e gira o seu cartão em tempo real pelo MyBCS.", en: "Track and manage your card in real time via MyBCS." } },
      { title: { pt: "Compras seguras", en: "Secure purchases" }, text: { pt: "Proteção reforçada em compras físicas e online.", en: "Enhanced protection for in-store and online purchases." } },
    ],
    faq: [
      { q: { pt: "Quem pode aderir ao Mastercard World?", en: "Who can get the Mastercard World?" }, a: { pt: "O cartão World destina-se a clientes com perfil premium. Fale com o seu gestor para conhecer as condições de adesão.", en: "The World card is for premium-profile clients. Speak with your account manager about eligibility." } },
      { q: { pt: "Que benefícios de viagem inclui?", en: "What travel benefits does it include?" }, a: { pt: "Inclui vantagens de assistência e conforto em viagem, de acordo com o programa Mastercard World.", en: "It includes travel assistance and comfort perks, in line with the Mastercard World programme." } },
      { q: { pt: "Posso gerir o cartão pela app?", en: "Can I manage the card in the app?" }, a: { pt: "Sim. Através do MyBCS pode consultar, bloquear e controlar o cartão a qualquer momento.", en: "Yes. Through MyBCS you can view, lock and control the card at any time." } },
    ],
  },
  "pre-pago-sublime": {
    name: { pt: "Cartão Pré-pago Sublime", en: "Sublime Prepaid Card" },
    badge: { pt: "Pré-pago", en: "Prepaid" },
    tagline: { pt: "Mais do que um cartão, flexibilidade e tranquilidade garantida", en: "More than a card, guaranteed flexibility and peace of mind" },
    desc: {
      pt: "Ao aderir ao cartão Pré-pago Sublime, tem garantido um meio de pagamento conveniente e seguro para as suas viagens ou compras online.",
      en: "With the Sublime Prepaid card, you get a convenient and secure means of payment for your travels or online purchases.",
    },
    image: "/card3-front.svg",
    features: [
      { title: { pt: "Recarregável", en: "Reloadable" }, text: { pt: "Carregue apenas o valor que precisa e gaste com total controlo.", en: "Load only the amount you need and spend with full control." }, icon: "refresh" },
      { title: { pt: "Ideal para compras online", en: "Ideal for online shopping" }, text: { pt: "Um meio de pagamento seguro para a internet, sem expor a sua conta.", en: "A secure means of payment online, without exposing your account." }, icon: "online" },
      { title: { pt: "Prático em viagem", en: "Handy when travelling" }, text: { pt: "Leve consigo um cartão simples, aceite na rede Mastercard.", en: "Take a simple card with you, accepted on the Mastercard network." }, icon: "globe" },
      { title: { pt: "Controlo de gastos", en: "Spending control" }, text: { pt: "Só gasta o que carrega — perfeito para orçamentos e mesadas.", en: "You only spend what you load — perfect for budgets and allowances." }, icon: "wallet" },
      { title: { pt: "Ideal para presentear", en: "Great for gifting" }, text: { pt: "Um cartão prático para oferecer a quem gosta.", en: "A practical card to give to someone you care about." }, icon: "gift" },
      { title: { pt: "Recarga pelo MyBCS", en: "Top up via MyBCS" }, text: { pt: "Carregue e acompanhe o saldo diretamente na aplicação.", en: "Top up and track your balance right in the app." }, icon: "phone" },
    ],
    benefits: [
      { title: { pt: "Controlo de gastos", en: "Spending control" }, text: { pt: "Só gasta o que carrega — perfeito para orçamentos e presentes.", en: "You only spend what you load — perfect for budgets and gifts." } },
      { title: { pt: "Sem surpresas", en: "No surprises" }, text: { pt: "Um cartão simples e transparente para o dia a dia.", en: "A simple, transparent card for everyday life." } },
      { title: { pt: "Segurança", en: "Security" }, text: { pt: "Proteja a sua conta principal usando o pré-pago para compras online.", en: "Protect your main account by using the prepaid card for online purchases." } },
      { title: { pt: "Fácil de gerir", en: "Easy to manage" }, text: { pt: "Acompanhe e recarregue o cartão pelo MyBCS.", en: "Track and top up the card via MyBCS." } },
    ],
    faq: [
      { q: { pt: "Como carrego o meu Pré-pago Sublime?", en: "How do I top up my Sublime Prepaid?" }, a: { pt: "Pode carregar o cartão pelo MyBCS ou numa agência BCS, no valor que pretender.", en: "You can top up the card via MyBCS or at a BCS branch, with any amount you like." } },
      { q: { pt: "Preciso de ter conta no BCS?", en: "Do I need a BCS account?" }, a: { pt: "Fale connosco para conhecer as condições de adesão ao cartão pré-pago.", en: "Get in touch to learn about the conditions for the prepaid card." } },
      { q: { pt: "Posso usar em compras internacionais?", en: "Can I use it for international purchases?" }, a: { pt: "Sim, o cartão é aceite na rede Mastercard para compras online e no estrangeiro.", en: "Yes, the card is accepted on the Mastercard network for online and overseas purchases." } },
    ],
  },
};

function Faq({ item }: { item: { q: Translatable; a: Translatable } }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[15px] font-bold" style={{ color: "#30170a" }}>{t(item.q)}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 transition-transform" style={{ transform: open ? "rotate(180deg)" : "none" }}>
          <path d="M6 9l6 6 6-6" stroke="#b8860b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="grid transition-all duration-300" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed" style={{ color: "rgba(48,23,10,0.7)" }}>{t(item.a)}</p>
        </div>
      </div>
    </div>
  );
}

const PHOTOS = ["/cartoes.jpg", "/reacao-2.jpg"];

const REACTIONS: { platform: "ig" | "fb" | "li"; name: string; handle: string; text: Translatable; likes: number }[] = [
  { platform: "ig", name: "Ana Fernandes", handle: "@ana.fdes", text: { pt: "Usei o cartão na viagem e foi aceite em todo o lado, sem stress! 🙌", en: "I used the card on my trip and it was accepted everywhere, no stress! 🙌" }, likes: 128 },
  { platform: "fb", name: "Miguel Sousa", handle: "Miguel S.", text: { pt: "Contactless super rápido e o controlo pelo MyBCS é excelente.", en: "Super-fast contactless and the control via MyBCS is excellent." }, likes: 86 },
  { platform: "ig", name: "José Tavares", handle: "@jose.t", text: { pt: "Finalmente um cartão que funciona lá fora. Recomendo! 🔥", en: "Finally a card that works abroad. Highly recommend! 🔥" }, likes: 203 },
  { platform: "li", name: "Teresa Lopes", handle: "Teresa L.", text: { pt: "Adoro os benefícios e o atendimento do Banco BCS.", en: "I love the benefits and the service from Banco BCS." }, likes: 54 },
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
  const { t } = useLang();
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
            aria-label={`${t({ pt: "Foto", en: "Photo" })} ${idx + 1}`}
            className="h-2 rounded-full transition-all"
            style={{ width: i === idx ? 22 : 8, background: i === idx ? "#fff" : "rgba(255,255,255,0.55)" }}
          />
        ))}
      </div>
    </div>
  );
}

function FeaturesCarousel({ features }: { features: { title: Translatable; text: Translatable; icon: FeatureIconName }[] }) {
  const { t } = useLang();
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
          aria-label={t({ pt: "Ver anteriores", en: "See previous" })}
          className="grid h-11 w-11 place-items-center rounded-full border border-black/10 transition-colors hover:bg-black/5"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#30170a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label={t({ pt: "Ver mais", en: "See more" })}
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
            key={f.title.pt}
            data-card
            className="w-[85%] shrink-0 snap-start rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:w-[47%] lg:w-[31.5%]"
          >
            <FeatureIcon name={f.icon} />
            <h3 className="mt-5 text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>{t(f.title)}</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(48,23,10,0.7)" }}>{t(f.text)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CardDetailPage() {
  const { t } = useLang();
  const { slug } = useParams();
  const card = slug ? CARDS[slug] : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!card) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#fcfcfc] px-6 text-center" style={{ color: "#30170a" }}>
        <div>
          <h1 className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>{t({ pt: "Cartão não encontrado", en: "Card not found" })}</h1>
          <Link to="/" className="mt-4 inline-block font-bold" style={{ color: "#b8860b" }}>← {t({ pt: "Voltar ao início", en: "Back to home" })}</Link>
        </div>
      </div>
    );
  }

  const isSvg = card.image.endsWith(".svg");

  return (
    <div className="font-body">
      <PageSkeleton variant="card" />
      <Navbar />

      {/* Hero do cartão */}
      <section
        className="w-full overflow-hidden px-6 pb-12 pt-24 text-white md:pb-16 md:pt-28"
        style={{ background: "linear-gradient(135deg, #1a1204 0%, #2a1e08 55%, #14100a 100%)" }}
      >
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h1 className="leading-[1.05]" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(32px, 4.6vw, 56px)" }}>
              {t(card.tagline)}
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/75">{t(card.desc)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => openAuth("signup")}
                className="rounded-lg px-7 py-3.5 text-sm font-bold text-[#0a0805] transition-transform hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg, #f4dd94 0%, #d4af37 55%, #b8860b 100%)" }}
              >
                {t({ pt: "Aderir ao cartão", en: "Get the card" })}
              </button>
              <Link
                to="/"
                className="rounded-lg border border-white/20 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/5"
              >
                {t({ pt: "Voltar", en: "Back" })}
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <img
              src={card.image}
              alt={t(card.name)}
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
            {t({ pt: "A reação de quem", en: "What people who" })} <span style={{ color: "#b8860b" }}>{t({ pt: "já usa", en: "already use it say" })}</span>
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
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(48,23,10,0.8)" }}>{t(c.text)}</p>
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
            {t({ pt: "Um cartão", en: "A card" })} <span style={{ color: "#b8860b" }}>{t({ pt: "sem fronteiras", en: "without borders" })}</span>
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed" style={{ color: "rgba(48,23,10,0.7)" }}>
            {t({ pt: "Quer explorar as vantagens exclusivas que este cartão oferece?", en: "Want to explore the exclusive advantages this card offers?" })}
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
            {t({ pt: "Feito para funcionar,", en: "Built to work," })} <span style={{ color: "#8a5a12" }}>{t({ pt: "no seu ritmo", en: "at your pace" })}</span>
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {card.benefits.map((b) => (
              <div key={b.title.pt} className="flex gap-4 rounded-2xl bg-white/70 p-5">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full" style={{ background: "linear-gradient(135deg, #e8c86a, #b8860b)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#0a0805" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-[15px] font-bold">{t(b.title)}</h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "rgba(48,23,10,0.7)" }}>{t(b.text)}</p>
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
            {t({ pt: "Perguntas", en: "Frequently asked" })} <span style={{ color: "#b8860b" }}>{t({ pt: "frequentes", en: "questions" })}</span>
          </h2>
          <div className="mt-8">
            {card.faq.map((item) => (
              <Faq key={item.q.pt} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="w-full px-6 py-20 text-white" style={{ background: "linear-gradient(135deg, #1a1204 0%, #14100a 100%)" }}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="leading-[1.1]" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(28px, 4vw, 44px)" }}>
            {t({ pt: "Pronto para ter o seu", en: "Ready to get your" })} <span className="text-gold">{t(card.badge)}</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
            {t({ pt: "Abra a sua conta no Banco BCS e adira ao", en: "Open your account at Banco BCS and get the" })} {t(card.name)} {t({ pt: "em poucos minutos.", en: "in just a few minutes." })}
          </p>
          <button
            onClick={() => openAuth("signup")}
            className="mt-8 rounded-lg px-8 py-4 text-sm font-bold text-[#0a0805] transition-transform hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg, #f4dd94 0%, #d4af37 55%, #b8860b 100%)" }}
          >
            {t({ pt: "Abrir uma conta", en: "Open an account" })}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
