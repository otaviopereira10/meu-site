
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Camera, Upload } from 'lucide-react';

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<HTMLSpanElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoSrc(event.target.result as string);
          localStorage.setItem('profilePhoto', event.target.result as string);
          
          // Save the email service ID for the contact form
          localStorage.setItem('emailServiceId', 'service_6fv81tg');
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    // Retrieve saved photo from localStorage if exists
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto) {
      setPhotoSrc(savedPhoto);
    }
    
    // Save the email service ID for the contact form
    localStorage.setItem('emailServiceId', 'service_6fv81tg');
    
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        if (entry.isIntersecting) {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          
          tl.from(headingRef.current, { 
            y: 30, 
            opacity: 0, 
            duration: 0.8 
          })
          .from(contentRef.current, { 
            y: 40, 
            opacity: 0, 
            duration: 0.8 
          }, "-=0.4")
          .from(photoRef.current, {
            y: 40,
            opacity: 0,
            duration: 0.8
          }, "-=0.6");
          
          // Card tilt effect
          if (cardRef.current) {
            const card = cardRef.current;
            
            const handleMouseMove = (e: MouseEvent) => {
              if (!card) return;
              
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              
              const rotateX = (y - centerY) / 15;
              const rotateY = (centerX - x) / 15;
              
              gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                boxShadow: `${(x - centerX) / 30}px ${(y - centerY) / 30}px 20px rgba(0, 0, 0, 0.15)`,
                duration: 0.5,
                ease: "power2.out",
                transformPerspective: 1000,
                transformStyle: "preserve-3d"
              });
            };
            
            const handleMouseLeave = () => {
              if (!card) return;
              
              gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
                duration: 0.5,
                ease: "power2.out"
              });
            };
            
            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', handleMouseLeave);
            
            return () => {
              card.removeEventListener('mousemove', handleMouseMove);
              card.removeEventListener('mouseleave', handleMouseLeave);
            };
          }
          
          // Typing animation
          if (typingRef.current) {
            const text = typingRef.current.textContent || "";
            typingRef.current.textContent = "";
            
            let i = 0;
            const interval = setInterval(() => {
              if (i < text.length) {
                typingRef.current!.textContent += text.charAt(i);
                i++;
              } else {
                clearInterval(interval);
              }
            }, 30);
          }
          
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="section bg-gradient-to-b from-background to-secondary/30"
    >
      <div className="max-w-5xl mx-auto">
        <h2 ref={headingRef} className="section-heading">
          Sobre Mim
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div 
            ref={photoRef}
            className="flex flex-col items-center justify-center aspect-square"
          >
            <div 
              ref={cardRef}
              className="yugioh-profile-card w-full h-full max-h-[400px] max-w-[280px] rounded-lg overflow-hidden mx-auto"
              style={{ 
                transformStyle: 'preserve-3d', 
                perspective: '1000px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* Card border and background */}
              <div className="absolute inset-0 border-8 border-[#DAA520] bg-gradient-to-b from-amber-100 to-amber-300 rounded-lg"></div>
              
              {/* Card header - name and stars */}
              <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-4 border-b-4 border-[#DAA520] z-10">
                <span className="font-bold text-black">Otavio Antonio</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-4 h-4 ml-1">
                      <svg viewBox="0 0 24 24" fill="#DAA520">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                      </svg>
                    </div>
                  ))}

                </div>
              </div>
              
              {/* Card image/photo */}
              <div className="absolute top-14 left-0 right-0 h-[200px] bg-[#111827] flex items-center justify-center overflow-hidden">
                {photoSrc ? (
                  <img 
                    src={photoSrc} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <label 
                    htmlFor="upload-photo" 
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all"
                  >
                    
                    <img src="/Eu.jpg" alt="Profile" className='w-full h-full object-cover' />
                  </label>
                )}
                <input 
                  type="file" 
                  id="upload-photo" 
                  accept="/public/Eu2.jpg" 
                  className="hidden" 
                  onChange={handlePhotoUpload}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent mix-blend-overlay"></div>
              </div>
              
              {/* Card type */}
              <div className="absolute top-[214px] left-0 right-0 h-10 bg-[#DAA520] flex items-center px-4">
                <span className="font-semibold text-sm text-[#111827]">[FULL-STACK DEVELOPER]</span>
              </div>
              
              {/* Card description */}
              <div className="absolute top-[224px] left-0 right-0 bottom-0 bg-[#f0e6d2] p-4">
                <div className="text-xs text-[#111827] h-full overflow-auto">
                  <p className="mb-0">
                    <span ref={typingRef} className="typing-container font-bold">Desenvolvedor Full Stack</span>
                  </p>
                  <p>
                    Um desenvolver apaixonado por criar soluções tecnológicas que impactam positivamente a vida das pessoas
                  </p>
                </div>
              </div>
              
              {/* Card holographic overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/20 opacity-30 z-20 pointer-events-none"></div>
              
              {photoSrc && (
                <label 
                  htmlFor="upload-photo" 
                  className="absolute bottom-3 right-3 bg-primary/80 hover:bg-primary text-white p-2 rounded-full cursor-pointer backdrop-blur-sm transition-all z-30"
                >
                  <Camera size={18} />
                </label>
              )}
            </div>
          </div>
          
          <div 
            ref={contentRef}
            className="glass rounded-2xl p-6 md:p-8 md:col-span-2"
          >
            <div className="space-y-4 text-foreground/80">
              <p>
                Sou um desenvolvedor apaixonado por criar soluções tecnológicas que impactam positivamente a vida das pessoas. Com experiência em desenvolvimento full stack, estou sempre em busca de novos desafios e aprendizados.
              </p>
              <p>
                Minha jornada na programação começou com curiosidade e se transformou em paixão. Cada projeto que desenvolvo é uma oportunidade de aprimorar minhas habilidades e explorar novas tecnologias.
              </p>
              <p>
                Acredito no poder da tecnologia para transformar realidades e busco constantemente criar experiências digitais intuitivas, acessíveis e esteticamente agradáveis, combinando funcionalidade com design de qualidade.
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">2+</div>
                <div className="text-sm text-foreground/70">Anos de Experiência</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100+</div>
                <div className="text-sm text-foreground/70">Projetos Concluídos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">15+</div>
                <div className="text-sm text-foreground/70">Tecnologias</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">5+</div>
                <div className="text-sm text-foreground/70">Clientes Satisfeitos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
