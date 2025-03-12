
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-8 px-4 bg-gradient-to-b from-secondary/30 to-secondary/50">
      <div className="max-w-7xl mx-auto text-center">
        <div className="text-foreground/60 text-sm flex items-center justify-center">
          Criado com <Heart className="h-4 w-4 text-accent mx-1" fill="currentColor" /> e muita dedicação © {new Date().getFullYear()}
        </div>
        
        <div className="mt-2 text-xs text-foreground/40">
          Portfólio Feito por Otavio Antonio
        </div>
      </div>
    </footer>
  );
};

export default Footer;
