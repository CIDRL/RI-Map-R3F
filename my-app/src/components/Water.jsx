import { extend, useFrame } from "@react-three/fiber";
import { Plane } from '@react-three/drei'
import { useRef } from 'react'
import { Color, ShaderMaterial } from 'three'

class WaterMaterialImpl extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(0.1, 0.3, 0.5) }
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          vUv = uv;
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          
          float elevation = sin(modelPosition.x * 3.0 + uTime) * 0.1
            + sin(modelPosition.z * 2.0 + uTime * 0.5) * 0.1;
          
          modelPosition.y += elevation;
          vElevation = elevation;

          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          
          gl_Position = projectedPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          vec3 color = uColor;
          color.rgb += vElevation * 0.2;
          gl_FragColor = vec4(color, 0.8);
        }
      `,
      transparent: true
    });
  }
}

extend({ WaterMaterial: WaterMaterialImpl });

export function Water({ 
  size = 20, 
  position = [0, 0, 0], 
  segments = 64, 
  color = [0.1, 0.3, 0.5],
  waveHeight = 0.1,
  waveSpeed = 1,
  waveFrequency = [3.0, 2.0],
  opacity = 0.8
}) {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime() * waveSpeed;
      materialRef.current.uniforms.uColor.value = new Color(...color);
    }
  });

  return (
    <Plane 
      args={[size, size, segments, segments]} 
      rotation-x={-Math.PI / 2} 
      position={position}
    >
      <waterMaterial 
        ref={materialRef} 
        side={2}
        transparent
        opacity={opacity}
      />
    </Plane>
  );
} 