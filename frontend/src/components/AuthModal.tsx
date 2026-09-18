import { useEffect, useState } from "react";
import api from "../lib/api";
import { useLang, type Translatable } from "../i18n";

/** Abre o modal a partir de qualquer sítio: openAuth("login" | "signup"). */
export function openAuth(tab: "login" | "signup" = "login") {
  window.dispatchEvent(new CustomEvent("bcs:auth", { detail: { tab } }));
}

const TESTIMONIALS: { quote: Translatable; name: string; role: Translatable }[] = [
  {
    quote: {
      pt: "Com o BCS faço a gestão do meu património e as minhas operações em poucos minutos, com total segurança e acompanhamento personalizado.",
      en: "With BCS I manage my assets and operations in just a few minutes, with total security and personalised support.",
    },
    name: "Kianda Nsimba",
    role: { pt: "Cliente Private", en: "Private Client" },
  },
  {
    quote: {
      pt: "Abrir a conta foi rápido e simples. Hoje resolvo quase tudo pelo MyBCS, sem precisar de me deslocar à agência.",
      en: "Opening the account was quick and simple. Today I handle almost everything through MyBCS, without going to a branch.",
    },
    name: "Mário Amaral",
    role: { pt: "Empresário — Large Corporate", en: "Business owner — Large Corporate" },
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
  const { t } = useLang();
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {forgot && (
          <a href="#" className="text-xs font-semibold" style={{ color: "#b8860b" }}>
            {t({ pt: "Esqueceu a palavra-passe?", en: "Forgot your password?" })}
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
  const { t } = useLang();
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
            ? t({ pt: "Registo criado! Enviámos um SMS de confirmação para o seu telefone.", en: "Registration created! We've sent a confirmation SMS to your phone." })
            : t({ pt: "Registo criado com sucesso! Em breve entraremos em contacto.", en: "Registration created successfully! We'll be in touch soon." }),
      });
      e.currentTarget.reset();
    } catch {
      setStatus({ ok: false, msg: t({ pt: "Não foi possível concluir o registo. Verifique os dados e tente novamente.", en: "We couldn't complete the registration. Please check your details and try again." }) });
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
  const current = TESTIMONIALS[ti];

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
          aria-label={t({ pt: "Fechar", en: "Close" })}
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
              {t({ pt: "Entrar", en: "Sign in" })}
            </button>
            <button
              onClick={() => setTab("signup")}
              className="rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors"
              style={{ background: !isLogin ? "#fff" : "transparent", boxShadow: !isLogin ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}
            >
              {t({ pt: "Criar conta", en: "Create account" })}
            </button>
          </div>

          <h2 className="mt-7 text-center text-2xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
            {isLogin ? t({ pt: "Bem-vindo de volta!", en: "Welcome back!" }) : t({ pt: "Crie a sua conta BCS", en: "Create your BCS account" })}
          </h2>
          <p className="mt-1 text-center text-sm" style={{ color: "rgba(48,23,10,0.6)" }}>
            {isLogin ? t({ pt: "Introduza os seus dados para entrar.", en: "Enter your details to sign in." }) : t({ pt: "Preencha os seus dados para começar.", en: "Fill in your details to get started." })}
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
                  {p === "singular" ? t({ pt: "Singular", en: "Individual" }) : t({ pt: "Empresa", en: "Business" })}
                </button>
              ))}
            </div>
          )}

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            {isLogin ? (
              <>
                <Field label={t({ pt: "Endereço de e-mail", en: "Email address" })} name="email" type="email" placeholder={t({ pt: "Introduza o seu e-mail", en: "Enter your email" })} />
                <Field label={t({ pt: "Palavra-passe", en: "Password" })} name="password" type="password" placeholder={t({ pt: "Introduza a sua palavra-passe", en: "Enter your password" })} forgot />
              </>
            ) : person === "empresa" ? (
              <>
                <SectionLabel>{t({ pt: "Dados da empresa", en: "Company details" })}</SectionLabel>
                <Field label={t({ pt: "Nome da empresa", en: "Company name" })} name="company_name" placeholder={t({ pt: "Designação social", en: "Legal name" })} required />
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t({ pt: "NIF da empresa", en: "Company tax ID" })} name="company_nif" placeholder={t({ pt: "Número de contribuinte", en: "Taxpayer number" })} />
                  <Field label={t({ pt: "Telefone", en: "Phone" })} name="phone" type="tel" placeholder="(+244) 9…" required />
                </div>
                <Field label={t({ pt: "E-mail da empresa", en: "Company email" })} name="email" type="email" placeholder="empresa@exemplo.ao" />

                <SectionLabel>{t({ pt: "Sócio-gerente", en: "Managing partner" })}</SectionLabel>
                <Field label={t({ pt: "Nome do sócio-gerente", en: "Managing partner's name" })} name="manager_name" placeholder={t({ pt: "Nome completo", en: "Full name" })} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t({ pt: "Nº do Bilhete de Identidade", en: "ID card number" })} name="manager_bi" placeholder="000000000LA000" />
                  <Field label={t({ pt: "Cargo", en: "Role" })} name="manager_role" placeholder={t({ pt: "Ex.: Gerente", en: "E.g.: Manager" })} />
                </div>
                <Field label={t({ pt: "Palavra-passe", en: "Password" })} name="password" type="password" placeholder={t({ pt: "Crie uma palavra-passe", en: "Create a password" })} />
              </>
            ) : (
              <>
                <SectionLabel>{t({ pt: "Dados pessoais", en: "Personal details" })}</SectionLabel>
                <Field label={t({ pt: "Nome completo", en: "Full name" })} name="full_name" placeholder={t({ pt: "O seu nome", en: "Your name" })} required />
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t({ pt: "Nº do Bilhete de Identidade", en: "ID card number" })} name="bi_number" placeholder="000000000LA000" />
                  <Field label={t({ pt: "Telefone", en: "Phone" })} name="phone" type="tel" placeholder="(+244) 9…" required />
                </div>
                <Field label={t({ pt: "Endereço de e-mail", en: "Email address" })} name="email" type="email" placeholder={t({ pt: "Introduza o seu e-mail", en: "Enter your email" })} />

                <SectionLabel>{t({ pt: "Situação", en: "Status" })}</SectionLabel>
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
                      {sit === "empregado" ? t({ pt: "Empregado", en: "Employed" }) : t({ pt: "Estudante", en: "Student" })}
                    </button>
                  ))}
                </div>
                {situacao === "empregado" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={t({ pt: "Entidade empregadora", en: "Employer" })} name="work_entity" placeholder={t({ pt: "Nome da empresa", en: "Company name" })} />
                    <Field label={t({ pt: "Profissão", en: "Occupation" })} name="work_role" placeholder={t({ pt: "A sua função", en: "Your role" })} />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={t({ pt: "Instituição de ensino", en: "Educational institution" })} name="work_entity" placeholder={t({ pt: "Escola / universidade", en: "School / university" })} />
                    <Field label={t({ pt: "Curso", en: "Course" })} name="work_role" placeholder={t({ pt: "O seu curso", en: "Your course" })} />
                  </div>
                )}
                <Field label={t({ pt: "Palavra-passe", en: "Password" })} name="password" type="password" placeholder={t({ pt: "Crie uma palavra-passe", en: "Create a password" })} />
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
              {submitting ? t({ pt: "A processar…", en: "Processing…" }) : isLogin ? t({ pt: "Entrar", en: "Sign in" }) : t({ pt: "Criar conta", en: "Create account" })}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "rgba(48,23,10,0.6)" }}>
            {isLogin ? t({ pt: "Ainda não tem conta? ", en: "Don't have an account yet? " }) : t({ pt: "Já tem conta? ", en: "Already have an account? " })}
            <button
              onClick={() => setTab(isLogin ? "signup" : "login")}
              className="font-bold underline"
              style={{ color: "#b8860b" }}
            >
              {isLogin ? t({ pt: "Criar conta", en: "Create account" }) : t({ pt: "Entrar", en: "Sign in" })}
            </button>
          </p>
        </div>
      </div>

      {/* Imagem + testemunho (direita, ocupa toda a altura) */}
        <div className="relative hidden md:block">
          <img src="/conta.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(26,18,4,0.55) 0%, rgba(26,18,4,0) 55%)" }} />
          <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-black/35 p-5 text-white backdrop-blur-md">
            <p className="text-sm leading-relaxed">“{t(current.quote)}”</p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="font-bold">{current.name}</p>
                <p className="text-xs text-white/70">{t(current.role)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setTi((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                  aria-label={t({ pt: "Anterior", en: "Previous" })}
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/25 transition-colors hover:bg-white/10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button
                  onClick={() => setTi((i) => (i + 1) % TESTIMONIALS.length)}
                  aria-label={t({ pt: "Próximo", en: "Next" })}
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
