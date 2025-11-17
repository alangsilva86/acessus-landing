import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "554123912160";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function StickyWhatsAppButton() {
  return (
    <Button
      asChild
      className="fixed top-4 right-4 z-50 h-12 px-4 py-3 rounded-full shadow-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white hover:shadow-3xl transition-transform duration-300 hover:scale-105"
    >
      <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="Chamar no WhatsApp">
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="ml-2 hidden md:inline">Chamar no WhatsApp</span>
      </a>
    </Button>
  );
}
