uniform float uTime;

varying vec2 vUv;

void main() { 
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
  float elevation = ( 1.0 - uv.y) * 
  sin(modelPosition.x + 
  (uTime * 0.008)) 
  * 0.01;

  float depth = ( 1.0 - uv.y) * 
  sin(modelPosition.z + 
  (uTime * 0.008)) 
  * 0.01;

  modelPosition.z += elevation;
  modelPosition.x += depth;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  vUv = uv;
}
