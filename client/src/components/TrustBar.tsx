import { APP_LOGO } from "@/const";
import { Shield } from "lucide-react";

export default function TrustBar() {
  return (
    <div className="bg-white border-b border-border">
      <div className="container py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={APP_LOGO} alt="Acessus" className="h-8" />
        </div>
        <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
          <span className="hidden sm:inline">Correspondente autorizado | CNPJ 60.341.978/0001-49</span>
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-primary" />
            <span className="hidden md:inline">Seus dados protegidos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
