export const grassVertex = /* glsl */ `
  #include <fog_pars_vertex>

  uniform float uTime;

  attribute float aPhase;
  attribute float aLean;

  varying float vHeight;
  varying float vPhase;

  void main() {
    vec3 pos = position;

    // Taper the blade toward the tip.
    float h = uv.y;
    pos.x *= 1.0 - h * 0.85;

    // Wind: tip bends, root stays planted.
    float sway = sin(uTime * 1.3 + aPhase) * 0.5 + sin(uTime * 2.7 + aPhase * 1.7) * 0.18;
    pos.x += h * h * (sway * 0.22 + aLean * 0.25);
    pos.z += h * h * sway * 0.1;

    vec4 localPos = vec4(pos, 1.0);
    #ifdef USE_INSTANCING
      localPos = instanceMatrix * localPos;
    #endif

    vec4 mvPosition = modelViewMatrix * localPos;
    gl_Position = projectionMatrix * mvPosition;

    vHeight = h;
    vPhase = aPhase;

    #include <fog_vertex>
  }
`;

export const grassFragment = /* glsl */ `
  #include <fog_pars_fragment>

  uniform float uTime;
  uniform vec3 uRoot;
  uniform vec3 uTip;
  uniform vec3 uGlow;

  varying float vHeight;
  varying float vPhase;

  void main() {
    vec3 color = mix(uRoot, uTip, vHeight * vHeight);

    // Occasional blades carry a bioluminescent tip.
    float lit = step(0.92, fract(vPhase * 7.31));
    float pulse = 0.5 + 0.5 * sin(uTime * 1.8 + vPhase * 3.0);
    color += uGlow * lit * vHeight * vHeight * pulse * 1.6;

    gl_FragColor = vec4(color, 1.0);

    #include <fog_fragment>
  }
`;
