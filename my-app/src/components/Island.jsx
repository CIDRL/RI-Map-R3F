import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, useScroll, Sky, Html } from '@react-three/drei'
import { useRef, useState } from 'react'
import { Model } from '../RI_TemplateSceneNew'
import { Water } from './Water'
import * as THREE from 'three'

const BuildingPopup = ({ onClose }) => (
  <Html
    center
    style={{
      background: 'rgba(0, 0, 0, 0.8)',
      padding: '20px',
      borderRadius: '8px',
      color: 'white',
      width: '600px',
      transform: 'translateX(50px)',
      pointerEvents: 'auto',
      userSelect: 'none'
    }}
    distanceFactor={150}
  >
    <div>
      <h2 style={{ 
        margin: '0 0 15px 0', 
        fontSize: '1.5em',
        color: '#ffa500' 
      }}>
        Tata
      </h2>
      <p style={{ margin: '0 0 15px 0', fontSize: '1.1em' }}>
        Home of the FARlab
      </p>
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ color: '#ffa500', marginBottom: '5px' }}>Features:</h3>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          <li>Modern Architecture</li>
          <li>Multi-purpose Facility</li>
          <li>Central Location</li>
        </ul>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          background: '#ffa500',
          border: 'none',
          padding: '8px 15px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          color: 'black',
          position: 'absolute',
          top: '10px',
          right: '10px'
        }}
      >
        ✕
      </button>
    </div>
  </Html>
)

// Create a component for interactive buildings
const InteractiveModel = ({ position, rotation }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const hotspotRef = useRef()
  
  const hotspotPosition = new THREE.Vector3(-550, 30, 980)

  const handlePointerOver = () => {
    setIsHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setIsHovered(false)
    document.body.style.cursor = 'default'
  }

  return (
    <group position={position} rotation={rotation}>
      <Model />
      
      {/* Interactive hotspot */}
      <group position={hotspotPosition}>
        <mesh
          ref={hotspotRef}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={() => setShowPopup(!showPopup)}
        >
          <sphereGeometry args={[40, 32, 32]} />
          <meshBasicMaterial 
            color={isHovered ? "#ffa500" : "#ffffff"} 
            transparent
            opacity={0.1}
          />
        </mesh>
        {showPopup && (
          <BuildingPopup onClose={() => setShowPopup(false)} />
        )}
      </group>
    </group>
  )
}

export default function Island() {
  const scroll = useScroll()
  const cameraRef = useRef()

  // Update camera position based on scroll with reduced frequency
  useFrame((state, delta) => {
    const offset = scroll.offset
    
    const cameraX = 800 + Math.sin(offset * Math.PI) * 200
    const cameraY = 80 + Math.sin(offset * Math.PI) * 40
    const cameraZ = 250 - offset * 2000

    if (cameraRef.current) {
      cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, cameraX, delta)
      cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, cameraY, delta)
      cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, cameraZ, delta)
      
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

      <InteractiveModel 
        position={[500, -10, -1000]}
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