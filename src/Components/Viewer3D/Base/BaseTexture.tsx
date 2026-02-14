import { observer } from "mobx-react";
import { useLazyTexture } from "../hooks/useLazyTexture";
import * as THREE from "three";
import type { BaseColor } from "../../../Types/types";

type BaseTextureLayerProps = {
  textureUrl: BaseColor;
  children: (textures: {
    map: THREE.Texture | null;
    normalMap: THREE.Texture | null;
    roughnessMap: THREE.Texture | null;
    metalnessMap: THREE.Texture | null;
    loading: boolean;
  }) => React.ReactNode;
};

export const BaseTextureLayer = observer(
  ({ textureUrl, children }: BaseTextureLayerProps) => {
    const map = useLazyTexture(textureUrl.colorUrl);
    const normal = useLazyTexture(textureUrl.normalUrl);
    const rough = useLazyTexture(textureUrl.roughnessUrl);
    const metal = useLazyTexture(textureUrl.metalnessUrl);

    const loading =
      map.loading || normal.loading || rough.loading || metal.loading;

    return (
      <>
        {children({
          map: map.texture,
          normalMap: normal.texture,
          roughnessMap: rough.texture,
          metalnessMap: metal.texture,
          loading,
        })}
      </>
    );
  },
);
