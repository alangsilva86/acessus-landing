import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, RefreshCw, CheckCircle2 } from "lucide-react";

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

  // Cálculo simplificado baseado na margem
  const marginNumber = parseFloat(data.marginValue.replace(/\./g, '').replace(',', '.'));
  const maxAmount = marginNumber * selectedTerm * 0.85; // Estimativa conservadora

  const terms = [24, 36, 48, 60, 72, 84, 96];
  
  const calculateInstallment = (term: number) => {
    return maxAmount / term;
  };

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
          <Card className="shadow-lg border-none">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl text-primary">
                Você pode sacar até
              </CardTitle>
              <div className="text-5xl font-bold text-foreground my-4">
                R$ {maxAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <CardDescription>
                Valores estimados. A oferta final depende da análise do banco e da margem disponível.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-center mb-4">Escolha o prazo de pagamento:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {terms.map((term) => (
                    <button
                      key={term}
                      onClick={() => setSelectedTerm(term)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedTerm === term
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-lg font-bold text-foreground">{term}x</div>
                      <div className="text-sm text-muted-foreground">
                        R$ {calculateInstallment(term).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-accent/50 p-4 rounded-lg text-sm text-muted-foreground text-center">
                <p className="mb-2">
                  <strong>Atendimento humano, sem robô empurrando oferta.</strong>
                </p>
                <p>
                  Nossa equipe vai analisar seu caso e apresentar as melhores condições disponíveis.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  size="lg"
                  className="w-full text-lg h-auto py-4"
                  onClick={() => window.open(whatsappUrl, '_blank')}
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
                  Refazer simulação
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
