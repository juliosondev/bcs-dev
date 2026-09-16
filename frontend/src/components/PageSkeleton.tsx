import { useEffect, useRef, useState } from "react";

/**
 * Skeleton de carregamento — cobre o ecrã enquanto o site carrega, com
 * blocos "bcs-sk" no formato de cada conteúdo (navbar, hero, cartões).
 * Some com fade quando a página termina de carregar.
 */
export default function PageSkeleton() {
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
      {/* Hero (fundo escuro) */}
      <div className="relative h-[92vh]" style={{ background: "linear-gradient(135deg,#1a1204,#14100a)" }}>
        {/* Navbar */}
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
          <div className="bcs-sk-dark h-11 w-11 rounded-xl lg:hidden" />
        </div>

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
    </div>
  );
}
