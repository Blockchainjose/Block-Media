import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

function AnimatedCube() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3 + 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.8;
    }
  });

  return (
    <RoundedBox
      ref={meshRef}
      args={[1.5, 1.5, 1.5]}
      radius={0.15}
      smoothness={4}
    >
      <meshStandardMaterial
        color="#EF4444"
        emissive="#EF4444"
        emissiveIntensity={0.3}
        metalness={0.6}
        roughness={0.2}
        envMapIntensity={1.2}
      />
    </RoundedBox>
  );
}

interface Logo3DCubeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo3DCube({ size = "md", className = "" }: Logo3DCubeProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  };

  return (
    <div 
      className={`${sizes[size]} ${className} relative`}
      style={{
        filter: "drop-shadow(0 0 8px rgba(239, 68, 68, 0.5)) drop-shadow(0 0 16px rgba(239, 68, 68, 0.3))",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#EF4444" />
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={1.2}
          color="#ffffff"
        />
        <AnimatedCube />
      </Canvas>
    </div>
  );
}
