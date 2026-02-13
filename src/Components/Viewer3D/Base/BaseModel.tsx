import { useGLTF } from "@react-three/drei";
import type { BaseColor } from "../../../Types/types";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { observer } from "mobx-react";
import { useMainContext } from "../../../hooks/useMainContext";
import Loader from "../Loader/Loader";
import { useLazyTexture } from "../hooks/useLazyTexture";

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

  const gltf = useGLTF(modelUrl);
  const smallbaseModel = useGLTF(
    "assets/images/base-shape/cradle/smallModel.glb",
  );
  const smallModelActive =
    selectedBaseShape === "cradle" && selectedLength <= 2400;

  const initialLegPositions = useRef<Record<string, number> | null>(null);
  const legMeshesRef = useRef<THREE.Mesh[] | null>(null);
  const preparedScenesRef = useRef(new WeakSet<THREE.Object3D>());

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

  // No direct mutation of scene visibility here - rendering controls which model is visible.

  const { texture: mapTexture, loading: mapLoading } = useLazyTexture(
    textureUrl.colorUrl,
  );
  const { texture: normalMapTexture, loading: normalMapLoading } =
    useLazyTexture(textureUrl.normalUrl);
  const { texture: roughnessMapTexture, loading: roughnessMapLoading } =
    useLazyTexture(textureUrl.roughnessUrl);
  const { texture: metalnessMapTexture, loading: metalnessMapLoading } =
    useLazyTexture(textureUrl.metalnessUrl);

  const baseTextures = {
    map: mapTexture,
    normalMap: normalMapTexture,
    roughnessMap: roughnessMapTexture,
    metalnessMap: metalnessMapTexture,
  };

  const isTextureLoading =
    mapLoading ||
    normalMapLoading ||
    roughnessMapLoading ||
    metalnessMapLoading;

  useEffect(() => {
    if (baseTextures.normalMap) {
      baseTextures.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
    }
    if (baseTextures.roughnessMap) {
      baseTextures.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
    }
    if (baseTextures.metalnessMap) {
      baseTextures.metalnessMap.colorSpace = THREE.LinearSRGBColorSpace;
    }
    if (baseTextures.map) {
      baseTextures.map.colorSpace = THREE.SRGBColorSpace;
    }
  }, [
    baseTextures.map,
    baseTextures.normalMap,
    baseTextures.roughnessMap,
    baseTextures.metalnessMap,
  ]);

  useEffect(() => {
    const prepareSceneMaterials = (
      scene: THREE.Object3D | null | undefined,
      castShadow: boolean,
    ) => {
      if (!scene || preparedScenesRef.current.has(scene)) return;
      scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        if (castShadow) child.castShadow = true;
        if (Array.isArray(child.material)) {
          child.material = child.material.map(
            () => new THREE.MeshStandardMaterial(),
          );
          child.material.forEach((mat: THREE.Material) => {
            mat.needsUpdate = true;
          });
        } else {
          child.material = new THREE.MeshStandardMaterial();
          child.material.needsUpdate = true;
        }
      });
      preparedScenesRef.current.add(scene);
    };

    prepareSceneMaterials(gltf?.scene, true);
    prepareSceneMaterials(smallbaseModel?.scene, false);
  }, [gltf?.scene, smallbaseModel?.scene]);

  useEffect(() => {
    const applyMaterialMaps = (scene: THREE.Object3D | null | undefined) => {
      if (!scene) return;
      scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const mats = Array.isArray(child.material)
          ? child.material
          : [child.material];
        mats.forEach((mat) => {
          if (!(mat instanceof THREE.MeshStandardMaterial)) return;
          mat.map = baseTextures.map ?? null;
          mat.normalMap = baseTextures.normalMap ?? null;
          mat.roughnessMap = baseTextures.roughnessMap ?? null;
          mat.metalnessMap = baseTextures.metalnessMap ?? null;
          mat.metalness = 0.75;
          mat.side =
            selectedBaseShape == "linea" ? THREE.DoubleSide : THREE.FrontSide;
          mat.color = textureUrl.name.includes("gold")
            ? new THREE.Color("#f5e8d0")
            : new THREE.Color(0xffffff);
          mat.needsUpdate = true;
        });
      });
    };
    if (
      mapLoading ||
      normalMapLoading ||
      roughnessMapLoading ||
      metalnessMapLoading
    )
      return;

    applyMaterialMaps(gltf?.scene);
    applyMaterialMaps(smallbaseModel?.scene);
  }, [
    gltf?.scene,
    smallbaseModel?.scene,
    baseTextures.map,
    baseTextures.normalMap,
    baseTextures.roughnessMap,
    baseTextures.metalnessMap,
    selectedBaseShape,
    mapLoading,
    metalnessMapLoading,
    roughnessMapLoading,
    normalMapLoading,
  ]);

  return (
    <>
      <primitive object={gltf.scene} visible={!smallModelActive} />
      {smallbaseModel?.scene && (
        <primitive object={smallbaseModel.scene} visible={smallModelActive} />
      )}
      {isTextureLoading && <Loader />}
    </>
  );
});

export default BaseModel;
