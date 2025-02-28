import { Canvas } from "@react-three/fiber";
import { ScrollControls, Sky, useScroll, PerspectiveCamera, CameraControls } from '@react-three/drei'
import { Color } from 'three'
import { Model } from './RI_TemplateSceneNew.jsx'
import { Water } from './components/Water'
import { Suspense } from 'react'
import Island from './components/Island.jsx'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        gl={{ alpha: false }}
        scene={{ background: new Color('#87CEEB') }}
      >
        <Suspense fallback={null}>
          <ScrollControls pages={3} damping={0.1}>
            <Island />
          </ScrollControls>
          {/* <CameraControls/> */}
        </Suspense>
      </Canvas>
    </div>
  );
}