import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Github, Linkedin, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import emailjs from 'emailjs-com';

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  useEffect(() => {
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
          .from(formRef.current, { 
            y: 40, 
            opacity: 0, 
            duration: 0.8 
          }, "-=0.4")
          .from(socialRef.current, { 
            y: 40, 
            opacity: 0, 
            duration: 0.8 
          }, "-=0.6");
          
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        title: "Formulário incompleto",
        description: "Por favor, preencha todos os campos do formulário.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Parâmetros que serão enviados ao EmailJS
      const templateParams = {
        from_name: name,
        from_email: email,
        to_name: "Otávio",
        message: message,
        reply_to: email,
        to_email: "otaviokeedz@gmail.com"
      };

      // Enviando via EmailJS
      await emailjs.send(
        'service_6fv81tg',         // Service ID
        'template_kzzyb8n',       // Template ID
        templateParams,
        'pGUWUa3cC_YbxK3eU'       // Public key
      );

      // Se chegou até aqui, envio ocorreu com sucesso
      setFormStatus('success');
      toast({
        title: "Mensagem enviada!",
        description: "Obrigado pelo contato, responderei o mais breve possível.",
      });

      // Limpa o formulário
      setName('');
      setEmail('');
      setMessage('');

      // Volta ao estado "idle" após 5s
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);

    } catch (error) {
      console.error("Erro ao enviar email:", error);
      setFormStatus('error');
      toast({
        title: "Erro ao enviar mensagem",
        description: "Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="section bg-gradient-to-t from-[#0f0f1a]/50 to-background/90 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto">
        <h2 ref={headingRef} className="section-heading">
          Entre em Contato
        </h2>
        
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <form 
            ref={formRef}
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-6 md:p-8 border border-primary/20"
          >
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nome
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white/10 backdrop-blur-sm"
                placeholder="Seu nome"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white/10 backdrop-blur-sm"
                placeholder="seu.email@exemplo.com"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Mensagem
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[120px] bg-white/10 backdrop-blur-sm"
                placeholder="Favor informar o meio de contato na mensagem!"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 active:translate-y-0 ${
                formStatus === 'success' 
                  ? 'bg-green-500 text-white' 
                  : formStatus === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-primary text-white hover:bg-primary/90'
              } btn-tech`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : formStatus === 'success' ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Mensagem Enviada!
                </>
              ) : formStatus === 'error' ? (
                <>
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Erro ao Enviar
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Enviar Mensagem
                </>
              )}
            </button>
            
            <p className="text-xs text-center mt-4 text-foreground/50">
              Seu email será enviado para otaviokeedz@gmail.com
            </p>
          </form>
          
          <div 
            ref={socialRef}
            className="glass rounded-2xl p-6 md:p-8 flex flex-col border border-primary/20"
          >
            <h3 className="text-xl font-display font-bold mb-4 gradient-text">
              Outras Formas de Contato
            </h3>
            
            <p className="text-foreground/70 mb-6">
              Você também pode me encontrar nas redes sociais ou enviar um e-mail diretamente.
            </p>
            
            <div className="space-y-4 mt-auto">
              <a
                href="mailto:otaviokeedz@gmail.com"
                className="flex items-center p-3 rounded-lg transition-all hover:bg-primary/10 group"
              >
                <div className="bg-primary/10 p-3 rounded-full mr-4 group-hover:bg-primary/20 transition-all glow">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-xs text-foreground/60">otaviokeedz@gmail.com</div>
                </div>
              </a>
              
              <a
                href="https://github.com/otaviopereira10"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 rounded-lg transition-all hover:bg-primary/10 group"
              >
                <div className="bg-primary/10 p-3 rounded-full mr-4 group-hover:bg-primary/20 transition-all glow">
                  <Github className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">GitHub</div>
                  <div className="text-xs text-foreground/60">https://github.com/otaviopereira10</div>
                </div>
              </a>
              
              <a
                href="https://linkedin.com/in/otavio-barbosa1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 rounded-lg transition-all hover:bg-primary/10 group"
              >
                <div className="bg-primary/10 p-3 rounded-full mr-4 group-hover:bg-primary/20 transition-all glow">
                  <Linkedin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">LinkedIn</div>
                  <div className="text-xs text-foreground/60">linkedin.com/in/otavio-barbosa1</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
