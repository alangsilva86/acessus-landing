import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Perguntas frequentes
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
