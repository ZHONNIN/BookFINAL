const pageVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
uniform float uBendAmount;
uniform float uFlipProgress;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);

  vec3 pos = position;

  float bendFactor = sin(uv.x * 3.14159) * uBendAmount * uFlipProgress;
  pos.z += bendFactor * 0.008;

  vPosition = pos;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const pageFragmentShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 baseColor = vec3(0.95, 0.93, 0.88);

  float noise = fract(sin(dot(vUv * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
  baseColor += noise * 0.02;

  float edgeDarken = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
  edgeDarken *= smoothstep(0.0, 0.05, vUv.y) * smoothstep(1.0, 0.95, vUv.y);

  baseColor *= 0.85 + edgeDarken * 0.15;

  gl_FragColor = vec4(baseColor, 1.0);
}
`;

function createShaderPageMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: pageVertexShader,
    fragmentShader: pageFragmentShader,
    uniforms: {
      uBendAmount: { value: 0.0 },
      uFlipProgress: { value: 0.0 }
    },
    side: THREE.DoubleSide
  });
}
