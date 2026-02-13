import { useGLTF } from "@react-three/drei";
import type { TopColor, TopShapeInfo } from "../../../Types/types";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useMainContext } from "../../../hooks/useMainContext";
import { observer } from "mobx-react";
import Loader from "../Loader/Loader";
import { useLazyTexture } from "../hooks/useLazyTexture";

type ModelProps = {
  modelUrl: TopShapeInfo;
  textureUrl: TopColor;
};

const TopModel = observer(({ modelUrl, textureUrl }: ModelProps) => {
  const { designManager, design3DManager } = useMainContext();
  const { dimensionManager } = designManager;
  const { baseMeshManager } = design3DManager;

  const selectedLength = dimensionManager.selectedLength;
  const maxLength = dimensionManager.maxLength;
  const selectedWidth = dimensionManager.selectedWidth;
  const maxWidth = dimensionManager.maxWidth;

  const topModel = useGLTF(modelUrl.modelUrl);
  const topMDFModel = useGLTF(modelUrl.modelMDFUrl);
  const preparedScenesRef = useRef(new WeakSet<THREE.Object3D>());

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

    prepareSceneMaterials(topModel?.scene, true);
    prepareSceneMaterials(topMDFModel?.scene, false);
  }, [topModel?.scene, topMDFModel?.scene]);

  const { texture: mapTexture, loading: mapLoading } = useLazyTexture(
    textureUrl.colorUrl,
  );
  const { texture: normalMapTexture, loading: normalMapLoading } =
    useLazyTexture(textureUrl.normalUrl);
  const { texture: roughnessMapTexture, loading: roughnessMapLoading } =
    useLazyTexture(textureUrl.roughnessUrl);
  const { texture: metalnessMapTexture, loading: metalnessMapLoading } =
    useLazyTexture(textureUrl.metalnessUrl);
  const { texture: topMDFTexture, loading: topMDFLoading } = useLazyTexture(
    textureUrl.mdfColorUrl,
  );

  const topTextures = {
    map: mapTexture,
    normalMap: normalMapTexture,
    roughnessMap: roughnessMapTexture,
    metalnessMap: metalnessMapTexture,
    topMDFTexture,
  };

  const isTextureLoading =
    mapLoading ||
    normalMapLoading ||
    roughnessMapLoading ||
    metalnessMapLoading ||
    topMDFLoading;

  useEffect(() => {
    if (topTextures.normalMap) {
      topTextures.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
    }
    if (topTextures.roughnessMap) {
      topTextures.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
    }
    if (topTextures.metalnessMap) {
      topTextures.metalnessMap.colorSpace = THREE.LinearSRGBColorSpace;
    }
    if (topTextures.map) {
      topTextures.map.colorSpace = THREE.SRGBColorSpace;
    }
    if (topTextures.topMDFTexture) {
      topTextures.topMDFTexture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [
    topTextures.map,
    topTextures.normalMap,
    topTextures.roughnessMap,
    topTextures.metalnessMap,
    topTextures.topMDFTexture,
  ]);

  const scaleX = maxLength > 0 ? selectedLength / maxLength : 1;
  const scaleZ = maxWidth > 0 ? selectedWidth / maxWidth : 1;

  useEffect(() => {
    [
      topTextures.map,
      topTextures.normalMap,
      topTextures.roughnessMap,
      topTextures.metalnessMap,
      topTextures.topMDFTexture,
    ].forEach((texture) => {
      if (!texture) return;
      texture.flipY = false;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      const repeatX = Math.max(scaleX, 0.0001);
      const repeatZ = Math.max(scaleZ, 0.0001);
      texture.center.set(0.5, 0.5);
      texture.repeat.set(repeatX, repeatZ);
      // Keep the texture anchored around model center while repeat changes.
      texture.offset.set((1 - repeatX) * 0.5, (1 - repeatZ) * 0.5);
      texture.needsUpdate = true;
    });
  }, [
    topTextures.map,
    topTextures.normalMap,
    topTextures.roughnessMap,
    topTextures.metalnessMap,
    topTextures.topMDFTexture,
    scaleX,
    scaleZ,
  ]);

  useEffect(() => {
    topModel.scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const mats = Array.isArray(child.material)
        ? child.material
        : [child.material];
      mats.forEach((mat) => {
        if (!(mat instanceof THREE.MeshStandardMaterial)) return;
        mat.map = topTextures.map ?? null;
        mat.normalMap = topTextures.normalMap ?? null;
        mat.metalnessMap = topTextures.metalnessMap ?? null;
        mat.roughnessMap = topTextures.roughnessMap ?? null;
        mat.needsUpdate = true;
      });
    });
  }, [
    topModel.scene,
    topTextures.map,
    topTextures.normalMap,
    topTextures.metalnessMap,
    topTextures.roughnessMap,
  ]);

  useEffect(() => {
    topMDFModel.scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const mats = Array.isArray(child.material)
        ? child.material
        : [child.material];
      mats.forEach((mat) => {
        if (!(mat instanceof THREE.MeshStandardMaterial)) return;
        mat.map = topTextures.topMDFTexture ?? null;
        mat.needsUpdate = true;
      });
    });
  }, [topMDFModel.scene, topTextures.topMDFTexture]);

  // const animatorRef = useRef(new ScaleAnimator(0.12));

  useEffect(() => {
    baseMeshManager.setTopModel(topModel.scene);
  }, [baseMeshManager, topModel.scene]);

  // useEffect(() => {
  //   const sx = selectedLength / maxLength;
  //   const sz = selectedWidth / maxWidth;
  //   animatorRef.current.setTarget(new THREE.Vector3(sx, 1, sz));
  //   animatorRef.current.setOnFinished(() => {
  //     try {
  //       topModel.scene.updateMatrixWorld(true);
  //       topMDFModel.scene.updateMatrixWorld(true);
  //     } catch {
  //       console.log("Error updating world matrices for top models");
  //     }
  //     baseMeshManager.setTopModel(topModel.scene);
  //   });
  // }, [
  //   selectedLength,
  //   selectedWidth,
  //   maxLength,
  //   maxWidth,
  //   topModel,
  //   topMDFModel,
  //   baseMeshManager,
  // ]);

  // useFrame(() => {
  //   animatorRef.current.update();
  // });

  return (
    <>
      <primitive object={topModel.scene} scale={[scaleX, 1, scaleZ]} />
      <primitive object={topMDFModel.scene} scale={[scaleX, 1, scaleZ]} />
      {isTextureLoading && <Loader />}
    </>
  );
});

export default TopModel;
