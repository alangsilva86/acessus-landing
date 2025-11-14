import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

interface SimulationData {
  userType: string;
  organ: string;
  birthDate: string;
  marginType: string;
  marginValue: string;
}

interface SimulatorProps {
  onComplete: (data: SimulationData) => void;
}

export default function Simulator({ onComplete }: SimulatorProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<SimulationData>({
    userType: "",
    organ: "",
    birthDate: "",
    marginType: "",
    marginValue: ""
  });

  const updateData = (field: keyof SimulationData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    if (step === 1) return data.userType && data.organ;
    if (step === 2) return data.birthDate && data.marginType && data.marginValue;
    return false;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDate(e.target.value);
    updateData('birthDate', formatted);
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseInt(numbers) / 100;
    return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    updateData('marginValue', formatted);
  };

  return (
    <section id="simulador" className="py-16 bg-gradient-to-br from-white to-accent/20">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Simule seu saque em 3 passos simples
              </CardTitle>
              <CardDescription className="text-center">
                Passo {step} de 3
              </CardDescription>
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      i <= step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Quem é você?</Label>
                    <RadioGroup value={data.userType} onValueChange={(v) => updateData('userType', v)}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="municipal" id="municipal" />
                        <Label htmlFor="municipal" className="flex-1 cursor-pointer">
                          Servidor Municipal
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="estadual" id="estadual" />
                        <Label htmlFor="estadual" className="flex-1 cursor-pointer">
                          Servidor Estadual
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="inss" id="inss" />
                        <Label htmlFor="inss" className="flex-1 cursor-pointer">
                          Aposentado/Pensionista INSS
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organ">Selecione seu órgão/prefeitura</Label>
                    <Select value={data.organ} onValueChange={(v) => updateData('organ', v)}>
                      <SelectTrigger id="organ">
                        <SelectValue placeholder="Escolha uma opção" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prefeitura-sp">Prefeitura de São Paulo</SelectItem>
                        <SelectItem value="prefeitura-rj">Prefeitura do Rio de Janeiro</SelectItem>
                        <SelectItem value="prefeitura-bh">Prefeitura de Belo Horizonte</SelectItem>
                        <SelectItem value="governo-sp">Governo do Estado de SP</SelectItem>
                        <SelectItem value="governo-rj">Governo do Estado do RJ</SelectItem>
                        <SelectItem value="governo-mg">Governo do Estado de MG</SelectItem>
                        <SelectItem value="inss-geral">INSS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de nascimento</Label>
                    <Input
                      id="birthDate"
                      type="text"
                      placeholder="DD/MM/AAAA"
                      value={data.birthDate}
                      onChange={handleDateChange}
                      maxLength={10}
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Tipo de margem disponível</Label>
                    <RadioGroup value={data.marginType} onValueChange={(v) => updateData('marginType', v)}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="emprestimo" id="emprestimo" />
                        <Label htmlFor="emprestimo" className="flex-1 cursor-pointer">
                          Margem Empréstimo
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="cartao" id="cartao" />
                        <Label htmlFor="cartao" className="flex-1 cursor-pointer">
                          Margem Cartão Consignado
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="beneficio" id="beneficio" />
                        <Label htmlFor="beneficio" className="flex-1 cursor-pointer">
                          Margem Cartão Benefício
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="outra" id="outra" />
                        <Label htmlFor="outra" className="flex-1 cursor-pointer">
                          Outra
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="marginValue">Valor da margem disponível (R$)</Label>
                    <Input
                      id="marginValue"
                      type="text"
                      placeholder="0,00"
                      value={data.marginValue}
                      onChange={handleMarginChange}
                      className="text-lg"
                    />
                  </div>

                  <div className="bg-accent/50 p-4 rounded-lg text-sm text-muted-foreground">
                    Isso é só uma simulação. Você escolhe se quer seguir ou não.
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex-1"
                >
                  {step === 2 ? 'Ver resultado' : 'Continuar'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
