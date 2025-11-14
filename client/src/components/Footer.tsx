import { APP_LOGO } from "@/const";
import { MapPin, Clock, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-accent-foreground text-white py-12">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <img 
                src="/Acessus_logo_horizontal-branco.png" 
                alt="Acessus" 
                className="h-8 mb-4 brightness-0 invert" 
              />
              <p className="text-sm text-white/80">
                Soluções financeiras acessíveis e transparentes para servidores públicos.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Seg a Sex: 9h às 18h</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Informações Legais</h3>
              <div className="space-y-2 text-sm text-white/80">
                <p>CNPJ: 60.341.978/0001-49</p>
                <p>Correspondente Bancário Autorizado</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-sm text-white/60">
            <p>© {new Date().getFullYear()} Acessus. Todos os direitos reservados.</p>
            <p className="mt-2">
              <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
              {" | "}
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
