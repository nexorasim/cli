
import React, { useEffect, useRef } from 'react';

const Globe: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<any>(null);

    useEffect(() => {
        const { THREE, gsap } = window as any;

        if (typeof THREE === 'undefined' || !mountRef.current || rendererRef.current) {
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
        camera.position.z = 2.5;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Globe
        const geometry = new THREE.SphereGeometry(1.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0x0A0F1A,
            transparent: true,
            opacity: 0.9,
            shininess: 50,
        });
        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        // Wireframe
        const wireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry),
            new THREE.LineBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.1,
            })
        );
        globe.add(wireframe);

        // Lights
        const ambientLight = new THREE.AmbientLight(0x00ffff, 0.2);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);

        // Pin for Myanmar
        const createPin = (lat: number, lon: number) => {
            const pinGeometry = new THREE.SphereGeometry(0.02, 16, 16);
            const pinMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
            const pin = new THREE.Mesh(pinGeometry, pinMaterial);

            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);

            pin.position.x = -1.5 * Math.sin(phi) * Math.cos(theta);
            pin.position.y = 1.5 * Math.cos(phi);
            pin.position.z = 1.5 * Math.sin(phi) * Math.sin(theta);
            
            return pin;
        };

        const myanmarPin = createPin(19.86, 96.06); // Approx center of Myanmar
        globe.add(myanmarPin);
        
        // Add glow to pin
        const spriteMaterial = new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(generateGlowTexture()),
            color: 0x00ffff,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        const glowSprite = new THREE.Sprite(spriteMaterial);
        glowSprite.scale.set(0.2, 0.2, 1.0);
        myanmarPin.add(glowSprite);

        // Pulse animation for pin and glow
        if (gsap) {
            gsap.to(myanmarPin.scale, {
                x: 1.5, y: 1.5, z: 1.5,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
            gsap.to(glowSprite.scale, {
                x: 0.3, y: 0.3, z: 0.3,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
        }


        function generateGlowTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const context = canvas.getContext('2d')!;
            const gradient = context.createRadialGradient(
                canvas.width / 2,
                canvas.height / 2,
                0,
                canvas.width / 2,
                canvas.height / 2,
                canvas.width / 2
            );
            gradient.addColorStop(0, 'rgba(0, 255, 255, 1)');
            gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.5)');
            gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
            return canvas;
        }

        // Stars
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.01,
            transparent: true,
            opacity: 0.5
        });
        const starVertices = [];
        for (let i = 0; i < 5000; i++) {
            const x = (Math.random() - 0.5) * 100;
            const y = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 100;
            if(Math.sqrt(x*x + y*y + z*z) > 10) // Only outside a certain radius
                starVertices.push(x, y, z);
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);


        let mouseX = 0;
        let mouseY = 0;

        const onMouseMove = (event: MouseEvent) => {
            if(mountRef.current) {
                 const rect = mountRef.current.getBoundingClientRect();
                 mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                 mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            }
        };
        mountRef.current.addEventListener('mousemove', onMouseMove);

        const animate = () => {
            if (!rendererRef.current) return;
            requestAnimationFrame(animate);

            globe.rotation.y += 0.001;
            stars.rotation.y += 0.0001;

            camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
            camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
             if (mountRef.current) {
                camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
             }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if(mountRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                mountRef.current.removeEventListener('mousemove', onMouseMove);
                // eslint-disable-next-line react-hooks/exhaustive-deps
                if(rendererRef.current) mountRef.current.removeChild(rendererRef.current.domElement);
            }
            rendererRef.current = null;
        };
    }, []);

    return <div ref={mountRef} className="w-full h-full" />;
};

export default Globe;