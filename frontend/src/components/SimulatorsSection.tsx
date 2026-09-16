import { useState } from "react";

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

const OPTIONS = [
  {
    key: "deposito",
    title: "Simulador de Depósito a Prazo",
    desc: "Descubra quanto o seu dinheiro rende ao aplicar num depósito a prazo, escolhendo o valor, o período e a taxa anual.",
  },
  {
    key: "credito",
    title: "Simulador de Crédito",
    desc: "Calcule a prestação mensal do seu crédito e o total a pagar, ajustando o montante, o prazo e a taxa anual.",
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

export default function SimulatorsSection() {
  const [open, setOpen] = useState(0);

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
          Os nossos <span style={{ color: "#b8860b" }}>simuladores</span>
        </h2>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: "rgba(48,23,10,0.7)" }}>
          Faça as contas em segundos e planeie melhor as suas decisões financeiras.
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
                      {opt.title}
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
                        {opt.desc}
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
            {open === 0 ? (
              <div>
                <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  Depósito a Prazo
                </h3>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="space-y-6">
                    <Slider label="Valor a aplicar" value={dValor} min={50000} max={20000000} step={50000} onChange={setDValor} format={fmt.format} />
                    <Slider label="Prazo" value={dMeses} min={1} max={60} step={1} onChange={setDMeses} format={(v) => `${v} ${v === 1 ? "mês" : "meses"}`} />
                    <Slider label="Taxa anual" value={dTaxa} min={1} max={25} step={0.5} onChange={setDTaxa} format={(v) => `${v}% ao ano`} />
                  </div>
                  <div className="flex flex-col justify-center rounded-2xl p-6" style={{ background: "linear-gradient(135deg, #f4dd94, #d4af37)" }}>
                    <span className="text-xs font-semibold text-[#0a0805]/70">JUROS ESTIMADOS</span>
                    <span className="mt-1 text-2xl font-extrabold text-[#0a0805]" style={{ fontFamily: "var(--font-display)" }}>
                      {fmt.format(dJuros)}
                    </span>
                    <div className="my-4 h-px w-full bg-black/15" />
                    <span className="text-xs font-semibold text-[#0a0805]/70">VALOR FINAL</span>
                    <span className="mt-1 text-3xl font-extrabold text-[#0a0805]" style={{ fontFamily: "var(--font-display)" }}>
                      {fmt.format(dFinal)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  Crédito
                </h3>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="space-y-6">
                    <Slider label="Montante do crédito" value={cValor} min={100000} max={50000000} step={100000} onChange={setCValor} format={fmt.format} />
                    <Slider label="Prazo" value={cMeses} min={6} max={120} step={1} onChange={setCMeses} format={(v) => `${v} ${v === 1 ? "mês" : "meses"}`} />
                    <Slider label="Taxa anual" value={cTaxa} min={1} max={30} step={0.5} onChange={setCTaxa} format={(v) => `${v}% ao ano`} />
                  </div>
                  <div className="flex flex-col justify-center rounded-2xl p-6" style={{ background: "linear-gradient(135deg, #f4dd94, #d4af37)" }}>
                    <span className="text-xs font-semibold text-[#0a0805]/70">PRESTAÇÃO MENSAL</span>
                    <span className="mt-1 text-3xl font-extrabold text-[#0a0805]" style={{ fontFamily: "var(--font-display)" }}>
                      {fmt.format(cPrest)}
                    </span>
                    <div className="my-4 h-px w-full bg-black/15" />
                    <div className="flex justify-between text-sm">
                      <span className="text-[#0a0805]/70">Total a pagar</span>
                      <span className="font-bold text-[#0a0805]">{fmt.format(cTotal)}</span>
                    </div>
                    <div className="mt-1.5 flex justify-between text-sm">
                      <span className="text-[#0a0805]/70">Total de juros</span>
                      <span className="font-bold text-[#0a0805]">{fmt.format(cJuros)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p className="mt-6 text-xs" style={{ color: "rgba(48,23,10,0.5)" }}>
              Valores meramente indicativos. As condições reais dependem da análise e aprovação do banco.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
