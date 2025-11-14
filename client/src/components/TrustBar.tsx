import { APP_LOGO } from "@/const";
import { Shield, Lock } from "lucide-react";

export default function TrustBar() {
  return (
    <div className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={APP_LOGO} alt="Acessus" className="h-12 sm:h-16" />
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <span className="hidden md:inline text-sm text-foreground font-medium">
            Correspondente autorizado
          </span>
          <span className="hidden sm:inline text-xs sm:text-sm text-muted-foreground">
            CNPJ 60.341.978/0001-49
          </span>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
            <Lock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Dados protegidos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
