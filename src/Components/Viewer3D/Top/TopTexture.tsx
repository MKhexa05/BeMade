import * as THREE from "three";
import { useLazyTexture } from "../hooks/useLazyTexture";
import type { TopColor } from "../../../Types/types";
import type { ReactNode } from "react";

type Props = {
  textureUrl: TopColor;
  children: (textures: {
    map?: THREE.Texture;
    normalMap?: THREE.Texture;
    roughnessMap?: THREE.Texture;
    metalnessMap?: THREE.Texture;
    mdfMap?: THREE.Texture;
    loading: boolean;
  }) => ReactNode;
};

export function TopTextureLayer({ textureUrl, children }: Props) {
  const map = useLazyTexture(textureUrl.colorUrl);
  const normalMap = useLazyTexture(textureUrl.normalUrl);
  const roughnessMap = useLazyTexture(textureUrl.roughnessUrl);
  const metalnessMap = useLazyTexture(textureUrl.metalnessUrl);
  const mdfMap = useLazyTexture(textureUrl.mdfColorUrl);

  const loading =
    map.loading ||
    normalMap.loading ||
    roughnessMap.loading ||
    metalnessMap.loading ||
    mdfMap.loading;

  // colorspace setup ONCE per texture
  [map.texture, mdfMap.texture].forEach((t) => {
    if (t) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.flipY = false;
      t.center.set(0, 0.3);
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    }
  });

  [normalMap.texture, roughnessMap.texture, metalnessMap.texture].forEach(
    (t) => {
      if (t) t.colorSpace = THREE.LinearSRGBColorSpace;
    },
  );

  return children({
    map: map.texture ?? undefined,
    normalMap: normalMap.texture ?? undefined,
    roughnessMap: roughnessMap.texture ?? undefined,
    metalnessMap: metalnessMap.texture ?? undefined,
    mdfMap: mdfMap.texture ?? undefined,
    loading,
  });
}
