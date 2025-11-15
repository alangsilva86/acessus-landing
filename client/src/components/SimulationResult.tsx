import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, RefreshCw, CheckCircle2, TrendingDown, Shield } from "lucide-react";
import WhatsAppPreview from "./WhatsAppPreview";
import FloatingWhatsAppButton from "./FloatingWhatsAppButton";
import { cn } from "@/lib/utils";

interface SimulationData {
  userType: string;
  organ: string;
  birthDate: string;
  marginType: string;
  marginValue: string;
}

interface SimulationResultProps {
  data: SimulationData;
  onReset: () => void;
}

export default function SimulationResult({ data, onReset }: SimulationResultProps) {
  const [selectedTerm, setSelectedTerm] = useState(72);
  const [showPreview, setShowPreview] = useState(false);
  const [animatedAmount, setAnimatedAmount] = useState(0);

  // Cálculo simplificado baseado na margem
  const marginNumber = parseFloat(data.marginValue.replace(/\./g, '').replace(',', '.'));
  const maxAmount = marginNumber * selectedTerm * 0.85; // Estimativa conservadora

  // Animação de contador do valor
  useEffect(() => {
    const duration = 1500; // 1.5 segundos
    const steps = 60;
    const increment = maxAmount / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= maxAmount) {
        setAnimatedAmount(maxAmount);
        clearInterval(timer);
      } else {
        setAnimatedAmount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [maxAmount]);

  const terms = [24, 36, 48, 60, 72, 84, 96];
  
  const calculateInstallment = (term: number) => {
    return maxAmount / term;
  };

  // Cálculo de economia vs banco tradicional (estimativa)
  const traditionalRate = 2.5; // Taxa mensal típica de banco tradicional
  const consignadoRate = 1.8; // Taxa mensal consignado
  const savingsPerMonth = (maxAmount * (traditionalRate - consignadoRate)) / 100;
  const totalSavings = savingsPerMonth * selectedTerm;

  const getWhatsAppMessage = () => {
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

    const message = `Olá! Acabei de fazer uma simulação no site da Acessus e gostaria de finalizar meu crédito.

*Meus dados:*
- Tipo: ${userTypeText}
- Órgão: ${data.organ}
- Data de nascimento: ${data.birthDate}
- Tipo de margem: ${marginTypeText}
- Valor da margem: R$ ${data.marginValue}

*Simulação escolhida:*
- Valor do saque: R$ ${maxAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Prazo: ${selectedTerm}x
- Parcela: R$ ${calculateInstallment(selectedTerm).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

Aguardo retorno!`;

    return encodeURIComponent(message);
  };

  const whatsappNumber = "5511999999999"; // Número do WhatsApp da Acessus
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${getWhatsAppMessage()}`;

  return (
    <section className="py-16 bg-gradient-to-br from-white to-accent/20">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          {/* Badge de segurança fixo */}
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
                  R$ {animatedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <CardDescription className="text-base">
                  *Valores estimados. A oferta final depende da análise do banco e da margem disponível.
                </CardDescription>
              </CardHeader>
            </div>

            <CardContent className="space-y-6 pt-6">
              {/* Destaque de economia */}
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
                      R$ {totalSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                  {terms.map((term) => (
                    <button
                      key={term}
                      onClick={() => setSelectedTerm(term)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all duration-200",
                        selectedTerm === term
                          ? 'border-primary bg-primary/10 shadow-lg scale-105'
                          : 'border-border hover:border-primary/50 hover:bg-accent/50'
                      )}
                    >
                      <div className="text-xl font-bold text-foreground">{term}x</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        R$ {calculateInstallment(term).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      {selectedTerm === term && (
                        <div className="mt-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mx-auto" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Toque no prazo para ver o valor da parcela
                </p>
              </div>

              {/* Informações do prazo selecionado */}
              <div className="bg-accent/30 p-4 rounded-lg border border-border">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Valor total</p>
                    <p className="text-xl font-bold text-foreground">
                      R$ {maxAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Parcela mensal</p>
                    <p className="text-xl font-bold text-primary">
                      R$ {calculateInstallment(selectedTerm).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <p className="text-sm text-center">
                  <strong className="text-foreground">Atendimento humano, sem robô empurrando oferta.</strong>
                  <br />
                  <span className="text-muted-foreground">
                    Nossa equipe vai analisar seu caso e apresentar as melhores condições disponíveis.
                  </span>
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  size="lg"
                  className="w-full text-lg h-auto py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => setShowPreview(true)}
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
      
      {/* Botão flutuante fixo do WhatsApp */}
      <FloatingWhatsAppButton onClick={() => setShowPreview(true)} />
    </section>
  );
}
