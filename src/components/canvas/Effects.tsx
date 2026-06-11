import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { useAppStore } from "@/lib/store";

export function Effects() {
  const quality = useAppStore((s) => s.quality);

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        intensity={1.15}
        luminanceThreshold={0.3}
        luminanceSmoothing={0.18}
        radius={0.82}
      />
      {quality === "high" ? <Noise opacity={0.05} /> : <></>}
      {quality !== "low" ? <Vignette eskil={false} offset={0.22} darkness={0.85} /> : <></>}
    </EffectComposer>
  );
}
