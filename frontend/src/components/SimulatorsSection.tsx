import { useEffect, useRef, useState } from "react";
import api from "../lib/api";
import { useLang, type Translatable } from "../i18n";

/**
 * Seção "Os nossos simuladores" — conceito de Collapse com a área de opções
 * na lateral esquerda (accordion). Cada opção abre a sua descrição e ativa o
 * simulador correspondente no painel à direita.
 *  - Simulador de Depósito a Prazo (juros simples)
 *  - Simulador de Crédito (prestação mensal / sistema francês)
 */
const fmt = new Intl.NumberFormat("pt-AO", {
  style: "currency",
  currency: "AOA",
  maximumFractionDigits: 0,
});

const OPTIONS: { key: string; title: Translatable; desc: Translatable }[] = [
  {
    key: "deposito",
    title: { pt: "Simulador de Depósito a Prazo", en: "Term Deposit Simulator" },
    desc: {
      pt: "Descubra quanto o seu dinheiro rende ao aplicar num depósito a prazo, escolhendo o valor, o período e a taxa anual.",
      en: "Discover how much your money earns in a term deposit by choosing the amount, the period and the annual rate.",
    },
  },
  {
    key: "credito",
    title: { pt: "Simulador de Crédito", en: "Loan Simulator" },
    desc: {
      pt: "Calcule a prestação mensal do seu crédito e o total a pagar, ajustando o montante, o prazo e a taxa anual.",
      en: "Calculate your loan's monthly instalment and total payable by adjusting the amount, the term and the annual rate.",
    },
  },
  {
    key: "bcsai",
    title: { pt: "BCS AI", en: "BCS AI" },
    desc: {
      pt: "Converse com o nosso assistente e tire dúvidas sobre financiamento e crédito, com base na legislação angolana e nos regulamentos do BCS.",
      en: "Chat with our assistant and clear up questions about financing and credit, based on Angolan legislation and BCS regulations.",
    },
  },
];

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium" style={{ color: "rgba(48,23,10,0.7)" }}>
          {label}
        </span>
        <span
          className="text-base font-bold"
          style={{ color: "#30170a", fontFamily: "var(--font-display)" }}
        >
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[#b8860b]"
        style={{ accentColor: "#b8860b" }}
      />
    </div>
  );
}

type ChatMsg = { role: "user" | "assistant"; content: string };

const SUGESTOES: Translatable[] = [
  { pt: "Que tipos de crédito o BCS oferece?", en: "What types of credit does BCS offer?" },
  { pt: "Que documentos preciso para pedir um crédito?", en: "What documents do I need to apply for a loan?" },
  { pt: "Como abrir uma conta no BCS?", en: "How do I open an account at BCS?" },
  { pt: "O que é o MyBCS?", en: "What is MyBCS?" },
  { pt: "Como funciona o crédito habitação?", en: "How does the home loan work?" },
  { pt: "O que é o BCS EasyPay?", en: "What is BCS EasyPay?" },
];

function ChatPanel() {
  const { t } = useLang();
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: t({
        pt: "Olá! Sou o BCS AI. Posso ajudar com dúvidas sobre financiamento e crédito no Banco BCS, com base na legislação angolana. Como posso ajudar?",
        en: "Hi! I'm BCS AI. I can help with questions about financing and credit at Banco BCS, based on Angolan legislation. How can I help?",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [demo, setDemo] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    const next: ChatMsg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setLoading(true);
    // Traz o chat para o foco da página enquanto a resposta é gerada
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    try {
      // Não envia a saudação inicial (a API exige começar por 'user')
      const payload = next.slice(1).map(({ role, content }) => ({ role, content }));
      const { data } = await api.post("/ai/chat", { messages: payload });
      if (data?.demo) setDemo(true);
      setMessages((m) => [...m, { role: "assistant", content: data?.reply ?? "…" }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: t({ pt: "Ocorreu um erro ao contactar o assistente. Tente novamente.", en: "There was an error contacting the assistant. Please try again." }) },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={rootRef} className="flex h-[440px] flex-col scroll-mt-24">
      <div className="flex items-center gap-3 border-b border-black/5 pb-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "linear-gradient(135deg, #e8c86a, #b8860b)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z" stroke="#0a0805" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="flex-1">
          <h3 className="text-lg font-bold leading-none" style={{ fontFamily: "var(--font-display)" }}>BCS AI</h3>
          <p className="mt-1 text-xs" style={{ color: "rgba(48,23,10,0.55)" }}>{t({ pt: "Assistente de financiamento e crédito", en: "Financing and credit assistant" })}</p>
        </div>
        {demo && (
          <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide" style={{ background: "rgba(232,200,106,0.2)", color: "#8a5a12" }}>
            {t({ pt: "Modo demonstração", en: "Demo mode" })}
          </span>
        )}
      </div>

      {/* Mensagens */}
      <div className="flex-1 space-y-3 overflow-y-auto py-4 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
              style={
                m.role === "user"
                  ? { background: "linear-gradient(135deg, #f4dd94, #d4af37)", color: "#0a0805" }
                  : { background: "rgba(48,23,10,0.05)", color: "#30170a" }
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-2.5 text-sm" style={{ background: "rgba(48,23,10,0.05)", color: "rgba(48,23,10,0.6)" }}>
              {t({ pt: "A escrever…", en: "Typing…" })}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Sugestões */}
      {messages.length <= 1 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGESTOES.map((s) => (
            <button
              key={s.pt}
              onClick={() => send(t(s))}
              className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-black/[0.03]"
              style={{ color: "rgba(48,23,10,0.75)" }}
            >
              {t(s)}
            </button>
          ))}
        </div>
      )}

      {/* Entrada */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t({ pt: "Escreva a sua pergunta…", en: "Type your question…" })}
          className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#d4af37]"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label={t({ pt: "Enviar", en: "Send" })}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-[#0a0805] transition-transform hover:scale-[1.03] disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #f4dd94 0%, #d4af37 55%, #b8860b 100%)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12l16-8-6 16-3-6-7-2Z" stroke="#0a0805" strokeWidth="1.8" strokeLinejoin="round" /></svg>
        </button>
      </form>
    </div>
  );
}

export default function SimulatorsSection() {
  const { t } = useLang();
  const [open, setOpen] = useState(0);
  const meses = (v: number) =>
    `${v} ${t({ pt: v === 1 ? "mês" : "meses", en: v === 1 ? "month" : "months" })}`;
  const aoAno = (v: number) => `${v}% ${t({ pt: "ao ano", en: "per year" })}`;

  // Depósito a prazo
  const [dValor, setDValor] = useState(500000);
  const [dMeses, setDMeses] = useState(12);
  const [dTaxa, setDTaxa] = useState(10);
  const dJuros = dValor * (dTaxa / 100) * (dMeses / 12);
  const dFinal = dValor + dJuros;

  // Crédito
  const [cValor, setCValor] = useState(1000000);
  const [cMeses, setCMeses] = useState(24);
  const [cTaxa, setCTaxa] = useState(18);
  const i = cTaxa / 100 / 12;
  const cPrest = i > 0 ? (cValor * i) / (1 - Math.pow(1 + i, -cMeses)) : cValor / cMeses;
  const cTotal = cPrest * cMeses;
  const cJuros = cTotal - cValor;

  return (
    <section id="simuladores" className="w-full scroll-mt-20 px-6 py-20 md:py-28" style={{ background: "#fcfcfc", color: "#30170a" }}>
      <div className="mx-auto max-w-7xl">
        <h2
          className="max-w-2xl leading-[1.05]"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(30px, 4.5vw, 48px)",
          }}
        >
          {t({ pt: "Os nossos", en: "Our" })} <span style={{ color: "#b8860b" }}>{t({ pt: "simuladores", en: "simulators" })}</span>
        </h2>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: "rgba(48,23,10,0.7)" }}>
          {t({ pt: "Faça as contas em segundos e planeie melhor as suas decisões financeiras.", en: "Do the maths in seconds and plan your financial decisions better." })}
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-[minmax(0,320px)_1fr] md:gap-8">
          {/* Lateral: opções em collapse */}
          <div className="flex flex-col gap-3">
            {OPTIONS.map((opt, idx) => {
              const isOpen = open === idx;
              return (
                <div
                  key={opt.key}
                  className="overflow-hidden rounded-2xl border transition-colors"
                  style={{
                    borderColor: isOpen ? "#e0c78c" : "rgba(48,23,10,0.12)",
                    background: isOpen ? "rgba(224,199,140,0.18)" : "#fff",
                  }}
                >
                  <button
                    onClick={() => setOpen(idx)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  >
                    <span
                      className="text-sm font-bold md:text-base"
                      style={{ fontFamily: "var(--font-display)", color: "#30170a" }}
                    >
                      {t(opt.title)}
                    </span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="shrink-0 transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                    >
                      <path d="M6 9l6 6 6-6" stroke="#b8860b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {/* Conteúdo do collapse */}
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "rgba(48,23,10,0.7)" }}>
                        {t(opt.desc)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Painel: simulador ativo */}
          <div
            className="rounded-3xl border p-6 md:p-8"
            style={{ borderColor: "rgba(48,23,10,0.1)", background: "#fff", boxShadow: "0 20px 50px -30px rgba(48,23,10,0.4)" }}
          >
            {open === 2 ? (
              <ChatPanel />
            ) : open === 0 ? (
              <div>
                <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  {t({ pt: "Depósito a Prazo", en: "Term Deposit" })}
                </h3>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="space-y-6">
                    <Slider label={t({ pt: "Valor a aplicar", en: "Amount to invest" })} value={dValor} min={50000} max={20000000} step={50000} onChange={setDValor} format={fmt.format} />
                    <Slider label={t({ pt: "Prazo", en: "Term" })} value={dMeses} min={1} max={60} step={1} onChange={setDMeses} format={meses} />
                    <Slider label={t({ pt: "Taxa anual", en: "Annual rate" })} value={dTaxa} min={1} max={25} step={0.5} onChange={setDTaxa} format={aoAno} />
                  </div>
                  <div className="flex flex-col justify-center rounded-2xl p-6" style={{ background: "linear-gradient(135deg, #f4dd94, #d4af37)" }}>
                    <span className="text-xs font-semibold text-[#0a0805]/70">{t({ pt: "JUROS ESTIMADOS", en: "ESTIMATED INTEREST" })}</span>
                    <span className="mt-1 text-2xl font-extrabold text-[#0a0805]" style={{ fontFamily: "var(--font-display)" }}>
                      {fmt.format(dJuros)}
                    </span>
                    <div className="my-4 h-px w-full bg-black/15" />
                    <span className="text-xs font-semibold text-[#0a0805]/70">{t({ pt: "VALOR FINAL", en: "FINAL AMOUNT" })}</span>
                    <span className="mt-1 text-3xl font-extrabold text-[#0a0805]" style={{ fontFamily: "var(--font-display)" }}>
                      {fmt.format(dFinal)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  {t({ pt: "Crédito", en: "Credit" })}
                </h3>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="space-y-6">
                    <Slider label={t({ pt: "Montante do crédito", en: "Loan amount" })} value={cValor} min={100000} max={50000000} step={100000} onChange={setCValor} format={fmt.format} />
                    <Slider label={t({ pt: "Prazo", en: "Term" })} value={cMeses} min={6} max={120} step={1} onChange={setCMeses} format={meses} />
                    <Slider label={t({ pt: "Taxa anual", en: "Annual rate" })} value={cTaxa} min={1} max={30} step={0.5} onChange={setCTaxa} format={aoAno} />
                  </div>
                  <div className="flex flex-col justify-center rounded-2xl p-6" style={{ background: "linear-gradient(135deg, #f4dd94, #d4af37)" }}>
                    <span className="text-xs font-semibold text-[#0a0805]/70">{t({ pt: "PRESTAÇÃO MENSAL", en: "MONTHLY INSTALMENT" })}</span>
                    <span className="mt-1 text-3xl font-extrabold text-[#0a0805]" style={{ fontFamily: "var(--font-display)" }}>
                      {fmt.format(cPrest)}
                    </span>
                    <div className="my-4 h-px w-full bg-black/15" />
                    <div className="flex justify-between text-sm">
                      <span className="text-[#0a0805]/70">{t({ pt: "Total a pagar", en: "Total payable" })}</span>
                      <span className="font-bold text-[#0a0805]">{fmt.format(cTotal)}</span>
                    </div>
                    <div className="mt-1.5 flex justify-between text-sm">
                      <span className="text-[#0a0805]/70">{t({ pt: "Total de juros", en: "Total interest" })}</span>
                      <span className="font-bold text-[#0a0805]">{fmt.format(cJuros)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p className="mt-6 text-xs" style={{ color: "rgba(48,23,10,0.5)" }}>
              {open === 2
                ? t({
                    pt: "Respostas informativas geradas por IA. Não constituem aconselhamento jurídico/financeiro nem decisão de crédito, que depende da análise e aprovação do banco.",
                    en: "Informational answers generated by AI. They do not constitute legal/financial advice or a credit decision, which depends on the bank's assessment and approval.",
                  })
                : t({
                    pt: "Valores meramente indicativos. As condições reais dependem da análise e aprovação do banco.",
                    en: "Figures are indicative only. Actual terms depend on the bank's assessment and approval.",
                  })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
