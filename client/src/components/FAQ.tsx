import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      question: "Vou pagar alguma taxa para simular?",
      answer: "Não! A simulação é 100% gratuita e sem compromisso. Você só decide se quer seguir com o crédito depois de ver todas as condições."
    },
    {
      question: "Como eu sei se minha prefeitura tem convênio?",
      answer: "Durante a simulação, você poderá selecionar seu órgão ou prefeitura. Se não encontrar na lista, entre em contato pelo WhatsApp que verificamos para você."
    },
    {
      question: "O dinheiro cai em qual banco?",
      answer: "O dinheiro pode ser depositado na conta que você preferir, de qualquer banco. Você escolhe onde quer receber."
    },
    {
      question: "O que acontece se eu desistir depois de simular?",
      answer: "Nada! A simulação não gera nenhum compromisso. Você pode simular quantas vezes quiser e só seguir com o crédito quando tiver certeza."
    },
    {
      question: "Quanto tempo leva para o dinheiro cair na conta?",
      answer: "Após a aprovação e assinatura do contrato, o prazo médio é de 2 a 5 dias úteis, dependendo do banco e do órgão pagador."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Perguntas frequentes
            </h2>
            <p className="text-lg text-muted-foreground">
              Tire suas dúvidas antes de simular
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left text-base sm:text-lg font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Não encontrou sua resposta?
            </p>
            <a
              href="https://wa.me/554123912160"
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              Fale conosco pelo WhatsApp →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
