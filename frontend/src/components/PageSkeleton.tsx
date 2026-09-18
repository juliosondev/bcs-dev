import { useEffect, useRef, useState } from "react";

/**
 * Skeleton de carregamento — cobre o ecrã enquanto a página carrega, com
 * blocos "bcs-sk" no formato do conteúdo. Some com fade quando termina.
 *
 * A prop `variant` escolhe o esqueleto conforme o modelo da página:
 *  - "home"    → hero + fileira de cartões (página inicial)
 *  - "card"    → hero de duas colunas (detalhe de cartão)
 *  - "easypay" → hero de uma coluna + vídeo (BCS EasyPay)
 *
 * A lógica de carregamento é partilhada por todas as variantes.
 */
type Variant = "home" | "card" | "easypay";

export default function PageSkeleton({ variant = "home" }: { variant?: Variant }) {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(true);
  const start = useRef(Date.now());

  useEffect(() => {
    if (window.location.hash === "#sk") return; // pré-visualização: mantém visível
    const MIN = 900; // tempo mínimo visível para a marca de carregamento
    const finish = () => {
      const wait = Math.max(0, MIN - (Date.now() - start.current));
      setTimeout(() => setLoading(false), wait);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish);
    const cap = setTimeout(() => setLoading(false), 4000); // segurança
    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(cap);
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setMounted(false), 500); // aguarda o fade
      return () => clearTimeout(t);
    }
  }, [loading]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[200] overflow-hidden bg-[#fcfcfc] transition-opacity duration-500"
      style={{ opacity: loading ? 1 : 0, pointerEvents: loading ? "auto" : "none" }}
    >
      {variant === "home" && <HomeSkeleton />}
      {variant === "card" && <CardSkeleton />}
      {variant === "easypay" && <EasyPaySkeleton />}
    </div>
  );
}

/* Navbar (blocos escuros sobre o hero) — partilhada pelas variantes */
function NavSkeleton() {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="bcs-sk-dark h-10 w-10 rounded-lg" />
        <div className="bcs-sk-dark h-5 w-28" />
      </div>
      <div className="hidden gap-6 lg:flex">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bcs-sk-dark h-4 w-16" />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="bcs-sk-dark h-8 w-16 rounded-lg" />
        <div className="bcs-sk-dark h-11 w-11 rounded-xl lg:hidden" />
      </div>
    </div>
  );
}

/* ---------- HOME: hero + fileira de cartões ---------- */
function HomeSkeleton() {
  return (
    <>
      {/* Hero (fundo escuro) */}
      <div className="relative h-[92vh]" style={{ background: "linear-gradient(135deg,#1a1204,#14100a)" }}>
        <NavSkeleton />

        {/* Conteúdo do hero (canto inferior esquerdo) */}
        <div className="absolute bottom-28 left-0 right-0 mx-auto max-w-7xl px-6">
          <div className="max-w-md">
            <div className="mb-6 grid grid-cols-2 gap-2.5">
              <div className="bcs-sk-dark h-14 rounded-lg" />
              <div className="bcs-sk-dark h-14 rounded-lg" />
            </div>
            <div className="bcs-sk-dark mb-3 h-10 w-3/4 rounded-md" />
            <div className="bcs-sk-dark mb-6 h-10 w-1/2 rounded-md" />
            <div className="space-y-2">
              <div className="bcs-sk-dark h-3 w-full" />
              <div className="bcs-sk-dark h-3 w-11/12" />
              <div className="bcs-sk-dark h-3 w-2/3" />
            </div>
            <div className="bcs-sk-dark mt-6 h-11 w-44 rounded-lg" />
          </div>
        </div>

        {/* Marquee inferior */}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-10 border-t border-white/10 px-6 py-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bcs-sk-dark h-5 w-24 shrink-0" />
          ))}
        </div>
      </div>

      {/* Seção clara: cabeçalho + fileira de cartões */}
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-3">
            <div className="bcs-sk h-8 w-80 rounded-md" />
            <div className="bcs-sk h-8 w-56 rounded-md" />
          </div>
          <div className="hidden gap-3 md:flex">
            <div className="bcs-sk h-12 w-12 rounded-full" />
            <div className="bcs-sk h-12 w-12 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bcs-sk h-[320px] rounded-2xl sm:h-[420px]" />
          <div className="bcs-sk hidden h-[420px] rounded-2xl sm:block" />
          <div className="bcs-sk hidden h-[420px] rounded-2xl sm:block" />
        </div>
      </div>
    </>
  );
}

/* ---------- CARD: hero de duas colunas (texto + imagem do cartão) ---------- */
function CardSkeleton() {
  return (
    <>
      {/* Hero do cartão (fundo escuro) */}
      <div style={{ background: "linear-gradient(135deg, #1a1204 0%, #2a1e08 55%, #14100a 100%)" }}>
        <NavSkeleton />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-10 md:grid-cols-2 md:gap-16">
          {/* Texto à esquerda */}
          <div>
            <div className="bcs-sk-dark mb-3 h-11 w-full rounded-md" />
            <div className="bcs-sk-dark mb-3 h-11 w-4/5 rounded-md" />
            <div className="mt-6 space-y-2">
              <div className="bcs-sk-dark h-3 w-full" />
              <div className="bcs-sk-dark h-3 w-11/12" />
              <div className="bcs-sk-dark h-3 w-2/3" />
            </div>
            <div className="mt-8 flex gap-3">
              <div className="bcs-sk-dark h-12 w-40 rounded-lg" />
              <div className="bcs-sk-dark h-12 w-28 rounded-lg" />
            </div>
          </div>
          {/* Imagem do cartão à direita */}
          <div className="flex justify-center md:justify-end">
            <div className="bcs-sk-dark h-52 w-[300px] rotate-[-6deg] rounded-2xl md:h-60 md:w-[360px]" />
          </div>
        </div>
      </div>

      {/* Seção clara: título + (slide de fotos | cartões de comentário) */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="bcs-sk mb-10 h-9 w-72 rounded-md" />
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="bcs-sk aspect-[4/5] rounded-3xl" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-black/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="bcs-sk h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="bcs-sk h-3 w-32" />
                    <div className="bcs-sk h-2.5 w-20" />
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="bcs-sk h-3 w-full" />
                  <div className="bcs-sk h-3 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- EASYPAY: hero de uma coluna + vídeo ---------- */
function EasyPaySkeleton() {
  return (
    <>
      {/* Hero (fundo escuro, conteúdo à esquerda) */}
      <div style={{ background: "linear-gradient(135deg, #1a1204 0%, #2a1e08 55%, #14100a 100%)" }}>
        <NavSkeleton />
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
          <div className="max-w-lg">
            <div className="bcs-sk-dark mb-3 h-11 w-full rounded-md" />
            <div className="bcs-sk-dark mb-3 h-11 w-3/4 rounded-md" />
            <div className="mt-6 space-y-2">
              <div className="bcs-sk-dark h-3 w-full" />
              <div className="bcs-sk-dark h-3 w-5/6" />
              <div className="bcs-sk-dark h-3 w-2/3" />
            </div>
            <div className="mt-8 flex gap-3">
              <div className="bcs-sk-dark h-12 w-44 rounded-lg" />
              <div className="bcs-sk-dark h-12 w-36 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Seção clara: rótulo + título + vídeo (16:9) */}
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="bcs-sk mx-auto h-3 w-40 rounded" />
        <div className="bcs-sk mx-auto mt-5 h-9 w-3/4 rounded-md" />
        <div className="bcs-sk mx-auto mt-3 h-9 w-1/2 rounded-md" />
        <div className="mx-auto mt-6 max-w-2xl space-y-2">
          <div className="bcs-sk mx-auto h-3 w-full" />
          <div className="bcs-sk mx-auto h-3 w-5/6" />
        </div>
        {/* placeholder do vídeo */}
        <div className="bcs-sk mx-auto mt-10 aspect-video max-w-3xl rounded-3xl" />
      </div>
    </>
  );
}
