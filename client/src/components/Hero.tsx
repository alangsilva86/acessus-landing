import { Button } from "@/components/ui/button";
import { CheckCircle2, Smartphone, FileText, MessageCircle, Clock, Shield } from "lucide-react";

interface HeroProps {
  onSimulateClick: () => void;
}

export default function Hero({ onSimulateClick }: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-accent/30 to-white py-16 sm:py-24">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badges de confiança */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm border border-primary/20">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Leva apenas 2 minutos</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm border border-primary/20">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">100% gratuito</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Servidor público, veja agora quanto pode sacar com desconto em folha
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Simulação gratuita, sem compromisso, direto do seu celular
          </p>
          
          {/* CTA com animação pulse sutil */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary rounded-lg blur-xl opacity-30 animate-pulse"></div>
            <Button 
              size="lg" 
              className="relative text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={onSimulateClick}
            >
              Simular meu saque agora
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            ✓ Sem cadastro necessário • ✓ Não compromete seu CPF
          </p>

          {/* Passo a passo */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/5">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <div className="w-8 h-1 bg-primary/20 rounded-full"></div>
              <h3 className="font-semibold text-foreground text-lg">1. Informe seus dados</h3>
              <p className="text-sm text-muted-foreground">Rápido e seguro</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/5">
                <CheckCircle2 className="w-7 h-7 text-primary" />
              </div>
              <div className="w-8 h-1 bg-primary/20 rounded-full"></div>
              <h3 className="font-semibold text-foreground text-lg">2. Veja quanto pode sacar</h3>
              <p className="text-sm text-muted-foreground">Resultado na hora</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/5">
                <MessageCircle className="w-7 h-7 text-primary" />
              </div>
              <div className="w-8 h-1 bg-primary/20 rounded-full"></div>
              <h3 className="font-semibold text-foreground text-lg">3. Finalize pelo WhatsApp</h3>
              <p className="text-sm text-muted-foreground">Atendimento humanizado</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
