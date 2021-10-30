uniform float uTime;
uniform float uRandom;

varying vec2 vUv;

void main() { 
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
  float elevation = ( 1.0 - uv.y) * 
  -abs(sin(modelPosition.x + 
  (uTime * 0.00114)) 
  * 0.183);

  float depth = ( 1.0 - uv.y) * 
  sin(modelPosition.z + 
  (uTime * 0.00132)) 
  * 0.164;

  float wave = ( 1.0 - uv.y) * 
  sin(modelPosition.z + 
  (uTime * 0.00733)) 
  * 0.0273;

  float flutter = ( 1.0 - uv.y) * 
  sin(modelPosition.z + 
  (uTime * 0.0123)) 
  * 0.0073;

  modelPosition.z += elevation;
  modelPosition.z += wave;
  modelPosition.z += flutter;
  
  modelPosition.x += depth;
  modelPosition.x += wave;


  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  vUv = uv;
}
