import React, { useEffect, useRef } from 'react';

const ParticleBackground: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<any>(null);

    useEffect(() => {
        const { THREE, gsap } = window as any;

        if (typeof THREE === 'undefined' || typeof gsap === 'undefined') {
            console.error("Three.js or GSAP is not loaded");
            return;
        }

        if (rendererRef.current) {
            return; // Already initialized
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 50;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
            rendererRef.current = renderer;
        }

        const createParticles = (count: number, color: number, size: number, yRange: number, opacity: number) => {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(count * 3);

            for (let i = 0; i < count; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 200;
                positions[i * 3 + 1] = (Math.random() - 0.5) * yRange;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const material = new THREE.PointsMaterial({
                color: color,
                size: size,
                transparent: true,
                opacity: opacity,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });

            return new THREE.Points(geometry, material);
        };
        
        // Background stars
        const bgStars = createParticles(20000, 0xffffff, 0.05, 300, 0.6);
        scene.add(bgStars);

        // Central data stream particles
        const centralParticles = createParticles(10000, 0x00ffff, 0.1, 50, 0.8);
        scene.add(centralParticles);


        let mouseX = 0;
        let mouseY = 0;
        const onMouseMove = (event: MouseEvent) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);


        const clock = new THREE.Clock();
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            
            camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            
            bgStars.rotation.y = elapsedTime * 0.02;
            centralParticles.rotation.y = elapsedTime * 0.05;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        gsap.from(camera.position, { z: 200, duration: 4, ease: 'power3.out' });

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', onMouseMove);
            if (mountRef.current && rendererRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                mountRef.current.removeChild(rendererRef.current.domElement);
                rendererRef.current = null;
            }
        };
    }, []);

    return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full z-0 opacity-80" />;
};

export default ParticleBackground;
