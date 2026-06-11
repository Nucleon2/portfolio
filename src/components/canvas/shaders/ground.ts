import { NOISE_GLSL } from "./noise";

export const groundVertex = /* glsl */ `
  ${NOISE_GLSL}

  #include <fog_pars_vertex>

  varying vec2 vWorldXZ;
  varying float vElevation;

  void main() {
    vec3 pos = position;

    // Gentle dunes, flattened along the camera corridor (|x| < ~4).
    float corridor = smoothstep(3.0, 10.0, abs(pos.x));
    float elevation = fbm(pos.xz * 0.06) * 1.6 * corridor;
    pos.y += elevation;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldXZ = worldPos.xz;
    vElevation = elevation;

    vec4 mvPosition = viewMatrix * worldPos;
    gl_Position = projectionMatrix * mvPosition;

    #include <fog_vertex>
  }
`;

export const groundFragment = /* glsl */ `
  ${NOISE_GLSL}

  #include <fog_pars_fragment>

  uniform float uTime;
  uniform vec3 uBase;
  uniform vec3 uVeinColor;
  uniform float uVeinIntensity;

  varying vec2 vWorldXZ;
  varying float vElevation;

  void main() {
    // Near-black mossy base, slightly lighter on rises.
    vec3 color = uBase * (0.8 + vElevation * 0.25);

    // Mycelium veins: glowing ridgelines where noise crosses its midpoint,
    // with a slow pulse travelling along them.
    float n = fbm(vWorldXZ * 0.16);
    float vein = 1.0 - smoothstep(0.0, 0.05, abs(n - 0.5));
    float pulse = 0.55 + 0.45 * sin(uTime * 0.8 - n * 18.0);
    color += uVeinColor * vein * pulse * uVeinIntensity;

    gl_FragColor = vec4(color, 1.0);

    #include <fog_fragment>
  }
`;
