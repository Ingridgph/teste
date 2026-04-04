"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, RoundedBox } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

function IPhoneMesh() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  useEffect(() => {
    if (!meshRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(meshRef.current!.rotation, {
        x: Math.PI * 0.15,
        z: Math.PI * 0.05,
        scrollTrigger: { trigger: "#hero-section", start: "top top", end: "bottom top", scrub: 1.5 },
      });
      gsap.to(meshRef.current!.scale, {
        x: 1.4, y: 1.4, z: 1.4,
        scrollTrigger: { trigger: "#hero-section", start: "top top", end: "60% top", scrub: 1 },
      });
      gsap.to(meshRef.current!.position, {
        y: -1.5,
        scrollTrigger: { trigger: "#hero-section", start: "60% top", end: "bottom top", scrub: 1 },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={meshRef} scale={1}>
        <RoundedBox args={[1.2, 2.4, 0.15]} radius={0.12} smoothness={4}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.95} roughness={0.05} />
        </RoundedBox>
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[1.0, 2.1]} />
          <meshStandardMaterial color="#000000" emissive="#1e40af" emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.0, 0.085]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0} />
        </mesh>
      </group>
    </Float>
  );
}

export default function Hero3DCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1.5} color="#3b82f6" />
        <spotLight position={[-5, -2, 3]} angle={0.3} penumbra={1} intensity={0.8} color="#8b5cf6" />
        <pointLight position={[0, 3, 2]} intensity={0.5} color="#ffffff" />
        <IPhoneMesh />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
