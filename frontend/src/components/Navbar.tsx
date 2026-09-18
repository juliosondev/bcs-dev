import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { openAuth } from "./AuthModal";

const BASE = "https://www.bancobcs.ao";

type Item = { label: string; desc: string; href: string; icon: IconName };
type Menu = {
  label: string;
  href?: string; // itens sem dropdown (link directo)
  featured?: { title: string; desc: string; href: string };
  items?: Item[];
};

const MENUS: Menu[] = [
  {
    label: "Contas",
    featured: {
      title: "Contas BCS",
      desc: "A conta certa para cada fase da sua vida.",
      href: `${BASE}/particulares/contas/conta-a-ordem`,
    },
    items: [
      { label: "Conta à Ordem", desc: "O seu dia a dia", href: `${BASE}/particulares/contas/conta-a-ordem`, icon: "wallet" },
      { label: "Conta Flex", desc: "Flexível e sem complicações", href: `${BASE}/particulares/contas/conta-flex`, icon: "wallet" },
      { label: "Conta Simplificada", desc: "Simples e rápida de abrir", href: `${BASE}/particulares/contas/conta-simplificada`, icon: "doc" },
      { label: "Conta Júnior", desc: "Para os mais novos", href: `${BASE}/particulares/contas/conta-junior`, icon: "piggy" },
    ],
  },
  {
    label: "Cartões",
    featured: {
      title: "Cartões BCS",
      desc: "O cartão ideal para cada momento.",
      href: `${BASE}/particulares/cartoes/cartao-de-debito`,
    },
    items: [
      { label: "Cartão de Débito", desc: "Compre e levante com o seu saldo", href: `${BASE}/particulares/cartoes/cartao-de-debito`, icon: "card" },
      { label: "Cartão de Crédito", desc: "Mais poder de compra", href: `${BASE}/particulares/cartoes/cartao-de-credito`, icon: "card" },
      { label: "Cartão Pré-Pago", desc: "Controle os seus gastos", href: `${BASE}/particulares/cartoes/cartao-pre-pago`, icon: "card" },
    ],
  },
  {
    label: "Poupança e investimento",
    featured: {
      title: "Poupança & Investimento",
      desc: "Faça o seu dinheiro trabalhar por si.",
      href: `${BASE}/particulares/poupanca-e-investimento/poupanca-online-particulares`,
    },
    items: [
      { label: "Poupança Online", desc: "Poupe de forma simples", href: `${BASE}/particulares/poupanca-e-investimento/poupanca-online-particulares`, icon: "piggy" },
      { label: "BCS Gold", desc: "Rentabilize as suas poupanças", href: `${BASE}/particulares/poupanca-e-investimento/bcs-gold`, icon: "coins" },
      { label: "BCS Liquidez", desc: "Dinheiro disponível quando precisar", href: `${BASE}/particulares/poupanca-e-investimento/bcs-liquidez`, icon: "coins" },
      { label: "Fundos de Investimento", desc: "Diversifique o seu património", href: `${BASE}/particulares/poupanca-e-investimento/fundos-de-investimento`, icon: "chart" },
    ],
  },
  {
    label: "Crédito",
    featured: {
      title: "Crédito BCS",
      desc: "Soluções de crédito para os seus planos.",
      href: `${BASE}/particulares/credito/credito-ao-consumo`,
    },
    items: [
      { label: "BCS Antecipa", desc: "Antecipe o seu ordenado", href: `${BASE}/particulares/credito/bcs-antecipa`, icon: "coins" },
      { label: "Descoberto Flex", desc: "Liquidez para imprevistos", href: `${BASE}/particulares/credito/descoberto-flex`, icon: "coins" },
      { label: "Crédito ao consumo", desc: "Realize os seus projetos", href: `${BASE}/particulares/credito/credito-ao-consumo`, icon: "doc" },
      { label: "Crédito automóvel", desc: "O carro que sempre quis", href: `${BASE}/particulares/credito/credito-automovel`, icon: "car" },
      { label: "Crédito habitação", desc: "A casa dos seus sonhos", href: `${BASE}/particulares/credito/credito-habitacao`, icon: "home" },
    ],
  },
  {
    label: "Serviços",
    featured: {
      title: "Serviços BCS",
      desc: "Ferramentas para o seu dia a dia.",
      href: `${BASE}/particulares/servicos/bcs-cash`,
    },
    items: [
      { label: "BCS Cash", desc: "Gestão de tesouraria", href: `${BASE}/particulares/servicos/bcs-cash`, icon: "cash" },
      { label: "BCS EasyPay", desc: "Receba pagamentos com facilidade", href: "/servicos/easypay", icon: "pay" },
    ],
  },
  { label: "O BCS", href: `${BASE}/quem-somos` },
];

type IconName = "wallet" | "card" | "piggy" | "coins" | "chart" | "doc" | "car" | "home" | "cash" | "pay";

function Icon({ name }: { name: IconName }) {
  const p = { fill: "none", stroke: "#b8860b", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<IconName, React.ReactNode> = {
    wallet: <><rect x="3" y="6" width="18" height="13" rx="2" {...p} /><path d="M16 12h2" {...p} /></>,
    card: <><rect x="3" y="6" width="18" height="12" rx="2" {...p} /><path d="M3 10h18" {...p} /></>,
    piggy: <><path d="M4 13a6 5 0 1 1 12 0 6 5 0 0 1-12 0Z" {...p} /><path d="M16 11l3-1v4M8 9V7M7 18v2M13 18v2" {...p} /></>,
    coins: <><ellipse cx="8" cy="7" rx="5" ry="2.5" {...p} /><path d="M3 7v5c0 1.4 2.2 2.5 5 2.5" {...p} /><ellipse cx="15" cy="14" rx="5" ry="2.5" {...p} /><path d="M10 14v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4" {...p} /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-6M22 20H2" {...p} /></>,
    doc: <><path d="M6 3h9l4 4v14H6z" {...p} /><path d="M14 3v5h5M9 13h7M9 17h7" {...p} /></>,
    car: <><path d="M4 13l2-5h12l2 5M3 13h18v5H3zM6 18v2M18 18v2" {...p} /><circle cx="7.5" cy="15.5" r="1" {...p} /><circle cx="16.5" cy="15.5" r="1" {...p} /></>,
    home: <><path d="M4 11l8-6 8 6M6 10v9h12v-9" {...p} /><path d="M10 19v-5h4v5" {...p} /></>,
    cash: <><rect x="2" y="6" width="20" height="12" rx="2" {...p} /><circle cx="12" cy="12" r="2.5" {...p} /></>,
    pay: <><path d="M21 8v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11" {...p} /><path d="M16 12l3 3 4-5" {...p} /></>,
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMenu = (label: string) => {
    window.clearTimeout(timer.current);
    setActive(label);
  };
  const closeMenu = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setActive(null), 120);
  };

  const solid = scrolled || active !== null || mobileOpen;
  const activeMenu = MENUS.find((m) => m.label === active && m.items);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
        solid ? "backdrop-blur-xl" : ""
      }`}
      style={{ background: solid ? "rgba(224,199,140,0.95)" : "transparent" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Banco BCS" className="h-10 w-auto" />
          <span
            className="text-2xl font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: solid ? "#30170a" : "#fff" }}
          >
            Banco BCS
          </span>
        </a>

        {/* Menu desktop com mega-menu */}
        <nav
          className="hidden items-center gap-7 text-sm font-semibold lg:flex"
          style={{ color: solid ? "rgba(48,23,10,0.85)" : "rgba(255,255,255,0.9)" }}
          onMouseLeave={closeMenu}
        >
          {MENUS.map((m) =>
            m.items ? (
              <button
                key={m.label}
                onMouseEnter={() => openMenu(m.label)}
                className={`flex items-center gap-1 transition-colors ${
                  active === m.label ? (solid ? "text-[#8a5a12]" : "text-gold") : ""
                } ${solid ? "hover:text-[#8a5a12]" : "hover:text-gold"}`}
              >
                {m.label}
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  className="transition-transform duration-200"
                  style={{ transform: active === m.label ? "rotate(180deg)" : "none" }}
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : (
              <a
                key={m.label}
                href={m.href}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => openMenu(m.label)}
                className={`transition-colors ${solid ? "hover:text-[#8a5a12]" : "hover:text-gold"}`}
              >
                {m.label}
              </a>
            )
          )}

          {/* Painel do mega-menu (estilo Wise) */}
          {activeMenu && (
            <>
              {/* escurece o resto da página */}
              <div className="fixed inset-x-0 bottom-0 top-[62px] -z-10 bg-black/25" style={{ animation: "bcs-slide-in-soft 0.2s ease-out" }} />
              <div
                className="fixed left-1/2 top-[70px] w-[min(940px,calc(100vw-32px))] -translate-x-1/2"
                style={{ animation: "bcs-slide-in-soft 0.22s ease-out" }}
                onMouseEnter={() => openMenu(activeMenu.label)}
              >
                <div className="grid grid-cols-1 gap-6 rounded-3xl border border-black/5 bg-white p-6 shadow-2xl md:grid-cols-[280px_1fr]">
                  {/* Card destaque */}
                  <a
                    href={activeMenu.featured!.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col justify-between rounded-2xl p-6 transition-transform hover:scale-[1.01]"
                    style={{ background: "linear-gradient(135deg, #f4dd94, #d4af37)" }}
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#0a0805]/10">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M4 6l8 12 8-12" stroke="#0a0805" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div className="mt-8">
                      <h3 className="text-xl font-extrabold text-[#0a0805]" style={{ fontFamily: "var(--font-display)" }}>
                        {activeMenu.featured!.title}
                      </h3>
                      <p className="mt-1 text-sm text-[#0a0805]/75">{activeMenu.featured!.desc}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#0a0805]">
                        Explorar
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-1">
                          <path d="M5 12h14M13 6l6 6-6 6" stroke="#0a0805" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </a>

                  {/* Itens */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(48,23,10,0.45)" }}>
                      {activeMenu.label}
                    </span>
                    <div className="mt-3 grid gap-1 sm:grid-cols-2">
                      {activeMenu.items!.map((it) => {
                        const internal = it.href.startsWith("/");
                        const content = (
                          <>
                            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: "rgba(232,200,106,0.15)" }}>
                              <Icon name={it.icon} />
                            </span>
                            <span>
                              <span className="block text-sm font-bold" style={{ color: "#30170a" }}>
                                {it.label}
                              </span>
                              <span className="block text-xs" style={{ color: "rgba(48,23,10,0.6)" }}>
                                {it.desc}
                              </span>
                            </span>
                          </>
                        );
                        const cls = "flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-[rgba(224,199,140,0.22)]";
                        return internal ? (
                          <Link key={it.label} to={it.href} onClick={closeMenu} className={cls}>
                            {content}
                          </Link>
                        ) : (
                          <a key={it.label} href={it.href} target="_blank" rel="noreferrer" className={cls}>
                            {content}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </nav>

        {/* Ações à direita */}
        <div className="flex items-center gap-3">
          {/* Botão MyBCS (desktop) */}
          <button
            onClick={() => openAuth("login")}
            className="hidden items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-[#0a0805] transition-transform hover:scale-[1.03] lg:inline-flex"
            style={{ background: "linear-gradient(135deg, #f4dd94 0%, #d4af37 55%, #b8860b 100%)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20a7 7 0 0 1 14 0" stroke="#0a0805" strokeWidth="2" strokeLinecap="round" />
            </svg>
            MyBCS
          </button>

          {/* Hambúrguer (mobile) */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-xl lg:hidden"
            style={{ background: "linear-gradient(135deg, #e8c86a, #b8860b)" }}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="#0a0805" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            ) : (
              <div className="space-y-1.5">
                <span className="block h-0.5 w-6 rounded bg-[#0a0805]" />
                <span className="block h-0.5 w-6 rounded bg-[#0a0805]" />
                <span className="block h-0.5 w-6 rounded bg-[#0a0805]" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="lg:hidden" style={{ animation: "bcs-slide-in-soft 0.2s ease-out" }}>
          <div className="mx-4 mb-4 max-h-[75vh] overflow-y-auto rounded-2xl border border-black/10 bg-white p-4 shadow-2xl">
            <nav className="flex flex-col">
              {MENUS.map((m) => (
                <a
                  key={m.label}
                  href={m.items ? m.featured!.href : m.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between border-b border-black/5 py-3 text-[15px] font-semibold"
                  style={{ color: "#30170a" }}
                >
                  {m.label}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6l6 6-6 6" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ))}
            </nav>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => { setMobileOpen(false); openAuth("login"); }}
                className="rounded-lg border border-black/15 py-3 text-sm font-bold"
                style={{ color: "#30170a" }}
              >
                MyBCS
              </button>
              <button
                onClick={() => { setMobileOpen(false); openAuth("signup"); }}
                className="rounded-lg py-3 text-sm font-bold text-[#0a0805]"
                style={{ background: "linear-gradient(135deg, #f4dd94 0%, #d4af37 55%, #b8860b 100%)" }}
              >
                Abrir conta
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
