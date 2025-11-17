import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ChevronLeft, Loader2, Phone, Shield, UserRound } from "lucide-react";
import { getConvenioById } from "@/data/convenios";
import type { LeadInfo, SimulationData } from "@/types/simulation";
import { hasValidWhatsapp, sanitizeWhatsapp } from "@shared/lead";

interface LeadCaptureProps {
  simulationData: SimulationData;
  onSubmit: (lead: LeadInfo) => void;
  onEditSimulation: () => void;
}

const userTypeText: Record<string, string> = {
  municipal: "Servidor Municipal",
  estadual: "Servidor Estadual",
  inss: "Aposentado/Pensionista INSS"
};

const marginTypeText: Record<string, string> = {
  emprestimo: "Margem Empréstimo",
  cartao: "Margem Cartão Consignado",
  beneficio: "Margem Cartão Benefício",
  outra: "Outra"
};

const formatWhatsapp = (value: string) => {
  const digits = sanitizeWhatsapp(value);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export default function LeadCapture({ simulationData, onSubmit, onEditSimulation }: LeadCaptureProps) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const convenio = useMemo(() => getConvenioById(simulationData.organ), [simulationData.organ]);

  const validate = () => {
    if (!name.trim()) {
      setError("Qual seu nome?");
      return false;
    }

    if (!hasValidWhatsapp(whatsapp)) {
      setError("Digite um WhatsApp válido com DDD.");
      return false;
    }

    setError(null);
    return true;
  };

  const sendLead = async (lead: LeadInfo) => {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: lead.name,
        whatsapp: lead.whatsapp,
        simulation: simulationData
      })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.message ?? "Não foi possível salvar seus dados agora.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const trimmedName = name.trim();
    const sanitizedWhatsapp = sanitizeWhatsapp(whatsapp);
    const leadInfo: LeadInfo = {
      name: trimmedName,
      whatsapp: sanitizedWhatsapp
    };

    try {
      await sendLead(leadInfo);
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Erro inesperado ao salvar seus dados.";
      setError(message);
      console.error("Não foi possível salvar os dados do lead, mas a simulação continuará.", submissionError);
    } finally {
      setIsSubmitting(false);
      onSubmit(leadInfo);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-white to-accent/30">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              <span>Garantimos 100% de privacidade dos seus dados</span>
            </div>
          </div>

          <Card className="shadow-xl border-none">
            <CardHeader className="text-center space-y-3">
              <CardTitle className="text-3xl">Antes de mostrar o resultado...</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Seus dados são protegidos e usados apenas para enviar a simulação personalizada com segurança.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4 bg-accent/40 p-6 rounded-2xl border border-primary/10">
                  <h3 className="text-lg font-semibold text-foreground">Resumo da sua simulação</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex justify-between">
                      <span className="font-medium text-foreground">Categoria:</span>
                      <span>{userTypeText[simulationData.userType] ?? simulationData.userType}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium text-foreground">Convênio:</span>
                      <span>{convenio?.name ?? simulationData.organ}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium text-foreground">Tipo de margem:</span>
                      <span>{marginTypeText[simulationData.marginType] ?? simulationData.marginType}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium text-foreground">Valor informado:</span>
                      <span>R$ {simulationData.marginValue || "0,00"}</span>
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground">
                    Ao enviar, nossa equipe receberá esses dados em tempo real e seguirá com o atendimento pelo WhatsApp.
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1 border-t border-primary/10 pt-4">
                    <p className="text-sm font-medium text-foreground">
                      Correspondente Homologado {convenio?.name ?? simulationData.organ}
                    </p>
                    <p>Acessus Serviços Financeiros | CNPJ 60.341.978/0001-49</p>
                  </div>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="lead-name" className="text-base font-medium">
                      Como podemos te chamar?
                    </Label>
                    <div className="relative">
                      <UserRound className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                      <Input
                        id="lead-name"
                        placeholder="como podemos te chamar?"
                        value={name}
                        onChange={(event) => {
                          setName(event.target.value);
                          if (error) setError(null);
                        }}
                        className="h-14 pl-12 text-base"
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lead-whatsapp" className="text-base font-medium">
                      Qual é o seu WhatsApp com DDD?
                    </Label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                      <Input
                        id="lead-whatsapp"
                        type="tel"
                        placeholder="(11) 91234-5678"
                        value={formatWhatsapp(whatsapp)}
                        onChange={(event) => {
                          setWhatsapp(event.target.value);
                          if (error) setError(null);
                        }}
                        className="h-14 pl-12 text-base"
                        autoComplete="tel"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Usaremos apenas para enviar o resultado e confirmar seus dados. Sem spam.
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/40 rounded-lg p-3">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="h-12 text-base font-semibold" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enviando dados...
                        </span>
                      ) : (
                        "Quero ver minha simulação"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 text-base"
                      onClick={onEditSimulation}
                      disabled={isSubmitting}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" /> Ajustar informações
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
