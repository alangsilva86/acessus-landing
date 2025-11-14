import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, CheckCircle2, Shield, AlertCircle } from "lucide-react";
import InfoTooltip from "./InfoTooltip";
import { cn } from "@/lib/utils";

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
  const [errors, setErrors] = useState<Partial<Record<keyof SimulationData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof SimulationData, boolean>>>({});

  const updateData = (field: keyof SimulationData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    // Limpar erro ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateBirthDate = (date: string): boolean => {
    if (date.length !== 10) return false;
    const [day, month, year] = date.split('/').map(Number);
    if (!day || !month || !year) return false;
    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear - 18) return false;
    return true;
  };

  const validateMarginValue = (value: string): boolean => {
    if (!value) return false;
    const numValue = parseFloat(value.replace(/\./g, '').replace(',', '.'));
    return numValue > 0;
  };

  const canProceed = () => {
    if (step === 1) return data.userType && data.organ;
    if (step === 2) {
      return (
        data.birthDate &&
        validateBirthDate(data.birthDate) &&
        data.marginType &&
        data.marginValue &&
        validateMarginValue(data.marginValue)
      );
    }
    return false;
  };

  const handleNext = () => {
    // Validar antes de avançar
    if (step === 2) {
      const newErrors: Partial<Record<keyof SimulationData, string>> = {};
      
      if (!validateBirthDate(data.birthDate)) {
        newErrors.birthDate = "Data inválida. Use o formato DD/MM/AAAA";
      }
      
      if (!validateMarginValue(data.marginValue)) {
        newErrors.marginValue = "Digite um valor válido";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    if (step < 3) {
      setStep(step + 1);
      // Scroll suave para o topo do simulador
      setTimeout(() => {
        document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setTimeout(() => {
        document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
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
    if (!numbers) return '';
    const amount = parseInt(numbers) / 100;
    return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    updateData('marginValue', formatted);
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Quem é você?";
      case 2: return "Seus dados básicos";
      case 3: return "Resultado";
      default: return "";
    }
  };

  return (
    <section id="simulador" className="py-16 bg-gradient-to-br from-white to-accent/20 scroll-mt-20">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          {/* Badge de segurança fixo */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              <span>Seus dados não são salvos • 100% seguro</span>
            </div>
          </div>

          <Card className="shadow-xl border-none">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {getStepTitle()}
              </CardTitle>
              <CardDescription className="text-center text-base">
                Passo {step} de 2
              </CardDescription>
              
              {/* Barra de progresso melhorada */}
              <div className="flex gap-2 mt-6">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-2.5 flex-1 rounded-full transition-all duration-500 relative overflow-hidden",
                      i <= step ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    {i === step && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    )}
                    {i < step && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center">
                      Selecione sua categoria
                      <InfoTooltip content="Escolha o tipo de vínculo que você tem com o órgão pagador" />
                    </Label>
                    <RadioGroup value={data.userType} onValueChange={(v) => updateData('userType', v)}>
                      <div className={cn(
                        "flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200",
                        data.userType === "municipal" 
                          ? "border-primary bg-primary/5 shadow-md" 
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      )}>
                        <RadioGroupItem value="municipal" id="municipal" className="w-5 h-5" />
                        <Label htmlFor="municipal" className="flex-1 cursor-pointer text-base">
                          Servidor Municipal
                        </Label>
                        {data.userType === "municipal" && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className={cn(
                        "flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200",
                        data.userType === "estadual" 
                          ? "border-primary bg-primary/5 shadow-md" 
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      )}>
                        <RadioGroupItem value="estadual" id="estadual" className="w-5 h-5" />
                        <Label htmlFor="estadual" className="flex-1 cursor-pointer text-base">
                          Servidor Estadual
                        </Label>
                        {data.userType === "estadual" && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className={cn(
                        "flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200",
                        data.userType === "inss" 
                          ? "border-primary bg-primary/5 shadow-md" 
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      )}>
                        <RadioGroupItem value="inss" id="inss" className="w-5 h-5" />
                        <Label htmlFor="inss" className="flex-1 cursor-pointer text-base">
                          Aposentado/Pensionista INSS
                        </Label>
                        {data.userType === "inss" && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organ" className="text-base flex items-center">
                      Selecione seu órgão/prefeitura
                      <InfoTooltip content="Escolha o órgão onde você trabalha ou recebe seu benefício" />
                    </Label>
                    <Select value={data.organ} onValueChange={(v) => updateData('organ', v)}>
                      <SelectTrigger id="organ" className="h-12 text-base">
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
                    <Label htmlFor="birthDate" className="text-base flex items-center">
                      Data de nascimento
                      <InfoTooltip content="Digite no formato: dia/mês/ano (ex: 15/03/1980)" />
                    </Label>
                    <div className="relative">
                      <Input
                        id="birthDate"
                        type="tel"
                        placeholder="DD/MM/AAAA"
                        value={data.birthDate}
                        onChange={handleDateChange}
                        maxLength={10}
                        className={cn(
                          "h-14 text-lg pr-10",
                          errors.birthDate && touched.birthDate ? "border-destructive" : "",
                          data.birthDate && validateBirthDate(data.birthDate) ? "border-primary" : ""
                        )}
                      />
                      {data.birthDate && validateBirthDate(data.birthDate) && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                      )}
                      {errors.birthDate && touched.birthDate && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
                      )}
                    </div>
                    {errors.birthDate && touched.birthDate && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.birthDate}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center">
                      Tipo de margem disponível
                      <InfoTooltip content="É o tipo de desconto que você pode ter na sua folha de pagamento" />
                    </Label>
                    <RadioGroup value={data.marginType} onValueChange={(v) => updateData('marginType', v)}>
                      <div className={cn(
                        "flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200",
                        data.marginType === "emprestimo" 
                          ? "border-primary bg-primary/5 shadow-md" 
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      )}>
                        <RadioGroupItem value="emprestimo" id="emprestimo" className="w-5 h-5" />
                        <Label htmlFor="emprestimo" className="flex-1 cursor-pointer">
                          <div className="font-medium">Margem Empréstimo</div>
                          <div className="text-sm text-muted-foreground">Para saque em dinheiro</div>
                        </Label>
                        {data.marginType === "emprestimo" && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className={cn(
                        "flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200",
                        data.marginType === "cartao" 
                          ? "border-primary bg-primary/5 shadow-md" 
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      )}>
                        <RadioGroupItem value="cartao" id="cartao" className="w-5 h-5" />
                        <Label htmlFor="cartao" className="flex-1 cursor-pointer">
                          <div className="font-medium">Margem Cartão Consignado</div>
                          <div className="text-sm text-muted-foreground">Para usar como cartão de crédito</div>
                        </Label>
                        {data.marginType === "cartao" && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className={cn(
                        "flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200",
                        data.marginType === "beneficio" 
                          ? "border-primary bg-primary/5 shadow-md" 
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      )}>
                        <RadioGroupItem value="beneficio" id="beneficio" className="w-5 h-5" />
                        <Label htmlFor="beneficio" className="flex-1 cursor-pointer">
                          <div className="font-medium">Margem Cartão Benefício</div>
                          <div className="text-sm text-muted-foreground">Para alimentação/refeição</div>
                        </Label>
                        {data.marginType === "beneficio" && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className={cn(
                        "flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200",
                        data.marginType === "outra" 
                          ? "border-primary bg-primary/5 shadow-md" 
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      )}>
                        <RadioGroupItem value="outra" id="outra" className="w-5 h-5" />
                        <Label htmlFor="outra" className="flex-1 cursor-pointer">
                          <div className="font-medium">Outra</div>
                          <div className="text-sm text-muted-foreground">Não sei qual é minha margem</div>
                        </Label>
                        {data.marginType === "outra" && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="marginValue" className="text-base flex items-center">
                      Quanto você pode descontar por mês? (R$)
                      <InfoTooltip content="Digite o valor que aparece como 'margem disponível' no seu contracheque ou app do banco" />
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted-foreground font-medium">
                        R$
                      </span>
                      <Input
                        id="marginValue"
                        type="tel"
                        placeholder="0,00"
                        value={data.marginValue}
                        onChange={handleMarginChange}
                        className={cn(
                          "h-14 text-lg pl-12 pr-10",
                          errors.marginValue && touched.marginValue ? "border-destructive" : "",
                          data.marginValue && validateMarginValue(data.marginValue) ? "border-primary" : ""
                        )}
                      />
                      {data.marginValue && validateMarginValue(data.marginValue) && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                      )}
                      {errors.marginValue && touched.marginValue && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
                      )}
                    </div>
                    {errors.marginValue && touched.marginValue && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.marginValue}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      💡 Não sabe onde encontrar? Está no seu contracheque ou no app do seu banco
                    </p>
                  </div>

                  <div className="bg-accent/50 p-4 rounded-lg text-sm text-muted-foreground border border-primary/10">
                    <p className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>Isso é só uma simulação. Você escolhe se quer seguir ou não depois.</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 h-12 text-base"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Voltar
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex-1 h-12 text-base font-semibold"
                >
                  {step === 2 ? 'Ver meu resultado' : 'Continuar'}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
