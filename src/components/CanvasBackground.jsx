import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CanvasBackground = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        // Accessibility check
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const currentMount = mountRef.current;

        // Setup Scene
        const scene = new THREE.Scene();
        // Utilize #0c0c0c for fog to match Obsidian Elegance background
        scene.fog = new THREE.FogExp2(0x0c0c0c, 0.002);

        // Setup Camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 40;

        // Setup Renderer
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        currentMount.appendChild(renderer.domElement);

        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            // Spread particles
            posArray[i] = (Math.random() - 0.5) * 150;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        // Ambient glowing particles
        const material = new THREE.PointsMaterial({
            size: 0.2,
            color: 0xFAFAFA, // High contrast off-white
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, material);
        scene.add(particlesMesh);

        // Mouse Interaction for subltle movement
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        const onDocumentMouseMove = (event) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        };

        document.addEventListener('mousemove', onDocumentMouseMove);

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);

            targetX = mouseX * 0.0005;
            targetY = mouseY * 0.0005;

            // Base idle rotation
            particlesMesh.rotation.y += 0.0005;
            particlesMesh.rotation.x += 0.0002;

            // Interactive spring-like reaction
            particlesMesh.rotation.y += 0.02 * (targetX - particlesMesh.rotation.y);
            particlesMesh.rotation.x += 0.02 * (targetY - particlesMesh.rotation.x);

            renderer.render(scene, camera);
        };

        animate();

        // Handle Window Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousemove', onDocumentMouseMove);
            if (currentMount) {
                currentMount.removeChild(renderer.domElement);
            }
            particlesGeometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                pointerEvents: 'none'
            }}
        />
    );
};

export default CanvasBackground;
