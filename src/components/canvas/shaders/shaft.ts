/** Fake god rays: tall additive billboards with vertical + horizontal falloff. */
export const shaftVertex = /* glsl */ `
  uniform float uTime;

  attribute float aSeed;

  varying vec2 vUv;
  varying float vSeed;

  void main() {
    vec3 pos = position;

    // Slow sway, stronger toward the bottom of the shaft.
    pos.x += sin(uTime * 0.15 + aSeed * 20.0) * (1.0 - uv.y) * 1.2;

    vec4 localPos = vec4(pos, 1.0);
    #ifdef USE_INSTANCING
      localPos = instanceMatrix * localPos;
    #endif

    vUv = uv;
    vSeed = aSeed;

    gl_Position = projectionMatrix * modelViewMatrix * localPos;
  }
`;

export const shaftFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;

  varying vec2 vUv;
  varying float vSeed;

  void main() {
    // Bright at the top, dissolving downward; soft horizontal edges.
    float vertical = smoothstep(0.0, 0.55, vUv.y);
    float horizontal = sin(vUv.x * 3.14159);
    horizontal = pow(horizontal, 2.5);

    float shimmer = 0.75 + 0.25 * sin(uTime * 0.4 + vSeed * 40.0 + vUv.y * 6.0);

    float alpha = vertical * horizontal * shimmer * uOpacity;
    gl_FragColor = vec4(uColor * alpha, alpha);
  }
`;

/** Horizon glow disc for the final "above the treeline" beat. */
export const horizonVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const horizonFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    float d = distance(vUv, vec2(0.5));
    float glow = smoothstep(0.5, 0.0, d);
    glow = pow(glow, 2.2);
    gl_FragColor = vec4(uColor * glow * uOpacity, glow * uOpacity);
  }
`;
