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
        color="#FF3333"
        metalness={0.7}
        roughness={0.15}
        envMapIntensity={1.5}
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
    <div className={`${sizes[size]} ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#DC2626" />
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          color="#ffffff"
        />
        <AnimatedCube />
      </Canvas>
    </div>
  );
}
