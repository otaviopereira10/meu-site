
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectProps {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  liveLink?: string;
  repoLink?: string;
  index: number;
}

const ProjectCard = ({ title, description, technologies, image, liveLink, repoLink, index }: ProjectProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    
    gsap.from(cardRef.current, {
      y: 40,
      opacity: 1,
      duration: 0.7,
      delay: 0.2 + index * 0.15,
      ease: "power3.out"
    });
  }, [index]);

  return (
    <div 
      ref={cardRef}
      className="project-card glass overflow-hidden rounded-xl"
    >
      <div className="h-48 overflow-hidden">
        <div 
          className="w-full h-full bg-cover bg-center transition-all duration-500 hover:scale-110"
          style={{ 
            backgroundImage: `url(${image})` 
          }}
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-display font-bold mb-2">{title}</h3>
        <p className="text-sm text-foreground/70 mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech) => (
            <span 
              key={tech} 
              className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex gap-3">
          {liveLink && (
            <a 
              href={liveLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <ExternalLink size={16} className="mr-1" />
              Ver Projeto
            </a>
          )}
          
          {repoLink && (
            <a 
              href={repoLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
              <Github size={16} className="mr-1" />
              Código
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        if (entry.isIntersecting) {
          gsap.from(headingRef.current, { 
            y: 30, 
            opacity: 1, 
            duration: 0.8,
            ease: "power3.out"
          });
          
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  const projects = [
    {
      title: "E-commerce Platform",
      description: "Uma plataforma completa de e-commerce com múltiplos vendedores e sistema de pagamento integrado.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      image: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      liveLink: "#",
      repoLink: "#"
    },
    {
      title: "Task Management App",
      description: "Aplicativo para gerenciamento de tarefas com funcionalidades de colaboração em tempo real.",
      technologies: ["Angular", "Spring Boot", "PostgreSQL", "WebSockets"],
      image: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      liveLink: "#",
      repoLink: "#"
    },
    {
      title: "Fitness Tracker",
      description: "Aplicativo móvel para acompanhamento de atividades físicas, com métricas personalizadas.",
      technologies: ["Flutter", "Firebase", "Google Fit API"],
      image: "https://images.unsplash.com/photo-1552509603-591f6dcc049e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      liveLink: "#",
      repoLink: "#"
    },
  
  ];

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="section bg-gradient-to-b from-background to-secondary/30"
    >
      <h2 ref={headingRef} className="section-heading">
        Meus Projetos
      </h2>
      
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.title}
            {...project}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default Projects;
