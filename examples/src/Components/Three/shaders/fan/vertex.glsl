uniform float uTime;
uniform float uRandom;

uniform vec3 rotation;
varying vec2 vUv;

mat4 rotationX( in float angle ) {
	return mat4(	1.0,		0,			0,			0,
			 		0, 	cos(angle),	-sin(angle),		0,
					0, 	sin(angle),	 cos(angle),		0,
					0, 			0,			  0, 		1);
}

void main() { 
  // vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // vec4 modelRotation = modelMatrix * vec4(rotation, 1.0);
    
  // modelPosition.x = sin(uTime);


  // vec4 viewPosition = viewMatrix * modelPosition;
  // vec4 projectedPosition = projectionMatrix * viewPosition;
  // gl_Position = projectedPosition;

  vec4 vertex = vec4(gl_Vertex.xyz, 1.0);

	vertex = vertex * rotationX(rotation.x)
	// vertex = uMVMatrix * vertex;
	// vNormal = vec3( uNMatrix * vec4( gl_Normal, 1.0 ) );
	// vEyeVec = -vec3( vertex.xyz );
	
	// * rotationX(uTimer*5.0)
	gl_Position = vertex;

  vUv = uv;
}
