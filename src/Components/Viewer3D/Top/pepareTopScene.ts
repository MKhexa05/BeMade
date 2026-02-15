import * as THREE from "three";

export type PreparedTop = {
  root: THREE.Group;
  meshes: THREE.Mesh[];
};

export function prepareTopScene(scene: THREE.Group): PreparedTop {
  const root = scene.clone(true);
  const meshes: THREE.Mesh[] = [];

  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    child.castShadow = true;
    child.receiveShadow = true;

    // replace material ONCE
    child.material = new THREE.MeshStandardMaterial();
    meshes.push(child);
  });

  return { root, meshes };
}
