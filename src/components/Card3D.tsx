
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface Card3DProps {
  name: string;
  title: string;
  imageUrl: string;
}

const Card3D = ({ name, title, imageUrl }: Card3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cardMeshRef = useRef<THREE.Mesh | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const initialPositionRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });
  const frameId = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup Three.js
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.z = 300;
    cameraRef.current = camera;

    // Create renderer with better quality settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create holographic texture
    const holographicTexture = new THREE.TextureLoader().load(
      'data:image/png;base64,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'
    );

    // Create card geometry with better proportions
    const cardGeometry = new THREE.BoxGeometry(120, 170, 5);
    
    // Create card materials with more futuristic look
    const frontMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x7c3aed,
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
    });

    const backMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x5b21b6,
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
    });

    const edgeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xc4b5fd,
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
      map: holographicTexture,
      transparent: true,
      opacity: 0.95
    });

    // Create card mesh with materials
    const materials = [
      edgeMaterial, // right side
      edgeMaterial, // left side
      edgeMaterial, // top side
      edgeMaterial, // bottom side
      frontMaterial, // front side (with texture)
      backMaterial, // back side
    ];

    const cardMesh = new THREE.Mesh(cardGeometry, materials);
    cardMesh.castShadow = true;
    cardMesh.receiveShadow = true;
    scene.add(cardMesh);
    cardMeshRef.current = cardMesh;

    // Add special effects and decorations
    // Add glowing border
    const borderGeometry = new THREE.BoxGeometry(124, 174, 1);
    const borderMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.5,
    });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.z = -3;
    scene.add(border);

    // Add text to the card
    const createText = (text: string, size: number, height: number, position: THREE.Vector3, color: number = 0xffffff) => {
      const textGeometry = new THREE.TextGeometry(text, {
        font: new THREE.Font({}), // This would require a font loader
        size: size,
        height: height,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: color });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.copy(position);
      return textMesh;
    };

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add point lights for dramatic effect with moving animation
    const pointLight1 = new THREE.PointLight(0x7c3aed, 1, 500);
    pointLight1.position.set(100, 100, 100);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xf97316, 1, 500);
    pointLight2.position.set(-100, -100, 100);
    scene.add(pointLight2);

    // Add particle effects
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 100;

    const posArray = new Float32Array(particleCount * 3);
    for(let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 300;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 2,
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.5,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Mouse interaction for 3D card
    const onDocumentMouseDown = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Check if the mouse is inside the container
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
        initialPositionRef.current = { 
          x: cardMeshRef.current?.rotation.y || 0, 
          y: cardMeshRef.current?.rotation.x || 0 
        };
        
        // Prevent text selection
        e.preventDefault();
      }
    };

    const onDocumentMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current && cardMeshRef.current) {
        const deltaMove = {
          x: e.clientX - previousMousePositionRef.current.x,
          y: e.clientY - previousMousePositionRef.current.y
        };

        // Update rotation
        rotationRef.current = {
          x: initialPositionRef.current.y + deltaMove.y * 0.01,
          y: initialPositionRef.current.x + deltaMove.x * 0.01
        };
        
        // Apply rotation with limits
        cardMeshRef.current.rotation.x = THREE.MathUtils.clamp(
          rotationRef.current.x, 
          -Math.PI / 3, 
          Math.PI / 3
        );
        
        cardMeshRef.current.rotation.y = THREE.MathUtils.clamp(
          rotationRef.current.y, 
          -Math.PI / 3, 
          Math.PI / 3
        );

        // Also rotate the border
        border.rotation.copy(cardMeshRef.current.rotation);
      } else if (!isDraggingRef.current && cardMeshRef.current) {
        // Subtle movement based on mouse position when not dragging
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const mouseXPercent = (e.clientX / windowWidth) * 2 - 1;
        const mouseYPercent = (e.clientY / windowHeight) * 2 - 1;
        
        gsap.to(cardMeshRef.current.rotation, {
          x: -mouseYPercent * 0.1,
          y: mouseXPercent * 0.1,
          duration: 1,
          ease: "power2.out"
        });

        // Also animate the border
        gsap.to(border.rotation, {
          x: -mouseYPercent * 0.1,
          y: mouseXPercent * 0.1,
          duration: 1,
          ease: "power2.out"
        });
      }
    };

    const onDocumentMouseUp = () => {
      if (isDraggingRef.current && cardMeshRef.current) {
        isDraggingRef.current = false;
        
        // Spring back animation
        gsap.to(cardMeshRef.current.rotation, {
          x: 0,
          y: 0,
          duration: 1.5,
          ease: "elastic.out(1.2, 0.5)"
        });

        // Also animate the border
        gsap.to(border.rotation, {
          x: 0,
          y: 0,
          duration: 1.5,
          ease: "elastic.out(1.2, 0.5)"
        });
      }
    };

    document.addEventListener('mousedown', onDocumentMouseDown);
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);

    // Touch events for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length !== 1) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: touch.clientX, y: touch.clientY };
        initialPositionRef.current = { 
          x: cardMeshRef.current?.rotation.y || 0, 
          y: cardMeshRef.current?.rotation.x || 0 
        };
        
        e.preventDefault();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !cardMeshRef.current || e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      const deltaMove = {
        x: touch.clientX - previousMousePositionRef.current.x,
        y: touch.clientY - previousMousePositionRef.current.y
      };

      rotationRef.current = {
        x: initialPositionRef.current.y + deltaMove.y * 0.01,
        y: initialPositionRef.current.x + deltaMove.x * 0.01
      };
      
      cardMeshRef.current.rotation.x = THREE.MathUtils.clamp(
        rotationRef.current.x, 
        -Math.PI / 3, 
        Math.PI / 3
      );
      
      cardMeshRef.current.rotation.y = THREE.MathUtils.clamp(
        rotationRef.current.y, 
        -Math.PI / 3, 
        Math.PI / 3
      );

      // Also rotate the border
      border.rotation.copy(cardMeshRef.current.rotation);
      
      e.preventDefault();
    };

    const onTouchEnd = () => {
      if (isDraggingRef.current && cardMeshRef.current) {
        isDraggingRef.current = false;
        
        gsap.to(cardMeshRef.current.rotation, {
          x: 0,
          y: 0,
          duration: 1.5,
          ease: "elastic.out(1.2, 0.5)"
        });

        // Also animate the border
        gsap.to(border.rotation, {
          x: 0,
          y: 0,
          duration: 1.5,
          ease: "elastic.out(1.2, 0.5)"
        });
      }
    };

    document.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);

    // Animation loop
    const animate = () => {
      frameId.current = requestAnimationFrame(animate);
      
      // Add subtle floating animation when not interacting
      if (!isDraggingRef.current && cardMeshRef.current) {
        cardMeshRef.current.position.y = Math.sin(Date.now() * 0.001) * 5;
        border.position.y = cardMeshRef.current.position.y;
      }

      // Animate point lights
      pointLight1.position.x = Math.sin(Date.now() * 0.001) * 150;
      pointLight1.position.y = Math.cos(Date.now() * 0.001) * 150;
      
      pointLight2.position.x = Math.sin(Date.now() * 0.0015) * -150;
      pointLight2.position.y = Math.cos(Date.now() * 0.0015) * -150;

      // Rotate particles
      particlesMesh.rotation.y += 0.001;
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', onDocumentMouseDown);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      
      if (containerRef.current && rendererRef.current) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement);
        } catch (e) {
          console.warn('Error removing renderer:', e);
        }
      }
    };
  }, [imageUrl]);

  return (
    <div className="card3d-container" ref={containerRef}>
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div 
          className="text-white font-display text-center p-4"
          ref={cardRef}
        >
          <h3 className="text-xl font-bold mb-1">{name}</h3>
          <p className="text-sm opacity-80">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default Card3D;
