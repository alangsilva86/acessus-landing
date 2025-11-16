import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageCircle,
  RefreshCw,
  CheckCircle2,
  TrendingDown,
  Shield,
  AlertTriangle
} from "lucide-react";
import WhatsAppPreview from "./WhatsAppPreview";
import FloatingWhatsAppButton from "./FloatingWhatsAppButton";
import { cn } from "@/lib/utils";
import { getConvenioById, type MarginType } from "@/data/convenios";
import InfoTooltip from "@/components/InfoTooltip";
import { simulateWithMargin, DEFAULT_TERMS } from "@/lib/coefficientEngine";
import type { SimulationData } from "@/types/simulation";

interface SimulationResultProps {
  data: SimulationData;
  onReset: () => void;
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function SimulationResult({ data, onReset }: SimulationResultProps) {
  const marginNumber = parseFloat(data.marginValue.replace(/\./g, "").replace(",", ".")) || 0;
  const referenceDate = useMemo(() => new Date(), [data.organ, data.marginValue]);

  const simulateTerm = useCallback(
    (term: number) =>
      simulateWithMargin(data.organ, data.marginType as MarginType, marginNumber, term, referenceDate),
    [data.organ, data.marginType, marginNumber, referenceDate]
  );

  const termoSimulations = useMemo(
    () => DEFAULT_TERMS.map((term) => ({ term, simulation: simulateTerm(term) })),
    [simulateTerm]
  );

  const availableTerm = termoSimulations.find((entry) => entry.simulation)?.term ?? DEFAULT_TERMS[0];
  const [selectedTerm, setSelectedTerm] = useState(availableTerm);

  useEffect(() => {
    const hasSelected = termoSimulations.some((entry) => entry.term === selectedTerm && entry.simulation);
    if (!hasSelected) {
      if (availableTerm && availableTerm !== selectedTerm) {
        setSelectedTerm(availableTerm);
      } else if (!availableTerm) {
        setSelectedTerm(DEFAULT_TERMS[0]);
      }
    }
  }, [availableTerm, selectedTerm, termoSimulations]);

  const currentEntry = termoSimulations.find((entry) => entry.term === selectedTerm);
  const currentSimulation = currentEntry?.simulation ?? null;
  const valorLiberado = currentSimulation?.valorBrutoLiberado ?? 0;
  const totalSavings = currentSimulation ? currentSimulation.valorBrutoLiberado * 0.18 : 0;

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const target = valorLiberado;
    const increment = target / steps;
    let current = 0;

    if (target === 0) {
      setAnimatedAmount(0);
      return;
    }

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedAmount(target);
        clearInterval(timer);
      } else {
        setAnimatedAmount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [valorLiberado]);

  const [showPreview, setShowPreview] = useState(false);
  const [animatedAmount, setAnimatedAmount] = useState(valorLiberado);

  const selectedConvenio = getConvenioById(data.organ);
  const organLabel = selectedConvenio?.name ?? data.organ;

  const userTypeText = {
    municipal: "Servidor Municipal",
    estadual: "Servidor Estadual",
    inss: "Aposentado/Pensionista INSS"
  }[data.userType] || data.userType;

  const marginTypeText = {
    emprestimo: "Margem Empréstimo",
    cartao: "Margem Cartão Consignado",
    beneficio: "Margem Cartão Benefício",
    outra: "Outra"
  }[data.marginType] || data.marginType;

  const getWhatsAppMessage = () => {
    const valor = currentSimulation?.valorBrutoLiberado ?? 0;
    const parcela = marginNumber;

  const message = `Olá! Acabei de fazer uma simulação no site da Acessus e gostaria de finalizar meu crédito.

- Meus dados:*
- Tipo: ${userTypeText}
- Órgão: ${organLabel}
- Tipo de margem: ${marginTypeText}
- Valor da margem: R$ ${formatCurrency(parcela)}

- Simulação escolhida:*
- Valor do saque: R$ ${formatCurrency(valor)}
- Prazo: ${selectedTerm}x
- Parcela: R$ ${formatCurrency(parcela)}

Aguardo retorno!`;

    return encodeURIComponent(message);
  };

  const whatsappNumber = "5511999999999";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${getWhatsAppMessage()}`;

  return (
    <section className="py-16 bg-gradient-to-br from-white to-accent/20">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium animate-pulse">
              <Shield className="w-4 h-4" />
              <span>Simulação concluída • Sem compromisso</span>
            </div>
          </div>

          <Card className="shadow-xl border-none overflow-hidden">
            <div className="bg-gradient-to-br from-primary/5 to-accent/30 p-6 border-b">
              <CardHeader className="text-center p-0">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/20">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-primary mb-2">
                  Você pode sacar até
                </CardTitle>
                <div className="text-5xl sm:text-6xl font-bold text-foreground my-4">
                  <span>R$ {formatCurrency(animatedAmount)}</span>
                </div>
                <CardDescription className="text-base">
                  *Valores estimados. A oferta final depende da análise do banco e da margem disponível.
                </CardDescription>
                {!currentSimulation && (
                  <p className="text-sm text-destructive flex items-center justify-center gap-2 mt-3">
                    <AlertTriangle className="w-4 h-4" />
                    Coeficiente diário indisponível para essa combinação {`(Etapas 5–6)`}.
                  </p>
                )}
              </CardHeader>
            </div>

            <CardContent className="space-y-6 pt-6">
              <div className="bg-gradient-to-r from-primary/10 to-accent/30 p-4 rounded-xl border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Economia estimada vs banco tradicional
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      R$ {formatCurrency(totalSavings)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ao longo de {selectedTerm} meses
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-center mb-4 text-lg">Escolha o prazo de pagamento:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {termoSimulations.map(({ term, simulation }) => (
                    <button
                      key={term}
                      onClick={() => simulation && setSelectedTerm(term)}
                      disabled={!simulation}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all duration-200",
                        !simulation
                          ? "border-border bg-muted/40 opacity-60 cursor-not-allowed"
                          : selectedTerm === term
                            ? "border-primary bg-primary/10 shadow-lg scale-105"
                            : "border-border hover:border-primary/50 hover:bg-accent/50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-foreground">{term}x</span>
                        {!simulation && (
                          <InfoTooltip content="Coeficiente diário ainda não calculado para esse prazo." />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        {simulation
                          ? `R$ ${formatCurrency(simulation.valorBrutoLiberado)}`
                          : "Sem dados"}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Os coeficientes seguem a interpolação descrita nas etapas 5‑6.
                </p>
              </div>

              <div className="bg-accent/30 p-4 rounded-lg border border-border">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Valor total liberado</p>
                    <p className="text-xl font-bold text-foreground">
                      R$ {formatCurrency(valorLiberado)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Parcela mensal</p>
                    <p className="text-xl font-bold text-primary">
                      R$ {formatCurrency(marginNumber)}
                    </p>
                  </div>
                </div>
              </div>

              {currentSimulation && (
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 text-sm text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">Resumo</p>
                  <p>Coeficiente diário (dia {currentSimulation.referenceDate}): {currentSimulation.coeficiente.toFixed(6)}</p>
                  <p>TAC estimada: R$ {formatCurrency(currentSimulation.tac)}</p>
                  <p>Valor líquido estimado: R$ {formatCurrency(currentSimulation.valorLiquidoCliente)}</p>
                </div>
              )}

              <div className="space-y-3 pt-4">
                <Button
                  size="lg"
                  className="w-full text-lg h-auto py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => currentSimulation && setShowPreview(true)}
                  disabled={!currentSimulation}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Finalizar pelo WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={onReset}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Fazer nova simulação
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>✓ Resposta em até 5 minutos</p>
                <p>✓ Sem compromisso até você assinar o contrato</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <WhatsAppPreview
        message={getWhatsAppMessage()}
        whatsappUrl={whatsappUrl}
        open={showPreview}
        onOpenChange={setShowPreview}
      />

      <FloatingWhatsAppButton onClick={() => currentSimulation && setShowPreview(true)} />
    </section>
  );
}
