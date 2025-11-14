import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, TrendingUp } from "lucide-react";

export default function SocialProof() {
  const [userCount, setUserCount] = useState(2300);

  // Simular contador em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Servidora Municipal",
      city: "São Paulo - SP",
      text: "Consegui organizar minhas contas sem sair da prefeitura. Fiz tudo pelo celular."
    },
    {
      name: "João Santos",
      role: "Servidor Estadual",
      city: "Rio de Janeiro - RJ",
      text: "Processo simples e rápido. O atendimento pelo WhatsApp foi excelente."
    },
    {
      name: "Ana Costa",
      role: "Aposentada INSS",
      city: "Belo Horizonte - MG",
      text: "Finalmente consegui um crédito justo e sem complicação. Recomendo!"
    }
  ];

  return (
    <section className="py-16 bg-accent/20">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Quem já usou, aprovou
            </h2>
            
            {/* Estatísticas com ícones */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-6 h-6 text-primary" />
                  <span className="text-3xl font-bold text-primary">
                    {userCount.toLocaleString('pt-BR')}+
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">Servidores atendidos</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <span className="text-3xl font-bold text-primary">R$ 15M+</span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">Em crédito concedido</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-6 h-6 text-primary fill-primary" />
                  <span className="text-3xl font-bold text-primary">4.9</span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">Avaliação média</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-base text-foreground mb-4 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="text-sm border-t border-border pt-4">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-muted-foreground">{testimonial.role}</p>
                    <p className="text-muted-foreground text-xs mt-1">{testimonial.city}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
