"use client";

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, MeshDistortMaterial, ContactShadows, Html, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles } from 'lucide-react';

function HumanoidModel({ onSelectPart }: { onSelectPart: (part: string) => void }) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const { scene } = useGLTF('/human.glb');

  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: '#ffffff',
          metalness: 0.4,
          roughness: 0.1,
          transmission: 0.9,
          thickness: 0.5,
          transparent: true,
          opacity: 0.4,
        });
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  const parts = [
    { id: '이마거상', name: 'FOREHEAD', position: [0, 2.8, 0.4] },
    { id: '얼굴거상/동안성형', name: 'FACE', position: [0, 2.3, 0.4] },
    { id: '목거상', name: 'NECK', position: [0, 1.8, 0.2] },
    { id: '가슴거상/가슴성형', name: 'BREAST', position: [0, 1.0, 0.4] },
    { id: '복부거상/지방흡입', name: 'TUMMY', position: [0, 0.0, 0.4] },
    { id: '엉덩이성형', name: 'HIP', position: [0, -0.8, 0.0] },
    { id: '팔거상', name: 'LEFT ARM', position: [-0.9, 0.6, 0] },
    { id: '팔거상', name: 'RIGHT ARM', position: [0.9, 0.6, 0] },
    { id: '허벅지거상', name: 'LEFT THIGH', position: [-0.4, -1.8, 0.2] },
    { id: '허벅지거상', name: 'RIGHT THIGH', position: [0.4, -1.8, 0.2] },
  ];

  return (
    <group ref={group} position={[0, -0.5, 0]}>
      <Center scale={3.5} position={[0, 0, 0]}>
        <primitive object={scene} />
      </Center>

      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 6, 8]} />
        <meshBasicMaterial color="#EC4899" transparent opacity={0.3} />
      </mesh>

      {parts.map((part, index) => {
        const isHovered = hovered === part.id;
        return (
          <mesh
            key={`${part.id}-${index}`}
            position={new THREE.Vector3(...(part.position as [number, number, number]))}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(part.id); document.body.style.cursor = 'pointer'; }}
            onPointerOut={(e) => { e.stopPropagation(); setHovered(null); document.body.style.cursor = 'auto'; }}
            onClick={(e) => { e.stopPropagation(); onSelectPart(part.id); }}
          >
            <sphereGeometry args={[isHovered ? 0.25 : 0.15, 32, 32]} />
            <MeshDistortMaterial
              color={isHovered ? "#EC4899" : "#ffffff"}
              envMapIntensity={isHovered ? 3 : 1.5}
              clearcoat={1}
              clearcoatRoughness={0.1}
              metalness={0.8}
              roughness={0.1}
              distort={isHovered ? 0.5 : 0.2}
              speed={isHovered ? 4 : 2}
              transparent
              opacity={isHovered ? 1 : 0.8}
            />

            {isHovered && (
              <mesh>
                <ringGeometry args={[0.3, 0.32, 32]} />
                <meshBasicMaterial color="#EC4899" transparent opacity={0.6} side={THREE.DoubleSide} />
              </mesh>
            )}

            {isHovered && (
              <Html center position={[1.2, 0, 0]} className="pointer-events-none z-50">
                <div className="glass-card px-4 py-2 rounded-full flex flex-col items-start min-w-[120px] animate-in fade-in zoom-in duration-300 shadow-2xl border border-pink-500/30 bg-black/60 backdrop-blur-md">
                  <span className="text-[10px] text-pink-400 font-bold tracking-[0.2em]">{part.name}</span>
                  <span className="text-white text-xs font-light whitespace-nowrap">{part.id.split('/')[0]} 분석하기</span>
                </div>
              </Html>
            )}
          </mesh>
        )
      })}
    </group>
  );
}

useGLTF.preload('/human.glb');

export default function ThreeDModel() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [analysisText, setAnalysisText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSelectPart = async (part: string) => {
    setSelectedPart(part);
    setIsAnalyzing(true);
    setAnalysisText('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `${part} 부위의 수술/시술에 대한 핵심 정보와 회복 기간을 3문장으로 전문적으로 요약해줘.` }]
        })
      });

      if (!response.ok) throw new Error('API Error');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (reader) {
        let text = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          text += chunk;
          setAnalysisText(text);
        }
      }
    } catch (e) {
      setAnalysisText('분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#EC4899" />
        <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={1} color="#C9A96E" />
        
        <Environment preset="city" />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <HumanoidModel onSelectPart={handleSelectPart} />
        </Float>

        <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={10} blur={2} far={10} color="#EC4899" />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2 + 0.2} minPolarAngle={Math.PI / 2 - 0.5} />
      </Canvas>

      {selectedPart && (
        <div className="absolute top-1/2 right-8 -translate-y-1/2 w-[360px] glass-dark rounded-3xl p-6 border border-white/10 shadow-2xl z-50 animate-in slide-in-from-right-8 duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full instagram-gradient flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">AI 부위별 정밀 분석</h3>
              <p className="text-pink-400 text-[10px] tracking-widest uppercase">Target: {selectedPart}</p>
            </div>
          </div>
          
          <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.05] min-h-[150px]">
            {isAnalyzing && !analysisText ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-6">
                <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-white/50 text-xs tracking-widest">RAG DB 검색 중...</span>
              </div>
            ) : (
              <p className="text-white/80 text-sm leading-relaxed font-light whitespace-pre-wrap">
                {analysisText}
                {isAnalyzing && <span className="inline-block w-1.5 h-4 ml-1 bg-pink-500 animate-pulse align-middle" />}
              </p>
            )}
          </div>

          <button 
            onClick={() => { setSelectedPart(null); setAnalysisText(''); }}
            className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 text-xs font-bold tracking-widest transition-colors"
          >
            닫기
          </button>
        </div>
      )}
    </>
  );
}
