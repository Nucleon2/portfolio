export const firefliesVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2 uPointer;          // cursor in NDC (-1..1)
  uniform float uPointerStrength; // 0 when idle, ramps on movement
  uniform float uVelocity;        // scroll velocity feedback (0..~1)

  attribute vec3 aSeed;     // per-point random in [0,1)^3
  attribute float aScale;

  varying float vFlicker;

  void main() {
    vec3 pos = position;

    // Organic wandering: three desynced sine drifts per axis.
    float t = uTime * (0.25 + aSeed.x * 0.35);
    pos.x += sin(t * 1.3 + aSeed.x * 39.0) * 0.9;
    pos.y += sin(t * 1.7 + aSeed.y * 27.0) * 0.55;
    pos.z += cos(t * 1.1 + aSeed.z * 51.0) * 0.9;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Touch the world: push nearby motes away from the cursor in screen space.
    if (uPointerStrength > 0.001) {
      vec2 screen = gl_Position.xy / gl_Position.w;
      vec2 toP = screen - uPointer;
      float fall = exp(-dot(toP, toP) * 6.0);
      gl_Position.xy += normalize(toP + 1e-4) * fall * uPointerStrength * 0.12 * gl_Position.w;
    }

    gl_PointSize = uSize * aScale * uPixelRatio;
    gl_PointSize *= (1.0 / -mvPosition.z);
    gl_PointSize *= (1.0 + uVelocity * 0.6); // streak/brighten on fast scroll

    // Hash-based flicker, each firefly on its own rhythm.
    vFlicker = 0.45 + 0.55 * sin(uTime * (1.5 + aSeed.y * 3.0) + aSeed.x * 100.0);
  }
`;

export const firefliesFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;

  varying float vFlicker;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float core = smoothstep(0.5, 0.0, d);
    float strength = pow(core, 3.0) * 1.5 + pow(core, 12.0) * 2.0;
    vec3 color = uColor * strength * vFlicker * uIntensity;
    gl_FragColor = vec4(color, strength * vFlicker);
  }
`;
