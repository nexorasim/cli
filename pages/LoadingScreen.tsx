import React, { useEffect, useRef } from 'react';
import { BRAND_INFO } from '../constants';

interface LoadingScreenProps {
  isVisible: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isVisible }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const tlRef = useRef<any>(null);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    const { gsap } = window as any;
    if (!gsap || !gsap.plugins || !gsap.plugins.scrambleText || !gsap.plugins.motionPath) {
      console.error("GSAP or required plugins (ScrambleText, MotionPath) not loaded for LoadingScreen page.");
      return;
    }
    
    if (tlRef.current) {
      tlRef.current.kill();
    }

    const globe = containerRef.current.querySelector('#globe');
    const dataPoints = containerRef.current.querySelectorAll('.data-point');
    const orbits = [
        containerRef.current.querySelector('#orbit1'),
        containerRef.current.querySelector('#orbit2'),
        containerRef.current.querySelector('#orbit3'),
    ];

    tlRef.current = gsap.timeline();

    // Globe rotation
    tlRef.current.to(globe, {
        duration: 30, // Slower rotation
        rotation: 360,
        transformOrigin: '50% 50%',
        ease: 'none',
        repeat: -1,
    });
    
    // Data points animation
    dataPoints.forEach((point, i) => {
        tlRef.current.fromTo(point, 
            { autoAlpha: 0 },
            { 
                duration: 4 + Math.random() * 2,
                autoAlpha: 1,
                motionPath: {
                    path: orbits[i % orbits.length],
                    align: orbits[i % orbits.length],
                    alignOrigin: [0.5, 0.5],
                },
                ease: 'power1.inOut',
                repeat: -1,
                repeatDelay: Math.random() * 3,
            }, Math.random());
    });
    
    // Scramble text animation
    const loadingTexts = [
        "Booting Nexora AI+ Core...",
        "Connecting to Gemini API Gateway...",
        "Loading intelligent models...",
        "Finalizing secure interface...",
    ];
    
    const textTl = gsap.timeline({ repeat: -1 });
    loadingTexts.forEach((text, i) => {
        textTl.to(textRef.current, {
            duration: 1.1,
            scrambleText: { text, chars: "░▒▓█", revealDelay: 0.4, speed: 0.4 },
            ease: "none"
        }, i === 0 ? "+=0" : ">-0.3");
    });
    tlRef.current.add(textTl, 0);

    return () => {
        if (tlRef.current) {
            tlRef.current.kill();
            tlRef.current = null;
        }
    }
  }, [isVisible]);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 bg-primary flex flex-col items-center justify-center z-[100] transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
      aria-hidden={!isVisible}
      aria-label="Loading page"
    >
        <div className="relative w-48 h-48">
            <svg
                viewBox="0 0 200 200"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <radialGradient id="glow-center" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#00ffff" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
                    </radialGradient>
                     <filter id="glow-filter">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                
                <circle cx="100" cy="100" r="90" fill="url(#glow-center)" />

                <g id="globe" stroke="#00ffff" strokeWidth="0.5" strokeOpacity="0.5">
                    <circle cx="100" cy="100" r="50" />
                    <ellipse cx="100" cy="100" rx="50" ry="20" />
                    <ellipse cx="100" cy="100" rx="50" ry="40" />
                    <line x1="100" y1="20" x2="100" y2="180" />
                </g>

                <path id="orbit1" d="M 50,100 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0" className="stroke-secondary/30" strokeWidth="0.2" />
                <path id="orbit2" d="M 25,100 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" className="stroke-secondary/20" strokeWidth="0.2" transform="rotate(30 100 100)" />
                <path id="orbit3" d="M 10,100 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0" className="stroke-secondary/10" strokeWidth="0.2" transform="rotate(-30 100 100)" />

                <circle r="1" fill="#00ffff" filter="url(#glow-filter)" className="data-point" />
                <circle r="1.2" fill="#00ffff" filter="url(#glow-filter)" className="data-point" />
                <circle r="0.8" fill="#00ffff" filter="url(#glow-filter)" className="data-point" />
            </svg>
        </div>
        
        <p className="mt-8 text-lg font-semibold tracking-widest text-secondary uppercase">
            {BRAND_INFO.name}
        </p>
        <p ref={textRef} className="mt-2 text-sm text-gray-400 font-mono w-64 text-center h-4"></p>
    </div>
  );
};

export default LoadingScreen;