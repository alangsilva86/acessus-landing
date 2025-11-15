import { convenios, type Convenio, type MarginType } from "@/data/convenios";

const MS_IN_DAY = 1000 * 60 * 60 * 24;
const IOF_DAILY_RATE = 0.000038;
const IOF_ADDITIONAL_RATE = 0.0038;
const TAC_RATE = 0.02;

export const DEFAULT_TERMS = [24, 36, 48, 60, 72, 84, 96];

export interface SimulationResult {
  prazoMeses: number;
  coeficiente: number;
  valorBrutoLiberado: number;
  tac: number;
  valorLiquidoCliente: number;
  referenceDate: string;
}

interface CoefficientEntry {
  startDate: Date;
  endDate: Date;
  totalDays: number;
  evaluator: (day: number) => number;
}

interface CoefficientRegistry {
  [convenioId: string]: {
    [prazo: number]: CoefficientEntry;
  };
}

const marginToTaxField: Record<MarginType, keyof Convenio["taxas"]> = {
  emprestimo: "normal",
  cartao: "normal",
  beneficio: "normal",
  outra: "normal"
};

const coefficientRegistry = buildCoefficientRegistry(convenios, DEFAULT_TERMS);

function buildCoefficientRegistry(
  data: Convenio[],
  prazos: number[]
): CoefficientRegistry {
  const registry: CoefficientRegistry = {};
  for (const convenio of data) {
    const inicio = parseDate(convenio.janela.inicio);
    const fim = parseDate(convenio.janela.fim);
    if (!inicio || !fim || Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
      continue;
    }
    const prazoRegistry: Record<number, CoefficientEntry> = {};
    const totalDays = Math.max(0, differenceInDays(fim, inicio));

    for (const prazo of prazos) {
      const taxa = getTaxa(convenio, "beneficio");
      if (taxa === null) {
        continue;
      }
      const scenarioStart = createScenario({
        prazoMeses: prazo,
        taxaMensal: taxa,
        dataLiberacao: inicio,
        dataPrimeiroVencimento: addDays(inicio, 30)
      });
      const scenarioEnd = createScenario({
        prazoMeses: prazo,
        taxaMensal: taxa,
        dataLiberacao: fim,
        dataPrimeiroVencimento: addDays(inicio, 30)
      });

      const nodes = [{ x: 0, y: scenarioStart.coeficiente }];
      if (totalDays > 0) {
        nodes.push({ x: totalDays, y: scenarioEnd.coeficiente });
      }

      const evaluator = createNaturalSpline(nodes);
      prazoRegistry[prazo] = {
        startDate: inicio,
        endDate: fim,
        totalDays,
        evaluator
      };
    }

    registry[convenio.id] = prazoRegistry;
  }
  return registry;
}

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00`);
}

function differenceInDays(late: Date, early: Date): number {
  const diff = late.getTime() - early.getTime();
  return Math.max(0, Math.round(diff / MS_IN_DAY));
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_IN_DAY);
}

function getTaxa(convenio: Convenio, marginType: MarginType) {
  const field = marginToTaxField[marginType];
  const valor = convenio.taxas?.[field];
  return valor ?? null;
}

function getCarenciaFactor(prazoMeses: number) {
  if (prazoMeses <= 6) return 0.75;
  if (prazoMeses <= 12) return 0.75 + ((0.88 - 0.75) * (prazoMeses - 6)) / 6;
  if (prazoMeses <= 24) return 0.88 + ((0.95 - 0.88) * (prazoMeses - 12)) / 12;
  return 1.0;
}

function createScenario({
  prazoMeses,
  taxaMensal,
  dataLiberacao,
  dataPrimeiroVencimento
}: {
  prazoMeses: number;
  taxaMensal: number;
  dataLiberacao: Date;
  dataPrimeiroVencimento: Date;
}) {
  const principal = 1;
  const carenciaBruta = differenceInDays(dataPrimeiroVencimento, dataLiberacao);
  const carenciaReduzida = carenciaBruta > 30 ? carenciaBruta - 30 : carenciaBruta;
  const carenciaEfetiva = carenciaReduzida * getCarenciaFactor(prazoMeses);

  const iofDays = Math.min(carenciaEfetiva, 365);
  const iofBase = principal * IOF_DAILY_RATE * iofDays;
  const iofAdicional = principal * IOF_ADDITIONAL_RATE;
  const iofTotal = iofBase + iofAdicional;

  const valorFinanciado = principal + iofTotal;
  const monthlyRate = taxaMensal / 100;
  const dailyRate = monthlyRate / 30;
  const graceInterest = valorFinanciado * dailyRate * carenciaEfetiva;
  const saldoAjustado = valorFinanciado + graceInterest;

  const parcela =
    monthlyRate === 0
      ? saldoAjustado / prazoMeses
      : (saldoAjustado * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -prazoMeses));

  const coeficiente = parcela / principal;
  return { coeficiente, carenciaEfetiva };
}

function createNaturalSpline(nodes: { x: number; y: number }[]) {
  const filtered = nodes.filter((node) => !Number.isNaN(node.y));
  if (filtered.length === 0) {
    return () => 0;
  }
  if (filtered.length === 1) {
    const only = filtered[0];
    return () => only.y;
  }

  const n = filtered.length;
  const x = filtered.map((node) => node.x);
  const y = filtered.map((node) => node.y);
  const h: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    h.push(x[i + 1] - x[i]);
  }

  const alpha: number[] = [];
  for (let i = 1; i < n - 1; i++) {
    alpha[i] = (3 / h[i]) * (y[i + 1] - y[i]) - (3 / h[i - 1]) * (y[i] - y[i - 1]);
  }

  const l: number[] = [];
  const mu: number[] = [];
  const z: number[] = [];
  l[0] = 1;
  mu[0] = 0;
  z[0] = 0;

  for (let i = 1; i < n - 1; i++) {
    l[i] = 2 * (x[i + 1] - x[i - 1]) - h[i - 1] * mu[i - 1];
    mu[i] = h[i] / l[i];
    z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
  }

  l[n - 1] = 1;
  z[n - 1] = 0;

  const c: number[] = [];
  const b: number[] = [];
  const d: number[] = [];
  c[n - 1] = 0;

  for (let j = n - 2; j >= 0; j--) {
    c[j] = z[j] - mu[j] * c[j + 1];
    b[j] = (y[j + 1] - y[j]) / h[j] - (h[j] * (c[j + 1] + 2 * c[j])) / 3;
    d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
  }

  return (target: number) => {
    if (target <= x[0]) return y[0];
    if (target >= x[n - 1]) return y[n - 1];
    let idx = n - 2;
    for (let i = 0; i < n - 1; i++) {
      if (target >= x[i] && target <= x[i + 1]) {
        idx = i;
        break;
      }
    }
    const delta = target - x[idx];
    return y[idx] + b[idx] * delta + c[idx] * delta ** 2 + d[idx] * delta ** 3;
  };
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getCoefficientForDay(
  convenioId: string,
  prazo: number,
  referenceDate: Date
): number | null {
  const convenioRecord = coefficientRegistry[convenioId];
  if (!convenioRecord) return null;
  const entry = convenioRecord[prazo];
  if (!entry) return null;
  const dayIndex = differenceInDays(referenceDate, entry.startDate);
  if (dayIndex <= 0) {
    return Math.max(entry.evaluator(0), 1e-6);
  }
  if (dayIndex >= entry.totalDays) {
    return Math.max(entry.evaluator(entry.totalDays), 1e-6);
  }
  return Math.max(entry.evaluator(dayIndex), 1e-6);
}

export function simulateWithMargin(
  convenioId: string,
  margem: number,
  prazoMeses: number,
  referenceDate = new Date()
): SimulationResult | null {
  if (margem <= 0 || !convenioId) return null;
  const coeficiente = getCoefficientForDay(convenioId, prazoMeses, referenceDate);
  if (!coeficiente) return null;
  const valorBruto = margem / coeficiente;
  const tac = valorBruto * TAC_RATE;
  const valorLiquido = valorBruto - tac;
  return {
    prazoMeses,
    coeficiente,
    valorBrutoLiberado: valorBruto,
    tac,
    valorLiquidoCliente: valorLiquido,
    referenceDate: formatDateKey(referenceDate)
  };
}
