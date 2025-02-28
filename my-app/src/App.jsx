import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, CameraControls, Center, PerspectiveCamera } from '@react-three/drei'
import { Car } from './Mercedes-Benz_E63.jsx'
import { Model } from './RI_TemplateScene.jsx'
import { Color } from 'three'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        gl={{ alpha: false }}
        scene={{ background: new Color('#87CEEB') }}
      >
        <OrbitControls />
        
        <PerspectiveCamera 
          makeDefault
          far={10000}
          near={0.1}
          fov={75}
          position={[10, 10, 10]}
          rotation={[0, 0, 0]}
        />

        <ambientLight intensity={1.5} />
        <directionalLight position={[0, 10, 5]} intensity={1} />
        
        <Model position={[0, 0, 0]} scale={0.01} />
        <Car position={[0, 0, 5]} scale={0.01} />
        
        <Environment preset="sunset" />
        <axesHelper args={[10]} />
        <gridHelper args={[10, 10]} />
      </Canvas>
    </div>
  );
}