import React, { Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import vrHead from "../../assets/vrHead.glb";
import visionPro from "../../assets/apple-vision-pro.glb";

function HeadModel({ mouse }) {
  const head = useGLTF(vrHead);
  const headset = useGLTF(visionPro);
  const groupRef = React.useRef();

  React.useEffect(() => {
    head.scene.traverse((child) => {
        if (child.isMesh) {
            child.material.color.set('#B7B7ED');
        }
    });
  }, [head]);

  useFrame(() => {
    if (groupRef.current && mouse.current) {
      const x = (mouse.current.x - 0.5) * 2;
      const y = (mouse.current.y - 0.5) * 2;
      groupRef.current.rotation.y = x;
      groupRef.current.rotation.x = y;
    }
  });

  return (
    <group ref={groupRef} scale={1.08}>
      <primitive object={head.scene} />
      <primitive
        object={headset.scene}
        position={[0, 0.3, 0.6]}
        rotation={[0, 4.75, 0]}
        scale={[2, 2.8, 3]}
      />
    </group>
  );
}

export default function FloatingHead3D() {
  const mouse = React.useRef({ x: 0.5, y: 0.5 });

  return (
    <div className="w-72 md:w-96 h-72 md:h-96">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <Suspense fallback={null}>
          <HeadModel mouse={mouse} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      <div
        className="absolute top-0 left-0 w-full h-full"
        onMouseMove={(e) => {
          mouse.current = {
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight
          }
        }}
      />
    </div>
  )
}