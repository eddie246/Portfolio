uniform float uTime;

varying vec2 vUv;

void main() { 
  vec4 modelPosition = modelMatrix * vec4(position, 1.0); 

  modelPosition.y += abs(sin(uTime * 0.005) * 0.5);

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  vUv = uv;
}
