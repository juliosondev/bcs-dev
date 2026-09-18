import { useEffect } from "react";
import { useLang, type Translatable } from "../i18n";

/**
 * "O Banco BCS nas redes" — combina:
 *  1) um post real em DESTAQUE (iframe): reel do Instagram via embed.js;
 *  2) o EFEITO de colunas verticais em loop (marquee) do levelsoft.ao, com
 *     cards de posts do Instagram (@banco_bcs) e LinkedIn (Banco BCS).
 * Para trocar o destaque, altere FEATURED. Para os cards, edite POSTS.
 */
const IG_PROFILE = "https://www.instagram.com/banco_bcs/";
const LI_PROFILE = "https://www.linkedin.com/company/banco-bcs";

// Post real em destaque (Instagram Reel)
const FEATURED = "https://www.instagram.com/reel/DThvsQ6D8vP/?utm_source=ig_embed&utm_campaign=loading";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

type Post = { platform: "ig" | "li"; caption: Translatable; href: string };

const POSTS: Post[] = [
  { platform: "ig", caption: { pt: "Abra a sua Conta à Ordem 100% online 📲", en: "Open your Current Account 100% online 📲" }, href: IG_PROFILE },
  { platform: "li", caption: { pt: "BCS Economic Focus: as tendências do mês para a sua empresa.", en: "BCS Economic Focus: this month's trends for your business." }, href: LI_PROFILE },
  { platform: "ig", caption: { pt: "Dicas simples para poupar no dia a dia 💰", en: "Simple tips to save every day 💰" }, href: IG_PROFILE },
  { platform: "li", caption: { pt: "Estamos a recrutar! Junte-se à equipa BCS.", en: "We're hiring! Join the BCS team." }, href: LI_PROFILE },
  { platform: "ig", caption: { pt: "Cartão de Débito BCS: compre e levante em qualquer lugar.", en: "BCS Debit Card: pay and withdraw anywhere." }, href: IG_PROFILE },
  { platform: "li", caption: { pt: "BCS EasyPay: receba pagamentos com mais facilidade.", en: "BCS EasyPay: receive payments with greater ease." }, href: LI_PROFILE },
  { platform: "ig", caption: { pt: "Conta Júnior: eduque os mais novos a poupar.", en: "Junior Account: teach the little ones to save." }, href: IG_PROFILE },
  { platform: "li", caption: { pt: "Inaugurámos uma nova agência em Luanda.", en: "We've opened a new branch in Luanda." }, href: LI_PROFILE },
];

function IgIcon({ stroke = "#30170a" }: { stroke?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke={stroke} strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" fill="none" stroke={stroke} strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.2" fill={stroke} />
    </svg>
  );
}
function LiIcon({ fill = "#30170a" }: { fill?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={fill}>
      <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.4 8h4.16v12H.4zM8 8h3.99v1.64h.06c.56-1.06 1.94-2.18 4-2.18 4.28 0 5.07 2.82 5.07 6.48V20h-4.16v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V20H8z" />
    </svg>
  );
}

function Card({ post }: { post: Post }) {
  const { t } = useLang();
  const isIg = post.platform === "ig";
  return (
    <a
      href={post.href}
      target="_blank"
      rel="noreferrer"
      className="block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-transform hover:scale-[1.02]"
    >
      <div
        className="relative flex aspect-[4/3] items-center justify-center"
        style={{
          background: isIg
            ? "linear-gradient(135deg, #f4dd94, #d4af37)"
            : "linear-gradient(135deg, #2a1e08, #4a3410)",
        }}
      >
        <img src="/logo.png" alt="" className="h-12 w-auto opacity-90" />
        <span className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-lg bg-white/90 shadow">
          {isIg ? <IgIcon /> : <LiIcon />}
        </span>
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold" style={{ color: "#b8860b" }}>
          {isIg ? "@banco_bcs" : "Banco BCS"}
        </span>
        <p className="mt-1 text-sm leading-snug" style={{ color: "rgba(48,23,10,0.85)" }}>
          {t(post.caption)}
        </p>
      </div>
    </a>
  );
}

function Column({ posts, duration, reverse }: { posts: Post[]; duration: number; reverse?: boolean }) {
  return (
    <div
      className="bcs-marquee-col relative h-[560px] overflow-hidden"
      style={{
        WebkitMaskImage: "linear-gradient(transparent, #000 12%, #000 88%, transparent)",
        maskImage: "linear-gradient(transparent, #000 12%, #000 88%, transparent)",
      }}
    >
      <div
        className="bcs-marquee-track flex flex-col gap-4"
        style={{ animation: `bcs-scroll-y ${duration}s linear infinite${reverse ? " reverse" : ""}` }}
      >
        {[...posts, ...posts].map((p, i) => (
          <Card key={i} post={p} />
        ))}
      </div>
    </div>
  );
}

export default function SocialFeed() {
  const { t } = useLang();
  // Carrega/reprocessa o embed.js do Instagram (para o destaque)
  useEffect(() => {
    const id = "instagram-embed-js";
    if (document.getElementById(id)) {
      window.instgrm?.Embeds?.process();
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = "https://www.instagram.com/embed.js";
    s.onload = () => window.instgrm?.Embeds?.process();
    document.body.appendChild(s);
  }, []);

  const colA = POSTS.filter((_, i) => i % 2 === 0);
  const colB = POSTS.filter((_, i) => i % 2 === 1);

  return (
    <section className="w-full overflow-hidden px-6 py-20 md:py-28" style={{ background: "#fcfcfc", color: "#30170a" }}>
      <div className="mx-auto max-w-7xl">
        {/* Cabeçalho */}
        <div className="max-w-2xl">
          <h2
            className="leading-[1.05]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(30px, 4.4vw, 50px)" }}
          >
            {t({ pt: "O Banco BCS", en: "Banco BCS" })} <span style={{ color: "#b8860b" }}>{t({ pt: "nas redes", en: "on social" })}</span>
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed" style={{ color: "rgba(48,23,10,0.7)" }}>
            {t({
              pt: "Acompanhe as novidades, dicas financeiras e os bastidores do Banco BCS no Instagram e no LinkedIn.",
              en: "Follow Banco BCS news, financial tips and behind-the-scenes on Instagram and LinkedIn.",
            })}
          </p>
        </div>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-12">
          {/* DESTAQUE: post real (iframe) */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(48,23,10,0.45)" }}>
              {t({ pt: "Em destaque", en: "Featured" })}
            </span>
            <div
              className="mt-3 overflow-hidden rounded-2xl bg-white"
              style={{
                maxWidth: 380,
                border: "1px solid rgba(48,23,10,0.08)",
                boxShadow: "0 24px 60px -24px rgba(48,23,10,0.55)",
              }}
            >
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={FEATURED}
                data-instgrm-version="14"
                style={{
                  background: "#FFF",
                  border: 0,
                  borderRadius: 0,
                  boxShadow: "none",
                  margin: 0,
                  width: "100%",
                  padding: 0,
                }}
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={IG_PROFILE}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
                style={{ background: "#30170a" }}
              >
                <IgIcon stroke="#fff" /> Instagram
              </a>
              <a
                href={LI_PROFILE}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-black/15 px-5 py-2.5 text-sm font-bold transition-colors hover:bg-black/5"
                style={{ color: "#30170a" }}
              >
                <LiIcon /> LinkedIn
              </a>
            </div>
          </div>

          {/* EFEITO: colunas animadas de posts */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Column posts={colA} duration={28} />
            <Column posts={colB} duration={34} reverse />
            <div className="hidden sm:block">
              <Column posts={colA} duration={24} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
