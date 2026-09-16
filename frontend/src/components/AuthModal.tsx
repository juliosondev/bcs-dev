import { useEffect, useState } from "react";
import api from "../lib/api";

/** Abre o modal a partir de qualquer sítio: openAuth("login" | "signup"). */
export function openAuth(tab: "login" | "signup" = "login") {
  window.dispatchEvent(new CustomEvent("bcs:auth", { detail: { tab } }));
}

const TESTIMONIALS = [
  {
    quote:
      "Com o BCS faço a gestão do meu património e as minhas operações em poucos minutos, com total segurança e acompanhamento personalizado.",
    name: "Kianda Nsimba",
    role: "Cliente Private",
  },
  {
    quote:
      "Abrir a conta foi rápido e simples. Hoje resolvo quase tudo pelo MyBCS, sem precisar de me deslocar à agência.",
    name: "Mário Amaral",
    role: "Empresário — Large Corporate",
  },
];

function Field({
  label,
  name,
  type = "text",
  placeholder,
  forgot,
  required,
}: {
  label: string;
  name?: string;
  type?: string;
  placeholder?: string;
  forgot?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {forgot && (
          <a href="#" className="text-xs font-semibold" style={{ color: "#b8860b" }}>
            Esqueceu a palavra-passe?
          </a>
        )}
      </div>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#d4af37]"
      />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="pt-1 text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(48,23,10,0.45)" }}>
      {children}
    </p>
  );
}

export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [ti, setTi] = useState(0);
  const [person, setPerson] = useState<"empresa" | "singular">("singular");
  const [situacao, setSituacao] = useState<"empregado" | "estudante">("empregado");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLogin) return; // login tratado noutro fluxo
    setSubmitting(true);
    setStatus(null);

    const fd = new FormData(e.currentTarget);
    const payload: Record<string, string> = { person_type: person };
    fd.forEach((v, k) => (payload[k] = String(v)));
    if (person === "singular") payload.situacao = situacao;

    try {
      const { data } = await api.post("/registrations", payload);
      setStatus({
        ok: true,
        msg:
          data?.sms === "sent"
            ? "Registo criado! Enviámos um SMS de confirmação para o seu telefone."
            : "Registo criado com sucesso! Em breve entraremos em contacto.",
      });
      e.currentTarget.reset();
    } catch {
      setStatus({ ok: false, msg: "Não foi possível concluir o registo. Verifique os dados e tente novamente." });
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent).detail as { tab?: "login" | "signup" };
      setTab(d?.tab ?? "login");
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("bcs:auth", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("bcs:auth", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  const isLogin = tab === "login";
  const t = TESTIMONIALS[ti];

  return (
    <div
      className="fixed inset-0 z-[100] grid bg-white md:grid-cols-[71%_29%]"
      style={{ animation: "bcs-slide-in-soft 0.2s ease-out" }}
    >
      {/* Painel do formulário (esquerda, ocupa toda a altura) */}
      <div
        className="relative flex items-center justify-center overflow-y-auto px-6 py-14 md:px-10"
        style={{ color: "#30170a" }}
      >
        {/* Fechar */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Fechar"
          className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/5 text-[#30170a] transition-colors hover:bg-black/10"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="mx-auto flex w-fit gap-1 rounded-xl bg-black/5 p-1">
            <button
              onClick={() => setTab("login")}
              className="rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors"
              style={{ background: isLogin ? "#fff" : "transparent", boxShadow: isLogin ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}
            >
              Entrar
            </button>
            <button
              onClick={() => setTab("signup")}
              className="rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors"
              style={{ background: !isLogin ? "#fff" : "transparent", boxShadow: !isLogin ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}
            >
              Criar conta
            </button>
          </div>

          <h2 className="mt-7 text-center text-2xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
            {isLogin ? "Bem-vindo de volta!" : "Crie a sua conta BCS"}
          </h2>
          <p className="mt-1 text-center text-sm" style={{ color: "rgba(48,23,10,0.6)" }}>
            {isLogin ? "Introduza os seus dados para entrar." : "Preencha os seus dados para começar."}
          </p>

          {/* Tipo de cliente (apenas ao criar conta) */}
          {!isLogin && (
            <div className="mt-6 flex gap-1 rounded-full bg-black/5 p-1">
              {(["singular", "empresa"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPerson(p)}
                  className="flex-1 rounded-full py-2 text-sm font-semibold transition-colors"
                  style={{
                    background: person === p ? "#fff" : "transparent",
                    boxShadow: person === p ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                    color: person === p ? "#30170a" : "rgba(48,23,10,0.6)",
                  }}
                >
                  {p === "singular" ? "Singular" : "Empresa"}
                </button>
              ))}
            </div>
          )}

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            {isLogin ? (
              <>
                <Field label="Endereço de e-mail" name="email" type="email" placeholder="Introduza o seu e-mail" />
                <Field label="Palavra-passe" name="password" type="password" placeholder="Introduza a sua palavra-passe" forgot />
              </>
            ) : person === "empresa" ? (
              <>
                <SectionLabel>Dados da empresa</SectionLabel>
                <Field label="Nome da empresa" name="company_name" placeholder="Designação social" required />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="NIF da empresa" name="company_nif" placeholder="Número de contribuinte" />
                  <Field label="Telefone" name="phone" type="tel" placeholder="(+244) 9…" required />
                </div>
                <Field label="E-mail da empresa" name="email" type="email" placeholder="empresa@exemplo.ao" />

                <SectionLabel>Sócio-gerente</SectionLabel>
                <Field label="Nome do sócio-gerente" name="manager_name" placeholder="Nome completo" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nº do Bilhete de Identidade" name="manager_bi" placeholder="000000000LA000" />
                  <Field label="Cargo" name="manager_role" placeholder="Ex.: Gerente" />
                </div>
                <Field label="Palavra-passe" name="password" type="password" placeholder="Crie uma palavra-passe" />
              </>
            ) : (
              <>
                <SectionLabel>Dados pessoais</SectionLabel>
                <Field label="Nome completo" name="full_name" placeholder="O seu nome" required />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nº do Bilhete de Identidade" name="bi_number" placeholder="000000000LA000" />
                  <Field label="Telefone" name="phone" type="tel" placeholder="(+244) 9…" required />
                </div>
                <Field label="Endereço de e-mail" name="email" type="email" placeholder="Introduza o seu e-mail" />

                <SectionLabel>Situação</SectionLabel>
                <div className="flex gap-1 rounded-full bg-black/5 p-1">
                  {(["empregado", "estudante"] as const).map((sit) => (
                    <button
                      key={sit}
                      type="button"
                      onClick={() => setSituacao(sit)}
                      className="flex-1 rounded-full py-2 text-sm font-semibold transition-colors"
                      style={{
                        background: situacao === sit ? "#fff" : "transparent",
                        boxShadow: situacao === sit ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                        color: situacao === sit ? "#30170a" : "rgba(48,23,10,0.6)",
                      }}
                    >
                      {sit === "empregado" ? "Empregado" : "Estudante"}
                    </button>
                  ))}
                </div>
                {situacao === "empregado" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Entidade empregadora" name="work_entity" placeholder="Nome da empresa" />
                    <Field label="Profissão" name="work_role" placeholder="A sua função" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Instituição de ensino" name="work_entity" placeholder="Escola / universidade" />
                    <Field label="Curso" name="work_role" placeholder="O seu curso" />
                  </div>
                )}
                <Field label="Palavra-passe" name="password" type="password" placeholder="Crie uma palavra-passe" />
              </>
            )}

            {status && (
              <p
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  background: status.ok ? "rgba(52,168,83,0.12)" : "rgba(220,38,38,0.1)",
                  color: status.ok ? "#1e7a3a" : "#b3261e",
                }}
              >
                {status.msg}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl py-3 text-sm font-bold text-[#0a0805] transition-transform hover:scale-[1.01] disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #f4dd94 0%, #d4af37 55%, #b8860b 100%)" }}
            >
              {submitting ? "A processar…" : isLogin ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "rgba(48,23,10,0.6)" }}>
            {isLogin ? "Ainda não tem conta? " : "Já tem conta? "}
            <button
              onClick={() => setTab(isLogin ? "signup" : "login")}
              className="font-bold underline"
              style={{ color: "#b8860b" }}
            >
              {isLogin ? "Criar conta" : "Entrar"}
            </button>
          </p>
        </div>
      </div>

      {/* Imagem + testemunho (direita, ocupa toda a altura) */}
        <div className="relative hidden md:block">
          <img src="/conta.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(26,18,4,0.55) 0%, rgba(26,18,4,0) 55%)" }} />
          <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-black/35 p-5 text-white backdrop-blur-md">
            <p className="text-sm leading-relaxed">“{t.quote}”</p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="font-bold">{t.name}</p>
                <p className="text-xs text-white/70">{t.role}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setTi((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                  aria-label="Anterior"
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/25 transition-colors hover:bg-white/10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button
                  onClick={() => setTi((i) => (i + 1) % TESTIMONIALS.length)}
                  aria-label="Próximo"
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/25 transition-colors hover:bg-white/10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
