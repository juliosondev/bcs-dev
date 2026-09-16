/**
 * Rodapé — informações do site https://www.bancobcs.ao/
 * (contactos, newsletter, morada, links úteis, serviços, soluções e redes
 * sociais), no tema dourado escuro do site.
 */
import { openAuth } from "./AuthModal";

const BASE = "https://www.bancobcs.ao";

const COLUMNS: { title: string; links: { label: string; href: string; ext?: boolean }[] }[] = [
  {
    title: "Links Úteis",
    links: [
      { label: "Preçário", href: `${BASE}/particulares/precario` },
      { label: "Sobre nós", href: `${BASE}/quem-somos` },
      { label: "Abrir uma conta", href: `${BASE}/abrir-conta` },
      { label: "Trabalhe connosco", href: `${BASE}/quem-somos/carreiras` },
      { label: "Onde estamos", href: `${BASE}/quem-somos/o-banco/onde-estamos` },
    ],
  },
  {
    title: "Serviços Centrais",
    links: [
      { label: "Fale connosco", href: "tel:+244225300803" },
      { label: "Dúvidas frequentes", href: `${BASE}/quem-somos/perguntas-frequentes` },
      { label: "Canal de denúncias", href: `${BASE}/quem-somos/canal-de-denuncias` },
      { label: "Suporte ao Cliente", href: `${BASE}/quem-somos/provedoria-do-cliente` },
      { label: "Políticas de Cookies", href: `${BASE}/quem-somos/politicas-de-cookies` },
      { label: "Política de privacidade", href: `${BASE}/quem-somos/politicas-de-privacidade` },
    ],
  },
  {
    title: "Soluções",
    links: [
      { label: "MyBCS Particulares", href: "https://ebnkp.bancobcs.ao/", ext: true },
      { label: "MyBCS Empresas", href: "https://ebnke.bancobcs.ao/", ext: true },
      { label: "Simulador de crédito", href: "#simuladores" },
      { label: "Simulador de depósito a prazo", href: "#simuladores" },
    ],
  },
];

const SOCIALS: { label: string; href: string; path: React.ReactNode }[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/banco-bcs",
    path: <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.4 8h4.16v12H.4zM8 8h3.99v1.64h.06c.56-1.06 1.94-2.18 4-2.18 4.28 0 5.07 2.82 5.07 6.48V20h-4.16v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V20H8z" fill="currentColor" />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/banco_bcs/",
    path: <><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" /></>,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/BancoBCS",
    path: <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.55.45-1 1-1z" fill="currentColor" />,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@bancobcs",
    path: <><rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M10 9l6 3-6 3z" fill="currentColor" /></>,
  },
];

export default function Footer() {
  return (
    <footer
      className="w-full px-6 pt-16 pb-8 text-white"
      style={{ background: "linear-gradient(135deg, #1a1204 0%, #14100a 100%)" }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Topo: marca + newsletter */}
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Banco BCS" className="h-11 w-auto" />
              <span className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Banco BCS
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
              Edifício Garden Towers – Torre B, Piso 15, Complexo Comandante Gika,
              Luanda, Angola.
            </p>
            <div className="mt-5 space-y-1 text-sm">
              <span className="block text-white/60">BCS Consigo</span>
              <a href="tel:+244225300803" className="text-lg font-bold text-gold hover:underline">
                (+244) 225 300 803
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:justify-self-end md:text-right">
            <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
              BCS Economic Focus Mensal
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Insira o seu e-mail e receba a nossa newsletter mensal.
            </p>
            <form
              className="mt-4 flex max-w-sm gap-2 md:ml-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="O seu e-mail"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg px-5 py-3 text-sm font-bold text-[#0a0805] transition-transform hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg, #f4dd94 0%, #d4af37 55%, #b8860b 100%)" }}
              >
                Assinar
              </button>
            </form>
          </div>
        </div>

        {/* Colunas de links */}
        <div className="grid gap-8 py-12 sm:grid-cols-2 md:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gold">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => {
                  const isMyBCS = l.label.startsWith("MyBCS");
                  return (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        {...(isMyBCS
                          ? { onClick: (e: React.MouseEvent) => { e.preventDefault(); openAuth("login"); } }
                          : l.ext || l.href.startsWith("http")
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                        className="text-sm text-white/70 transition-colors hover:text-gold"
                      >
                        {l.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Base: redes sociais + copyright */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          <span className="text-sm text-white/50">© 2026 Banco BCS. Todos os direitos reservados.</span>
          <div className="flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-gold hover:text-gold"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  {s.path}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
