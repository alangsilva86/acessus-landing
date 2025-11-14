import { CheckCircle2, Shield, DollarSign, FileCheck } from "lucide-react";

export default function TrustBlock() {
  const benefits = [
    {
      icon: Shield,
      title: "Sem depósito antecipado nem taxa escondida",
      description: "Transparência total em todo o processo"
    },
    {
      icon: CheckCircle2,
      title: "Simulação 100% gratuita e sem compromisso",
      description: "Você decide se quer seguir ou não"
    },
    {
      icon: DollarSign,
      title: "Parcelas descontadas direto na folha",
      description: "Segurança e praticidade no pagamento"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
