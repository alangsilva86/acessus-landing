import { Button } from "@/components/ui/button";
import { CheckCircle2, Smartphone, FileText, MessageCircle } from "lucide-react";

interface HeroProps {
  onSimulateClick: () => void;
}

export default function Hero({ onSimulateClick }: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-accent/30 to-white py-16 sm:py-24">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Servidor público, veja agora quanto pode sacar com desconto em folha
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Simulação gratuita, sem compromisso, direto do seu celular
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 h-auto"
            onClick={onSimulateClick}
          >
            Simular meu saque agora
          </Button>

          {/* Passo a passo */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">1. Informe seus dados</h3>
              <p className="text-sm text-muted-foreground">Rápido e seguro</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">2. Veja quanto pode sacar</h3>
              <p className="text-sm text-muted-foreground">Resultado na hora</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">3. Finalize pelo WhatsApp</h3>
              <p className="text-sm text-muted-foreground">Atendimento humanizado</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
