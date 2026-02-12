import { useGLTF, useTexture } from "@react-three/drei";
import type { BaseColor } from "../../../Types/types";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { useMainContext } from "../../../hooks/useMainContext";

type ModelProps = {
  modelUrl: string;
  textureUrl: BaseColor;
};

const BaseModel = observer(({ modelUrl, textureUrl }: ModelProps) => {
  const { designManager } = useMainContext();
  const { dimensionManager, tableManager } = designManager;
  const { baseShapeManager } = tableManager;
  const selectedLength = dimensionManager.selectedLength;
  const selectedBaseShape = baseShapeManager.selectedBaseShapeName;
  const maxLength = dimensionManager.maxLength;
  const [materialsCreated, setMaterialsCreated] = useState(false);

  const gltf = useGLTF(modelUrl);
  const smallbaseModel = useGLTF(
    "assets/images/base-shape/cradle/smallModel.glb",
  );
  const smallModelActive =
    selectedBaseShape === "cradle" && selectedLength <= 2400;

  const initialLegPositions = useRef<Record<string, number> | null>(null);
  const legMeshesRef = useRef<THREE.Mesh[] | null>(null);

  // Effect A: identify leg meshes and cache their original X positions when the active GLTF loads
  useEffect(() => {
    initialLegPositions.current = null;
    const sceneToInspect = smallModelActive
      ? smallbaseModel?.scene
      : gltf?.scene;
    if (!sceneToInspect) return;

    const meshes: THREE.Mesh[] = [];
    sceneToInspect.traverse((child) => {
      if (child instanceof THREE.Mesh) meshes.push(child as THREE.Mesh);
    });

    let legMeshes: THREE.Mesh[] = [];
    if (meshes.length === 2) legMeshes = meshes;
    if (legMeshes.length !== 2) return;

    initialLegPositions.current = {};
    legMeshesRef.current = legMeshes;
    legMeshes.forEach((m) => {
      initialLegPositions.current![m.uuid] = m.position.x;
    });
  }, [gltf, smallbaseModel, smallModelActive]);

  // Effect B: apply dimension-based position updates (runs when dimensions change)
  useEffect(() => {
    if (selectedBaseShape == "moon") return;
    if (!legMeshesRef.current || !initialLegPositions.current) return;
    const factor = maxLength ? selectedLength / maxLength : 1;
    legMeshesRef.current.forEach((m) => {
      const orig = initialLegPositions.current?.[m.uuid];
      if (orig !== undefined) m.position.x = orig * factor;
    });
  }, [
    selectedLength,
    maxLength,
    initialLegPositions,
    legMeshesRef,
    selectedBaseShape,
  ]);

  // Effect C: reset leg positions when base shape changes
  useEffect(() => {
    if (selectedBaseShape == "moon") return;
    if (!legMeshesRef.current || !initialLegPositions.current) return;
    legMeshesRef.current.forEach((m) => {
      const orig = initialLegPositions.current?.[m.uuid];
      if (orig !== undefined) m.position.x = orig;
    });
  }, [selectedBaseShape, initialLegPositions, legMeshesRef]);

  // chnage leg positions only once for moon when the selected lenght goes under/above 2900
  useEffect(() => {
    if (selectedBaseShape !== "moon") return;
    if (!legMeshesRef.current || !initialLegPositions.current) return;
    const factor = selectedLength > 2900 ? 1 : 0.8;
    legMeshesRef.current.forEach((m) => {
      const orig = initialLegPositions.current?.[m.uuid];
      if (orig !== undefined) m.position.x = orig * factor;
    });
  }, [selectedLength, selectedBaseShape]);

  // No direct mutation of scene visibility here — rendering controls which model is visible.

  const baseTextures = useTexture({
    map: textureUrl.colorUrl,
    normalMap: textureUrl.normalUrl,
    roughnessMap: textureUrl.roughnessUrl,
    metalnessMap: textureUrl.metalnessUrl,
  });
  // Set proper colorSpace for loaded textures and re-apply them whenever
  // either the GLTF or the textures change. Handle meshes with array
  // materials and mark materials as needing update.
  baseTextures.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
  baseTextures.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
  baseTextures.metalnessMap.colorSpace = THREE.LinearSRGBColorSpace;
  baseTextures.map.colorSpace = THREE.SRGBColorSpace;

  useEffect(() => {
    setMaterialsCreated(false);
    if (gltf?.scene) {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          // child.geometry
          child.material = new THREE.MeshStandardMaterial();
          child.material.needsUpdate = true;
        }
      });
    }
    if (smallbaseModel?.scene) {
      smallbaseModel.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial();
          child.material.needsUpdate = true;
        }
      });
    }

    // Signal that materials have been created for the current models so
    // texture-application effects can run afterwards.
    setMaterialsCreated(true);
    // Intentionally only depend on the model references so this effect
    // runs once per model load.
  }, [gltf, smallbaseModel]);

  useEffect(() => {
    const sceneToInspect = smallModelActive
      ? smallbaseModel?.scene
      : gltf?.scene;
    if (!sceneToInspect) return;
    if (!materialsCreated) return;
    sceneToInspect.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const mats = Array.isArray(child.material)
        ? child.material
        : [child.material];
      mats.forEach((mat) => {
        if (!mat) return;
        if (baseTextures.map) mat.map = baseTextures.map;
        if (baseTextures.normalMap) mat.normalMap = baseTextures.normalMap;
        if (baseTextures.roughnessMap)
          mat.roughnessMap = baseTextures.roughnessMap;
        if (baseTextures.metalnessMap)
          mat.metalnessMap = baseTextures.metalnessMap;
        mat.metalness = 0.75;
        mat.needsUpdate = true;
        mat.side =
          selectedBaseShape == "linea" ? THREE.DoubleSide : THREE.FrontSide;
        mat.color = new THREE.Color("gold");
      });
    });
  }, [
    gltf,
    materialsCreated,
    smallbaseModel,
    smallModelActive,
    baseTextures.map,
    baseTextures.normalMap,
    baseTextures.roughnessMap,
    baseTextures.metalnessMap,
    selectedBaseShape,
  ]);

  return (
    <>
      <primitive object={gltf.scene} visible={!smallModelActive} />
      {smallbaseModel?.scene && (
        <primitive object={smallbaseModel.scene} visible={smallModelActive} />
      )}
    </>
  );
});

export default BaseModel;
