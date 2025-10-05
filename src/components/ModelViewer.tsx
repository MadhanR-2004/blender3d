'use client';

import { useRef, Suspense } from 'react';
// @ts-ignore - React Three Fiber beta types
import { Canvas } from '@react-three/fiber';
// @ts-ignore
import { OrbitControls, PerspectiveCamera, useGLTF, Center, Html } from '@react-three/drei';
import * as THREE from 'three';

// Extend JSX types for React Three Fiber
declare global {
  namespace JSX {
    interface IntrinsicElements {
      primitive: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      gridHelper: any;
    }
  }
}

interface ModelViewerProps {
  modelUrl: string;
  format: string;
}

function Model({ url }: { url: string }) {
  const modelRef = useRef<THREE.Group>(null);
  
  // Load the GLTF model
  const gltf = useGLTF(url);

  return (
    <Center>
      <primitive ref={modelRef} object={gltf.scene} scale={1} />
    </Center>
  );
}

function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          {/* Inner pulsing circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-pulse rounded-full h-8 w-8 bg-blue-400"></div>
          </div>
        </div>
        <p className="text-white mt-4 font-semibold">Loading 3D model...</p>
        <p className="text-gray-400 text-sm mt-1">Please wait</p>
      </div>
    </Html>
  );
}

export default function ModelViewer({ modelUrl, format }: ModelViewerProps) {
  const formatLower = format.toLowerCase();
  if (formatLower !== 'glb' && formatLower !== 'gltf') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 dark:bg-black rounded-lg">
        <div className="text-center">
          <p className="text-gray-400 dark:text-gray-500 mb-2">
            Preview not available for {format.toUpperCase()} format.
          </p>
          <p className="text-gray-500 dark:text-gray-600 text-sm">
            Supported formats: GLB, GLTF
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-900 dark:bg-black rounded-lg overflow-hidden relative">
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        gl={{ antialias: true, alpha: false }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={15}
          maxPolarAngle={Math.PI / 1.5}
        />
        
        {/* Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.4} />
        <pointLight position={[0, 5, 0]} intensity={0.3} />
        
        {/* Model */}
        <Suspense fallback={<LoadingSpinner />}>
          <Model url={modelUrl} />
        </Suspense>
      </Canvas>
    </div>
  );
}
