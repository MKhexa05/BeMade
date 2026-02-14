// Base/prepareBaseModel.ts
import * as THREE from "three";

export type PreparedBaseModel = {
  scene: THREE.Group;
  legMeshes: THREE.Mesh[];
  legOriginalX: number[];
  materials: THREE.MeshStandardMaterial[];
};

export function prepareBaseModel(sourceScene: THREE.Group): PreparedBaseModel {
  const scene = sourceScene.clone(true) as THREE.Group;

  const meshes: THREE.Mesh[] = [];
  const materials: THREE.MeshStandardMaterial[] = [];

  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    // child.castShadow = true;
    // child.receiveShadow = true;

    const mat = new THREE.MeshStandardMaterial();
    child.material = mat;
    materials.push(mat);

    meshes.push(child);
  });

  let legMeshes: THREE.Mesh[] = [];
  let legOriginalX: number[] = [];

  // 🔑 model-agnostic leg detection
  if (meshes.length === 2) {
    legMeshes = meshes;
    legOriginalX = meshes.map((m) => m.position.x);
  }

  return {
    scene,
    legMeshes,
    legOriginalX,
    materials,
  };
}
