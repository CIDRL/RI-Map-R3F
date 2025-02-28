import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera, useScroll, Sky } from '@react-three/drei'
import { useRef, useLayoutEffect } from 'react'
import { Model } from '../RI_TemplateSceneNew'
import { Water } from './Water'
import * as THREE from 'three'

export default function Island() {
  const scroll = useScroll()
  const cameraRef = useRef()
  const modelRef = useRef()

  // Update camera position based on scroll
  useFrame((state, delta) => {
    const offset = scroll.offset // Value between 0 and 1
    
    // Calculate camera position based on scroll
    // Move along a curved path from south to north
    const cameraX = 800 + Math.sin(offset * Math.PI) * 200
    const cameraY = 80 + Math.sin(offset * Math.PI) * 40
    const cameraZ = 250 - offset * 2000 // Move north-south

    // Update camera position smoothly
    if (cameraRef.current) {
      cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, cameraX, delta * 2)
      cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, cameraY, delta * 2)
      cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, cameraZ, delta * 2)
      
      // Make camera look at the model
      cameraRef.current.lookAt(625, 0, -1000)
    }
  })

  return (
    <>
      <PerspectiveCamera 
        ref={cameraRef}
        makeDefault
        far={10000}
        near={0.1}
        fov={75}
        position={[800, 80, 250]}
        rotation={[-0.2, 0.0, 0.0]}
      />

      <Model 
        ref={modelRef}
        position={[625, -10, -1000]} 
        rotation={[0.0, Math.PI/4.0, 0]}
      />

      <ambientLight intensity={1.5} />
      <directionalLight position={[0, 10, 5]} intensity={1} />
      
      <Water 
        size={5000}
        position={[0, -5, 0]}
        segments={128}
        color={[0.1, 0.3, 0.5]}
        waveHeight={0.2}
        waveSpeed={2}
        waveFrequency={[3.0, 2.0]}
        opacity={0.8}
      />

      <Sky 
        distance={450000} 
        sunPosition={[0, 1, 0]} 
        inclination={0} 
        azimuth={0.25} 
      />
    </>
  )
} 