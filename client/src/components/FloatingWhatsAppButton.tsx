import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingWhatsAppButtonProps {
  onClick: () => void;
}

export default function FloatingWhatsAppButton({ onClick }: FloatingWhatsAppButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white z-50 animate-pulse hover:animate-none transition-all duration-300 hover:scale-110"
      aria-label="Finalizar pelo WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
    </Button>
  );
}
