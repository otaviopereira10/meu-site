import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import YugiohProfileCard from './YugiohProfileCard';''

const Hero = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    tl.from(headingRef.current, { 
      y: 50, 
      opacity: 1, 
      duration: 1 
    })
    .from(paragraphRef.current, { 
      y: 30, 
      opacity: 1, 
      duration: 1 
    }, "-=0.6")
    .from(buttonRef.current, { 
      y: 20, 
      opacity: 1, 
      duration: 0.8 
    }, "-=0.6");
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div className="md:order-1 order-2">
          <h1 
            ref={headingRef}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          >
            Transforma<span className="text-primary">ndo</span> ideias em<br />
            <span className="text-accent">experiências digitais</span>
          </h1>
          
          <p 
            ref={paragraphRef}
            className="mt-6 text-lg md:text-xl text-foreground/80 max-w-lg"
          >
            Desenvolvedor full-stack apaixonado por criar soluções inovadoras 
            e experiências interativas que conectam pessoas e tecnologia.
          </p>
          
          <div 
            ref={buttonRef}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a 
              href="#projects" 
              className="px-6 py-3 bg-primary text-white rounded-full font-medium transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 active:translate-y-0"
            >
              Ver Projetos
            </a>
            <a 
              href="#contact" 
              className="px-6 py-3 border border-primary text-primary rounded-full font-medium transition-all hover:bg-primary/5 hover:-translate-y-1 active:translate-y-0"
            >
              Entrar em Contato
            </a>
          </div>
        </div>
        
        <div className="md:order-2 order-1 flex justify-center md:justify-end">
          <YugiohProfileCard />
        </div>
      </div>
    </section>
  );
};

export default Hero;
