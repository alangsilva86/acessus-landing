import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function SocialProof() {
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
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Quem já usou, aprovou
            </h2>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <span className="font-semibold">+2.300 servidores atendidos</span>
              <span className="font-semibold">R$ 15+ milhões em crédito concedido</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-muted-foreground">{testimonial.role}</p>
                    <p className="text-muted-foreground text-xs">{testimonial.city}</p>
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
