// TopMaterialBinder.tsx
import { useEffect } from "react";
import * as THREE from "three";
import type { PreparedTop } from "./pepareTopScene";

type Props = {
  preparedTop: PreparedTop;
  preparedMDF: PreparedTop;
  textures: {
    map?: THREE.Texture;
    normalMap?: THREE.Texture;
    roughnessMap?: THREE.Texture;
    metalnessMap?: THREE.Texture;
    mdfMap?: THREE.Texture;
  };
  onTopTexturesReady?: (textures: {
    map?: THREE.Texture;
    normalMap?: THREE.Texture;
    roughnessMap?: THREE.Texture;
    metalnessMap?: THREE.Texture;
  }) => void;
};

export function TopMaterialBinder({
  preparedTop,
  preparedMDF,
  textures,
  onTopTexturesReady,
}: Props) {
  useEffect(() => {
    if (!textures.map) return;

    preparedTop.meshes.forEach((mesh) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.map = textures.map!;
      mat.normalMap = textures.normalMap ?? null;
      mat.roughnessMap = textures.roughnessMap ?? null;
      mat.metalnessMap = textures.metalnessMap ?? null;
      mat.needsUpdate = true;
    });

    // 🔑 notify ONCE when texture exists
    onTopTexturesReady?.({
      map: textures.map,
      normalMap: textures.normalMap,
      roughnessMap: textures.roughnessMap,
      metalnessMap: textures.metalnessMap,
    });
  }, [
    textures.map,
    textures.normalMap,
    textures.roughnessMap,
    textures.metalnessMap,
    preparedTop,
    onTopTexturesReady,
  ]);

  useEffect(() => {
    if (!textures.mdfMap) return;

    preparedMDF.meshes.forEach((mesh) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.map = textures.mdfMap!;
      mat.needsUpdate = true;
    });
  }, [textures.mdfMap, preparedMDF]);

  return null;
}
