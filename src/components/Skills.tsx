import React, { useState } from "react";
import {
  Database,
  Code,
  Github,
  FileCode,
  Terminal,
  Layers,
  PenTool,
  Layout,
  Server,
  Smartphone,
  Cloud,
  Cpu,
  Globe,
  Workflow,
  Zap,
} from "lucide-react";

/** 
 * Definição dos tipos de páginas:
 * - cover (Capa)
 * - skill (páginas de habilidades)
 * - backcover (Contracapa)
 */
type BookPage =
  | {
      type: "cover";
      title: string;
      subtitle: string;
    }
  | {
      type: "skill";
      name: string;
      desc: string;
      icon: JSX.Element;
    }
  | {
      type: "backcover";
      title: string;
      subtitle: string;
    };

/** 
 * Conteúdo do livro na ordem normal:
 * 0 -> Capa
 * 1..n-2 -> Páginas de skill
 * n-1 -> Contracapa
 */
const pagesData: BookPage[] = [
  {
    type: "cover",
    title: "Livro de Habilidades ",
    subtitle: "Clique em Próxima para folhear",
  },
  {
    type: "skill",
    name: "MySQL",
    desc: "Banco de dados relacional",
    icon: <Database size={36} />,
  },
  {
    type: "skill",
    name: "Spring",
    desc: "Framework Java para microserviços",
    icon: <Server size={36} />,
  },
  {
    type: "skill",
    name: "PostgreSQL",
    desc: "Banco de dados robusto e escalável",
    icon: <Database size={36} />,
  },
  {
    type: "skill",
    name: "HTML",
    desc: "Linguagem de marcação para a Web",
    icon: <Code size={36} />,
  },
  {
    type: "skill",
    name: "CSS",
    desc: "Estilização e layouts responsivos",
    icon: <PenTool size={36} />,
  },
  {
    type: "skill",
    name: "JavaScript",
    desc: "Linguagem dinâmica para interatividade",
    icon: <FileCode size={36} />,
  },
  {
    type: "skill",
    name: "TypeScript",
    desc: "Versão tipada do JavaScript",
    icon: <FileCode size={36} />,
  },
  {
    type: "skill",
    name: "Java",
    desc: "Linguagem orientada a objetos",
    icon: <Terminal size={36} />,
  },
  {
    type: "skill",
    name: "GitHub",
    desc: "Plataforma de versionamento e colaboração",
    icon: <Github size={36} />,
  },
  {
    type: "skill",
    name: "Lombok",
    desc: "Produtividade no desenvolvimento Java",
    icon: <Layers size={36} />,
  },
  {
    type: "skill",
    name: "Angular",
    desc: "Framework TypeScript para aplicações web",
    icon: <Layout size={36} />,
  },
  {
    type: "skill",
    name: "Dart",
    desc: "Linguagem otimizada para apps multiplataforma",
    icon: <Terminal size={36} />,
  },
  {
    type: "skill",
    name: "Flutter",
    desc: "Framework para apps iOS/Android/Web",
    icon: <Smartphone size={36} />,
  },


  {
    type: "skill",
    name: "RESTful APIs",
    desc: "Padrão para criação de APIs escaláveis",
    icon: <Globe size={36} />,
  },

  {
    type: "backcover",
    title: "FIM",
    subtitle: "Obrigado por ler até aqui!",
  },
];

/** 
 * Renderiza a frente de cada página:
 * - Capa -> ícone chamativo + title + subtitle
 * - Skill -> icon + name + desc
 * - Contracapa
 */
function renderFront(page: BookPage) {
  if (page.type === "cover") {
    return (
      <div className="flex flex-col items-center text-center space-y-2 px-3">
        {/* Ícone chamativo */}
        <div className="mb-2">
          <Zap size={50} className="text-yellow-400 drop-shadow-lg animate-pulse" />
        </div>
        <h3 className="text-2xl font-extrabold text-gray-100">{page.title}</h3>
        <p className="text-sm text-gray-300">{page.subtitle}</p>
      </div>
    );
  } else if (page.type === "skill") {
    return (
      <div className="flex flex-col items-center gap-2 text-center px-3">
        {page.icon}
        <h3 className="text-lg font-bold mt-2 text-gray-100">{page.name}</h3>
        <p className="text-gray-200 text-sm">{page.desc}</p>
      </div>
    );
  } else {
    // contracapa
    return (
      <div className="text-center space-y-2 px-3">
        <h3 className="text-2xl font-extrabold text-gray-100">{page.title}</h3>
        <p className="text-sm text-gray-300">{page.subtitle}</p>
      </div>
    );
  }
}

/** 
 * Renderiza o verso da página atual mostrando
 * a FRENTE da página anterior (quando existe).
 */
function renderBack(index: number, pages: BookPage[]) {
  if (index === 0) {
    // capa => sem anterior
    return (
      <div className="text-center text-gray-400">
        <p></p>
      </div>
    );
  }
  // Caso contrário, exibe a frente da página anterior
  const prevPage = pages[index - 1];
  return renderFront(prevPage);
}

export default function BookOfSkills() {
  const total = pagesData.length;
  const [currentPage, setCurrentPage] = useState(0);

  // Passa para a próxima página
  const nextPage = () => {
    if (currentPage < total - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Volta para a anterior
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <section
      className="
        min-h-screen w-full flex flex-col items-center justify-center
        relative overflow-hidden px-4 py-16
      "
      style={{
        backgroundImage: `
          radial-gradient(circle at 15% 50%, rgba(124, 58, 237, 0.1) 0%, transparent 25%),
          radial-gradient(circle at 85% 30%, rgba(249, 115, 22, 0.1) 0%, transparent 25%)
        `,
      }}
    >
      <h2 className="text-4xl font-bold text-white mb-8">Minhas Habilidades Técnicas</h2>

      {/* Container do livro com perspectiva */}
      <div className="relative w-[320px] h-[420px]" style={{ perspective: "1800px" }}>
        {pagesData.map((page, index) => {
          // Se index < currentPage => página foi virada
          const isFlipped = index < currentPage;

          return (
            <div
              key={index}
              className={`
                absolute inset-0 w-full h-full
                transition-transform duration-700
                flex flex-col items-center justify-center
                page-3d
                ${page.type === "cover" ? "cover-hard" : ""}
                ${page.type === "backcover" ? "back-hard" : ""}
              `}
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "left center",
                transform: isFlipped
                  ? "translateX(0) rotateY(-180deg)"
                  : "translateX(0) rotateY(0deg)",
                // A capa terá zIndex maior no começo, contracapa menor
                zIndex: total - index,
                // Desabilita interação caso a página esteja virada
                pointerEvents: isFlipped ? "none" : "auto",
              }}
            >
              {/* Frente da página */}
              <div
                className="
                  absolute inset-0 w-full h-full
                  rounded-md shadow-2xl border
                  p-4
                  flex flex-col items-center justify-center
                  bg-gradient-to-br from-[#2a2b44] to-[#1F1F2E]
                "
                style={{ backfaceVisibility: "hidden" }}
              >
                {renderFront(page)}
              </div>

              {/* Verso da página (exibe a anterior) */}
              <div
                className="
                  absolute inset-0 w-full h-full
                  rounded-md shadow-2xl border
                  p-4
                  flex flex-col items-center justify-center
                  bg-gradient-to-br from-[#1F1F2E] to-[#2a2b44]
                "
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                {renderBack(index, pagesData)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Botões de navegação */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="
            px-4 py-2 bg-purple-600 text-white rounded-md
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:bg-purple-700 transition
          "
        >
          Anterior
        </button>
        <button
          onClick={nextPage}
          disabled={currentPage === total - 1}
          className="
            px-4 py-2 bg-pink-600 text-white rounded-md
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:bg-pink-700 transition
          "
        >
          Próxima
        </button>
      </div>

      <style>{`
        /* Efeito de "capa dura" na capa */
        .cover-hard::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 12px;
          height: 100%;
          background: linear-gradient(135deg, #a889ff, #6c63ff);
          box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.7);
          border-right: 2px solid #403f5a;
          z-index: 2;
        }

        /* Efeito "capa dura" na contracapa */
        .back-hard::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 12px;
          height: 100%;
          background: linear-gradient(135deg, #ff86c8, #ff639f);
          box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.7);
          border-left: 2px solid #403f5a;
          z-index: 2;
        }
      `}</style>
    </section>
  );
}
