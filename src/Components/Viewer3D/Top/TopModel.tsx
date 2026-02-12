import { useGLTF, useTexture } from "@react-three/drei";
import type { TopColor, TopShapeInfo } from "../../../Types/types";
import * as THREE from "three";
import { useEffect, useState } from "react";
import { useMainContext } from "../../../hooks/useMainContext";
import { observer } from "mobx-react";

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

  const [materialsCreated, setMaterialsCreated] = useState(false);

  // Create fresh MeshStandardMaterial instances for all meshes in the
  // topModel and topMDFModel when the models themselves change. This
  // runs only when the model object references change ("only once" per
  // model load) so subsequent texture updates will reuse these materials.
  useEffect(() => {
    setMaterialsCreated(false);
    if (topModel?.scene) {
      topModel.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial();
          child.material.needsUpdate = true;
          child.castShadow = true;
          // child.receiveShadow = true;
        }
      });
    }

    if (topMDFModel?.scene) {
      topMDFModel.scene.traverse((child) => {
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
  }, [topModel, topMDFModel]);

  const topTextures = useTexture({
    map: textureUrl.colorUrl,
    normalMap: textureUrl.normalUrl,
    roughnessMap: textureUrl.roughnessUrl,
    metalnessMap: textureUrl.metalnessUrl,
    topMDFTexture: textureUrl.mdfColorUrl,
  });
  topTextures.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
  topTextures.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
  topTextures.metalnessMap.colorSpace = THREE.LinearSRGBColorSpace;
  topTextures.map.colorSpace = THREE.SRGBColorSpace;
  topTextures.topMDFTexture.colorSpace = THREE.SRGBColorSpace;
  const scaleX = maxLength > 0 ? selectedLength / maxLength : 1;
  const scaleZ = maxWidth > 0 ? selectedWidth / maxWidth : 1;

  useEffect(() => {
    Object.values(topTextures).forEach((texture) => {
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
  }, [topTextures, scaleX, scaleZ]);

  useEffect(() => {
    if (!materialsCreated) return;
    topModel.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.map = topTextures.map;
        child.material.normalMap = topTextures.normalMap;
        child.material.metalnessMap = topTextures.metalnessMap;
        child.material.roughnessMap = topTextures.roughnessMap;
        child.material.needsUpdate = true;
      }
    });
  }, [topModel, topTextures, materialsCreated]);

  useEffect(() => {
    if (!materialsCreated) return;
    topMDFModel.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.map = topTextures.topMDFTexture;
        child.material.needsUpdate = true;
      }
    });
  }, [topMDFModel, topTextures, materialsCreated]);

  // const animatorRef = useRef(new ScaleAnimator(0.12));

  useEffect(() => {
    const topMeshes: THREE.Mesh[] = [];
    topModel.scene.traverse((c) => {
      if (c instanceof THREE.Mesh) topMeshes.push(c);
    });
    baseMeshManager.setTopModel(topModel.scene);

    const mdfMeshes: THREE.Mesh[] = [];
    topMDFModel.scene.traverse((c) => {
      if (c instanceof THREE.Mesh) mdfMeshes.push(c);
    });
  }, [topModel, topMDFModel]);

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
      <primitive
        object={topModel.scene}
        scale={[selectedLength / maxLength, 1, selectedWidth / maxWidth]}
      />
      <primitive
        object={topMDFModel.scene}
        scale={[selectedLength / maxLength, 1, selectedWidth / maxWidth]}
      />
    </>
  );
});

export default TopModel;
