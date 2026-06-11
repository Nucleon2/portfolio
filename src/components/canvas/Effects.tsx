import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { useAppStore } from "@/lib/store";

export function Effects() {
  const quality = useAppStore((s) => s.quality);

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        intensity={0.82}
        luminanceThreshold={0.42}
        luminanceSmoothing={0.2}
        radius={0.8}
      />
      {quality === "high" ? <Noise opacity={0.05} /> : <></>}
      {quality !== "low" ? <Vignette eskil={false} offset={0.22} darkness={0.85} /> : <></>}
    </EffectComposer>
  );
}
