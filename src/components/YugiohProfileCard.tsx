import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const YugiohProfileCard = () => {
  const [photoSrc, setPhotoSrc] = useState<string | null>(() => localStorage.getItem('skillsProfilePhoto'));
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const result = event.target.result as string;
          setPhotoSrc(result);
          localStorage.setItem('skillsProfilePhoto', result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (!cardRef.current) return;

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
        boxShadow: `${(x - centerX) / 30}px ${(y - centerY) / 30}px 30px rgba(0, 0, 0, 0.15)`,
        duration: 0.5,
        ease: "power2.out"
      });
    };
    
    const handleMouseLeave = () => {
      if (!card) return;
      
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.2)",
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
  }, []);

  return (
    <div 
      ref={cardRef}
      className="yugioh-profile-card w-[300px] h-[440px] rounded-lg overflow-hidden mx-auto my-8"
      style={{ 
        transformStyle: 'preserve-3d', 
        perspective: '1000px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' 
      }}
    >
      {/* Card border and background */}
      <div className="absolute inset-0 border-8 border-[#9b87f5] bg-gradient-to-b from-purple-100 to-purple-300 rounded-lg"></div>
      
      {/* Card header - name and stars */}
      <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-4 border-b-4 border-[#9b87f5] z-10">
        <span className="font-bold text-black">DESENVOLVEDOR</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="w-5 h-5 ml-1">
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
            htmlFor="upload-profile-photo" 
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all"
          >
            <div className="text-primary mb-2">
              <img src="/Eu2.jpg" alt="Profile" className='w-full h-full object-cover'/>
            </div>
            
          </label>
        )}
        <input 
          type="file" 
          id="upload-profile-photo" 
          accept="image/*" 
          className="hidden" 
          onChange={handlePhotoUpload}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent mix-blend-overlay"></div>
      </div>
      
      {/* Card type */}
      <div className="absolute top-[214px] left-0 right-0 h-10 bg-[#9b87f5] flex items-center px-4">
        <span className="font-semibold text-sm text-white">[FULL-STACK DEVELOPER]</span>
      </div>
      
      {/* Card description */}
      <div className="absolute top-[254px] left-0 right-0 bottom-0 bg-[#f0e6d2] p-4">
        <div className="text-xs text-[#111827] h-full overflow-auto">
          <p className="mb-2">
            EFEITO: Este desenvolvedor pode criar aplicações web e mobile completas, 
            dominando tanto o front-end quanto o back-end.
          </p>
          <p>
            ATK/ ∞ DEF/ ∞
          </p>
        </div>
      </div>
      
      {/* Card holographic overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/20 opacity-30 z-20 pointer-events-none"></div>
    </div>
  );
};

export default YugiohProfileCard; 