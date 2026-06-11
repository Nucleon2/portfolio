/** Mushroom caps: emissive fresnel rim + per-instance pulse phase & tint. */
export const mushroomVertex = /* glsl */ `
  #include <fog_pars_vertex>

  attribute float aPhase;
  attribute vec3 aTint;

  varying vec3 vNormalView;
  varying vec3 vViewDir;
  varying float vPhase;
  varying vec3 vTint;

  void main() {
    vec4 localPos = vec4(position, 1.0);
    vec3 localNormal = normal;
    #ifdef USE_INSTANCING
      localPos = instanceMatrix * localPos;
      localNormal = mat3(instanceMatrix) * localNormal;
    #endif

    vec4 mvPosition = modelViewMatrix * localPos;
    gl_Position = projectionMatrix * mvPosition;

    vNormalView = normalize(normalMatrix * localNormal);
    vViewDir = normalize(-mvPosition.xyz);
    vPhase = aPhase;
    vTint = aTint;

    #include <fog_vertex>
  }
`;

export const mushroomFragment = /* glsl */ `
  #include <fog_pars_fragment>

  uniform float uTime;
  uniform vec3 uBase;
  uniform float uGlowBoost;

  varying vec3 vNormalView;
  varying vec3 vViewDir;
  varying float vPhase;
  varying vec3 vTint;

  void main() {
    float fresnel = pow(1.0 - abs(dot(normalize(vNormalView), normalize(vViewDir))), 2.0);
    float pulse = 0.55 + 0.45 * sin(uTime * 1.4 + vPhase);

    vec3 color = uBase;
    color += vTint * (fresnel * 1.7 + 0.3) * pulse * uGlowBoost;

    gl_FragColor = vec4(color, 1.0);

    #include <fog_fragment>
  }
`;
