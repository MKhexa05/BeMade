import * as THREE from "three";
import type { PreparedTop } from "./pepareTopScene";

export function applyTopTextures(
  prepared: PreparedTop,
  textures: {
    map?: THREE.Texture;
    normalMap?: THREE.Texture;
    roughnessMap?: THREE.Texture;
    metalnessMap?: THREE.Texture;
  },
) {
  prepared.meshes.forEach((mesh) => {
    const mat = mesh.material as THREE.MeshStandardMaterial;
    mat.map = textures.map ?? null;
    mat.normalMap = textures.normalMap ?? null;
    mat.roughnessMap = textures.roughnessMap ?? null;
    mat.metalnessMap = textures.metalnessMap ?? null;
    mat.needsUpdate = true;
  });
}

export function applyMDFTexture(prepared: PreparedTop, map?: THREE.Texture) {
  prepared.meshes.forEach((mesh) => {
    const mat = mesh.material as THREE.MeshStandardMaterial;
    mat.map = map ?? null;
    mat.needsUpdate = true;
  });
}
