import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { openAuth } from "./AuthModal";
import { useLang, type Translatable } from "../i18n";

const BASE = "https://www.bancobcs.ao";

type Item = { label: Translatable; desc: Translatable; href: string; icon: IconName };
type Menu = {
  id: string;
  label: Translatable;
  href?: string; // itens sem dropdown (link directo)
  featured?: { title: Translatable; desc: Translatable; href: string };
  items?: Item[];
};

// Rótulos genéricos da navbar (fora dos menus)
const UI = {
  explore: { pt: "Explorar", en: "Explore" },
  myAccount: { pt: "MyBCS", en: "MyBCS" },
  openAccount: { pt: "Abrir conta", en: "Open account" },
  openMenu: { pt: "Abrir menu", en: "Open menu" },
  closeMenu: { pt: "Fechar menu", en: "Close menu" },
} satisfies Record<string, Translatable>;

const MENUS: Menu[] = [
  {
    id: "contas",
    label: { pt: "Contas", en: "Accounts" },
    featured: {
      title: { pt: "Contas BCS", en: "BCS Accounts" },
      desc: { pt: "A conta certa para cada fase da sua vida.", en: "The right account for every stage of your life." },
      href: `${BASE}/particulares/contas/conta-a-ordem`,
    },
    items: [
      { label: { pt: "Conta à Ordem", en: "Current Account" }, desc: { pt: "O seu dia a dia", en: "Your everyday banking" }, href: `${BASE}/particulares/contas/conta-a-ordem`, icon: "wallet" },
      { label: { pt: "Conta Flex", en: "Flex Account" }, desc: { pt: "Flexível e sem complicações", en: "Flexible and hassle-free" }, href: `${BASE}/particulares/contas/conta-flex`, icon: "wallet" },
      { label: { pt: "Conta Simplificada", en: "Simplified Account" }, desc: { pt: "Simples e rápida de abrir", en: "Simple and quick to open" }, href: `${BASE}/particulares/contas/conta-simplificada`, icon: "doc" },
      { label: { pt: "Conta Júnior", en: "Junior Account" }, desc: { pt: "Para os mais novos", en: "For the younger ones" }, href: `${BASE}/particulares/contas/conta-junior`, icon: "piggy" },
    ],
  },
  {
    id: "cartoes",
    label: { pt: "Cartões", en: "Cards" },
    featured: {
      title: { pt: "Cartões BCS", en: "BCS Cards" },
      desc: { pt: "O cartão ideal para cada momento.", en: "The ideal card for every moment." },
      href: `${BASE}/particulares/cartoes/cartao-de-debito`,
    },
    items: [
      { label: { pt: "Cartão de Débito", en: "Debit Card" }, desc: { pt: "Compre e levante com o seu saldo", en: "Spend and withdraw with your balance" }, href: `${BASE}/particulares/cartoes/cartao-de-debito`, icon: "card" },
      { label: { pt: "Cartão de Crédito", en: "Credit Card" }, desc: { pt: "Mais poder de compra", en: "More purchasing power" }, href: `${BASE}/particulares/cartoes/cartao-de-credito`, icon: "card" },
      { label: { pt: "Cartão Pré-Pago", en: "Prepaid Card" }, desc: { pt: "Controle os seus gastos", en: "Control your spending" }, href: `${BASE}/particulares/cartoes/cartao-pre-pago`, icon: "card" },
    ],
  },
  {
    id: "poupanca",
    label: { pt: "Poupança e investimento", en: "Savings & investment" },
    featured: {
      title: { pt: "Poupança & Investimento", en: "Savings & Investment" },
      desc: { pt: "Faça o seu dinheiro trabalhar por si.", en: "Make your money work for you." },
      href: `${BASE}/particulares/poupanca-e-investimento/poupanca-online-particulares`,
    },
    items: [
      { label: { pt: "Poupança Online", en: "Online Savings" }, desc: { pt: "Poupe de forma simples", en: "Save the simple way" }, href: `${BASE}/particulares/poupanca-e-investimento/poupanca-online-particulares`, icon: "piggy" },
      { label: { pt: "BCS Gold", en: "BCS Gold" }, desc: { pt: "Rentabilize as suas poupanças", en: "Grow your savings" }, href: `${BASE}/particulares/poupanca-e-investimento/bcs-gold`, icon: "coins" },
      { label: { pt: "BCS Liquidez", en: "BCS Liquidity" }, desc: { pt: "Dinheiro disponível quando precisar", en: "Cash available when you need it" }, href: `${BASE}/particulares/poupanca-e-investimento/bcs-liquidez`, icon: "coins" },
      { label: { pt: "Fundos de Investimento", en: "Investment Funds" }, desc: { pt: "Diversifique o seu património", en: "Diversify your wealth" }, href: `${BASE}/particulares/poupanca-e-investimento/fundos-de-investimento`, icon: "chart" },
    ],
  },
  {
    id: "credito",
    label: { pt: "Crédito", en: "Credit" },
    featured: {
      title: { pt: "Crédito BCS", en: "BCS Credit" },
      desc: { pt: "Soluções de crédito para os seus planos.", en: "Credit solutions for your plans." },
      href: `${BASE}/particulares/credito/credito-ao-consumo`,
    },
    items: [
      { label: { pt: "BCS Antecipa", en: "BCS Advance" }, desc: { pt: "Antecipe o seu ordenado", en: "Get your salary in advance" }, href: `${BASE}/particulares/credito/bcs-antecipa`, icon: "coins" },
      { label: { pt: "Descoberto Flex", en: "Flex Overdraft" }, desc: { pt: "Liquidez para imprevistos", en: "Liquidity for the unexpected" }, href: `${BASE}/particulares/credito/descoberto-flex`, icon: "coins" },
      { label: { pt: "Crédito ao consumo", en: "Consumer Credit" }, desc: { pt: "Realize os seus projetos", en: "Bring your projects to life" }, href: `${BASE}/particulares/credito/credito-ao-consumo`, icon: "doc" },
      { label: { pt: "Crédito automóvel", en: "Auto Loan" }, desc: { pt: "O carro que sempre quis", en: "The car you always wanted" }, href: `${BASE}/particulares/credito/credito-automovel`, icon: "car" },
      { label: { pt: "Crédito habitação", en: "Home Loan" }, desc: { pt: "A casa dos seus sonhos", en: "The home of your dreams" }, href: `${BASE}/particulares/credito/credito-habitacao`, icon: "home" },
    ],
  },
  {
    id: "servicos",
    label: { pt: "Serviços", en: "Services" },
    featured: {
      title: { pt: "Serviços BCS", en: "BCS Services" },
      desc: { pt: "Ferramentas para o seu dia a dia.", en: "Tools for your everyday life." },
      href: `${BASE}/particulares/servicos/bcs-cash`,
    },
    items: [
      { label: { pt: "BCS Cash", en: "BCS Cash" }, desc: { pt: "Gestão de tesouraria", en: "Treasury management" }, href: "/servicos/bcs-cash", icon: "cash" },
      { label: { pt: "BCS EasyPay", en: "BCS EasyPay" }, desc: { pt: "Receba pagamentos com facilidade", en: "Get paid with ease" }, href: "/servicos/easypay", icon: "pay" },
    ],
  },
  { id: "obcs", label: { pt: "O BCS", en: "About BCS" }, href: `${BASE}/quem-somos` },
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
  const { t, lang, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
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
  const activeMenu = MENUS.find((m) => m.id === active && m.items);

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
                key={m.id}
                onMouseEnter={() => openMenu(m.id)}
                className={`flex items-center gap-1 transition-colors ${
                  active === m.id ? (solid ? "text-[#8a5a12]" : "text-gold") : ""
                } ${solid ? "hover:text-[#8a5a12]" : "hover:text-gold"}`}
              >
                {t(m.label)}
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  className="transition-transform duration-200"
                  style={{ transform: active === m.id ? "rotate(180deg)" : "none" }}
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : (
              <a
                key={m.id}
                href={m.href}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => openMenu(m.id)}
                className={`transition-colors ${solid ? "hover:text-[#8a5a12]" : "hover:text-gold"}`}
              >
                {t(m.label)}
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
                onMouseEnter={() => openMenu(activeMenu.id)}
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
                        {t(activeMenu.featured!.title)}
                      </h3>
                      <p className="mt-1 text-sm text-[#0a0805]/75">{t(activeMenu.featured!.desc)}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#0a0805]">
                        {t(UI.explore)}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-1">
                          <path d="M5 12h14M13 6l6 6-6 6" stroke="#0a0805" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </a>

                  {/* Itens */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(48,23,10,0.45)" }}>
                      {t(activeMenu.label)}
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
                                {t(it.label)}
                              </span>
                              <span className="block text-xs" style={{ color: "rgba(48,23,10,0.6)" }}>
                                {t(it.desc)}
                              </span>
                            </span>
                          </>
                        );
                        const cls = "flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-[rgba(224,199,140,0.22)]";
                        return internal ? (
                          <Link key={it.href} to={it.href} onClick={closeMenu} className={cls}>
                            {content}
                          </Link>
                        ) : (
                          <a key={it.href} href={it.href} target="_blank" rel="noreferrer" className={cls}>
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
          {/* Selector de idioma PT | EN */}
          <div
            className="flex items-center rounded-lg p-0.5 text-xs font-bold"
            style={{
              background: solid ? "rgba(48,23,10,0.08)" : "rgba(255,255,255,0.15)",
              border: `1px solid ${solid ? "rgba(48,23,10,0.15)" : "rgba(255,255,255,0.3)"}`,
            }}
            role="group"
            aria-label={lang === "pt" ? "Idioma" : "Language"}
          >
            {(["pt", "en"] as const).map((code) => {
              const isActive = lang === code;
              return (
                <button
                  key={code}
                  onClick={() => code !== lang && toggle()}
                  aria-pressed={isActive}
                  className="rounded-md px-2 py-1 uppercase transition-colors"
                  style={
                    isActive
                      ? { background: "linear-gradient(135deg, #f4dd94, #d4af37)", color: "#0a0805" }
                      : { color: solid ? "rgba(48,23,10,0.7)" : "rgba(255,255,255,0.85)" }
                  }
                >
                  {code}
                </button>
              );
            })}
          </div>

          {/* Botão MyBCS (desktop) */}
          <button
            onClick={() => openAuth("login")}
            className="hidden items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-[#0a0805] transition-transform hover:scale-[1.03] lg:inline-flex"
            style={{ background: "linear-gradient(135deg, #f4dd94 0%, #d4af37 55%, #b8860b 100%)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20a7 7 0 0 1 14 0" stroke="#0a0805" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {t(UI.myAccount)}
          </button>

          {/* Hambúrguer (mobile) */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-xl lg:hidden"
            style={{ background: "linear-gradient(135deg, #e8c86a, #b8860b)" }}
            aria-label={mobileOpen ? t(UI.closeMenu) : t(UI.openMenu)}
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
              {MENUS.map((m) => {
                // Opção sem submenu — link directo
                if (!m.items) {
                  return (
                    <a
                      key={m.id}
                      href={m.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between border-b border-black/5 py-3 text-[15px] font-semibold"
                      style={{ color: "#30170a" }}
                    >
                      {t(m.label)}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 6l6 6-6 6" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  );
                }
                // Opção com submenu — expande ao clicar
                const expanded = mobileSub === m.id;
                return (
                  <div key={m.id} className="border-b border-black/5">
                    <button
                      onClick={() => setMobileSub((cur) => (cur === m.id ? null : m.id))}
                      aria-expanded={expanded}
                      className="flex w-full items-center justify-between py-3 text-[15px] font-semibold"
                      style={{ color: "#30170a" }}
                    >
                      {t(m.label)}
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        className="transition-transform duration-200"
                        style={{ transform: expanded ? "rotate(180deg)" : "none" }}
                      >
                        <path d="M6 9l6 6 6-6" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {/* Submenu (collapse) */}
                    <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}>
                      <div className="overflow-hidden">
                        <div className="flex flex-col gap-1 pb-2">
                          {m.items!.map((it) => {
                            const internal = it.href.startsWith("/");
                            const content = (
                              <>
                                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: "rgba(232,200,106,0.15)" }}>
                                  <Icon name={it.icon} />
                                </span>
                                <span>
                                  <span className="block text-sm font-semibold" style={{ color: "#30170a" }}>{t(it.label)}</span>
                                  <span className="block text-xs" style={{ color: "rgba(48,23,10,0.55)" }}>{t(it.desc)}</span>
                                </span>
                              </>
                            );
                            const cls = "flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-[rgba(224,199,140,0.18)]";
                            return internal ? (
                              <Link key={it.href} to={it.href} onClick={() => setMobileOpen(false)} className={cls}>
                                {content}
                              </Link>
                            ) : (
                              <a key={it.href} href={it.href} target="_blank" rel="noreferrer" onClick={() => setMobileOpen(false)} className={cls}>
                                {content}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => { setMobileOpen(false); openAuth("login"); }}
                className="rounded-lg border border-black/15 py-3 text-sm font-bold"
                style={{ color: "#30170a" }}
              >
                {t(UI.myAccount)}
              </button>
              <button
                onClick={() => { setMobileOpen(false); openAuth("signup"); }}
                className="rounded-lg py-3 text-sm font-bold text-[#0a0805]"
                style={{ background: "linear-gradient(135deg, #f4dd94 0%, #d4af37 55%, #b8860b 100%)" }}
              >
                {t(UI.openAccount)}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
