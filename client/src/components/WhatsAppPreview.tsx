import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircle, ExternalLink } from "lucide-react";

interface WhatsAppPreviewProps {
  message: string;
  whatsappUrl: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WhatsAppPreview({ message, whatsappUrl, open, onOpenChange }: WhatsAppPreviewProps) {
  const handleConfirm = () => {
    window.open(whatsappUrl, '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Confirmar envio para WhatsApp
          </DialogTitle>
          <DialogDescription>
            Veja a mensagem que será enviada para nossa equipe:
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-accent/30 p-4 rounded-lg border border-border max-h-64 overflow-y-auto">
          <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
            {decodeURIComponent(message)}
          </pre>
        </div>

        <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground">
            ✓ Você será redirecionado para o WhatsApp<br />
            ✓ Pode editar a mensagem antes de enviar<br />
            ✓ Nossa equipe responde em até 5 minutos
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Revisar simulação
          </Button>
          <Button
            onClick={handleConfirm}
            className="w-full sm:w-auto"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
