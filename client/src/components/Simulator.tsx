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
import { getConveniosByTipo, getConvenioById, type MarginType } from "@/data/convenios";

const MARGIN_OPTIONS: { value: MarginType; label: string; description: string }[] = [
  {
    value: "emprestimo",
    label: "Margem Empréstimo",
    description: "Para saque em dinheiro"
  },
  {
    value: "cartao",
    label: "Margem Cartão Consignado",
    description: "Para usar como cartão de crédito"
  },
  {
    value: "beneficio",
    label: "Margem Cartão Benefício",
    description: "Para alimentação/refeição"
  },
  {
    value: "outra",
    label: "Outra",
    description: "Não sei qual é minha margem"
  }
];

const KNOWN_USER_TYPES = ["municipal", "estadual", "inss"] as const;
type KnownUserType = (typeof KNOWN_USER_TYPES)[number];

type MarginTypeOption = MarginType | "";

interface SimulationData {
  userType: string;
  organ: string;
  birthDate: string;
  marginType: MarginTypeOption;
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
  const selectedType: KnownUserType | undefined = KNOWN_USER_TYPES.includes(
    data.userType as KnownUserType
  )
    ? (data.userType as KnownUserType)
    : undefined;
  const conveniosByType = selectedType ? getConveniosByTipo(selectedType) : [];
  const selectedConvenio = data.organ ? getConvenioById(data.organ) : undefined;
  const prioritizedMarginTypes = selectedConvenio?.produtosDisponiveis ?? [];
  const sortedMarginOptions = [...MARGIN_OPTIONS].sort((a, b) => {
    const aIndex = prioritizedMarginTypes.indexOf(a.value);
    const bIndex = prioritizedMarginTypes.indexOf(b.value);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
  const updateData = (field: keyof SimulationData, value: string) => {
    setData((prev) => {
      let next = { ...prev, [field]: value };
      if (field === "organ") {
        const convenio = getConvenioById(value);
        const available = convenio?.produtosDisponiveis ?? [];
        if (prev.marginType) {
          const previousMargin = prev.marginType as MarginType;
          if (!available.includes(previousMargin)) {
            next.marginType = "";
          }
        }
      }
      return next;
    });
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

    if (step < 2) {
      setStep(step + 1);
      // Scroll suave para o topo do simulador
      setTimeout(() => {
        document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      // Passo 2 completo, chamar onComplete
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
                      <label
                        htmlFor="municipal"
                        className={cn(
                          "flex items-center space-x-4 p-5 border-2 rounded-xl cursor-pointer transition-all duration-200",
                          data.userType === "municipal" 
                            ? "border-primary bg-primary/5 shadow-md" 
                            : "border-border hover:border-primary/50 hover:bg-accent/50"
                        )}
                      >
                        <RadioGroupItem value="municipal" id="municipal" className="w-6 h-6" />
                        <span className="flex-1 text-lg font-medium">
                          Servidor Municipal
                        </span>
                        {data.userType === "municipal" && (
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        )}
                      </label>
                      <label
                        htmlFor="estadual"
                        className={cn(
                          "flex items-center space-x-4 p-5 border-2 rounded-xl cursor-pointer transition-all duration-200",
                          data.userType === "estadual" 
                            ? "border-primary bg-primary/5 shadow-md" 
                            : "border-border hover:border-primary/50 hover:bg-accent/50"
                        )}
                      >
                        <RadioGroupItem value="estadual" id="estadual" className="w-6 h-6" />
                        <span className="flex-1 text-lg font-medium">
                          Servidor Estadual
                        </span>
                        {data.userType === "estadual" && (
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        )}
                      </label>
                      <label
                        htmlFor="inss"
                        className={cn(
                          "flex items-center space-x-4 p-5 border-2 rounded-xl cursor-pointer transition-all duration-200",
                          data.userType === "inss" 
                            ? "border-primary bg-primary/5 shadow-md" 
                            : "border-border hover:border-primary/50 hover:bg-accent/50"
                        )}
                      >
                        <RadioGroupItem value="inss" id="inss" className="w-6 h-6" />
                        <span className="flex-1 text-lg font-medium">
                          Aposentado/Pensionista INSS
                        </span>
                        {data.userType === "inss" && (
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        )}
                      </label>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base flex items-center gap-2">
                      Selecione seu convênio ativo
                      <InfoTooltip content="Mostramos apenas o nome do convênio; as datas e taxas ficam na base para o cálculo." />
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Apenas convênios com janela vigente aparecem aqui. Se nenhum item surgir, mude o tipo de vínculo.
                    </p>
                    {selectedType ? (
                      <Select value={data.organ} onValueChange={(value) => updateData("organ", value)}>
                        <SelectTrigger className="h-16 text-lg font-medium border-2 hover:border-primary/50 transition-colors">
                          <SelectValue placeholder="Escolha seu convênio" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {conveniosByType.map((convenio) => (
                            <SelectItem
                              key={convenio.id}
                              value={convenio.id}
                              className="text-lg py-4"
                            >
                              {convenio.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Escolha o tipo de vínculo para liberar os convênios correspondentes.
                      </p>
                    )}
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
                    <Label className="text-base font-semibold flex items-center gap-2">
                      Tipo de margem disponível
                      <InfoTooltip content="Cartões apagados indicam ausência de dados para esse convênio; nos demais temos o cálculo pronto." />
                    </Label>
                    <RadioGroup value={data.marginType} onValueChange={(v) => updateData('marginType', v)}>
                      {sortedMarginOptions.map((option) => {
                        const isAvailable = selectedConvenio
                          ? selectedConvenio.produtosDisponiveis?.includes(option.value) ?? false
                          : true;
                        return (
                          <label
                            key={option.value}
                            htmlFor={option.value}
                            aria-disabled={!isAvailable}
                            className={cn(
                              "flex items-center space-x-4 p-5 border-2 rounded-xl transition-all duration-200",
                              isAvailable
                                ? data.marginType === option.value
                                  ? "border-primary bg-primary/5 shadow-md"
                                  : "border-border hover:border-primary/50 hover:bg-accent/50 cursor-pointer"
                                : "border-border bg-muted/20 text-muted-foreground opacity-60 cursor-not-allowed pointer-events-none"
                            )}
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={option.value}
                              className="w-6 h-6"
                              disabled={!isAvailable}
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="font-semibold text-lg text-foreground">{option.label}</div>
                                {!isAvailable && (
                                  <InfoTooltip content="Ainda não temos dados de margem para esse convênio." />
                                )}
                              </div>
                              <div className="text-base text-muted-foreground">
                                {option.description}
                              </div>
                            </div>
                            {isAvailable && data.marginType === option.value && (
                              <CheckCircle2 className="w-6 h-6 text-primary" />
                            )}
                          </label>
                        );
                      })}
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="marginValue" className="text-base flex items-center">
                      Quanto você pode descontar por mês? (R$)
                      <InfoTooltip content="É o valor que pode ser descontado da sua folha de pagamento todo mês" />
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground pointer-events-none">
                        R$
                      </span>
                      <Input
                        id="marginValue"
                        type="text"
                        inputMode="numeric"
                        placeholder="500,00"
                        value={data.marginValue}
                        onChange={handleMarginChange}
                        onBlur={() => setTouched(prev => ({ ...prev, marginValue: true }))}
                        className={cn(
                          "h-16 text-lg font-medium pl-14 pr-12 border-2 transition-colors",
                          errors.marginValue && touched.marginValue
                            ? "border-destructive"
                            : data.marginValue && !errors.marginValue
                            ? "border-primary"
                            : "hover:border-primary/50"
                        )}
                      />
                      {data.marginValue && !errors.marginValue && (
                        <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
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
