import { useEffect, useMemo, useRef } from "react";
import Loader from "../Loader/Loader";
import { TopMaterialBinder } from "./TopMaterialBinder";
import { TopTextureLayer } from "./TopTexture";
import { prepareTopScene } from "./pepareTopScene";
import { useGLTF } from "@react-three/drei";
import { useMainContext } from "../../../hooks/useMainContext";
import { observer } from "mobx-react";
import type { TopColor, TopShapeInfo } from "../../../Types/types";
import * as THREE from "three";

export const TopModel = observer(
  ({
    modelUrl,
    textureUrl,
  }: {
    modelUrl: TopShapeInfo;
    textureUrl: TopColor;
  }) => {
    const { designManager, design3DManager } = useMainContext();
    const { dimensionManager } = designManager;
    const { baseMeshManager } = design3DManager;

    const topGLTF = useGLTF(modelUrl.modelUrl);
    const mdfGLTF = useGLTF(modelUrl.modelMDFUrl);

    const topTexturesRef = useRef<{
      map?: THREE.Texture;
      normalMap?: THREE.Texture;
      roughnessMap?: THREE.Texture;
      metalnessMap?: THREE.Texture;
    }>({});

    const preparedTop = useMemo(
      () => prepareTopScene(topGLTF.scene),
      [modelUrl.modelUrl],
    );

    const preparedMDF = useMemo(() => {
      return prepareTopScene(mdfGLTF.scene);
    }, [modelUrl.modelMDFUrl]);

    const scaleX =
      dimensionManager.maxLength > 0
        ? dimensionManager.selectedLength / dimensionManager.maxLength
        : 1;

    const scaleZ =
      dimensionManager.maxWidth > 0
        ? dimensionManager.selectedWidth / dimensionManager.maxWidth
        : 1;
    useEffect(() => {
      const { map, normalMap, roughnessMap, metalnessMap } =
        topTexturesRef.current;

      const repeatX = Math.max(scaleX, 0.0001);
      const repeatZ = Math.max(scaleZ, 0.0001);

      [map, normalMap, roughnessMap, metalnessMap].forEach((tex) => {
        if (!tex) return;

        if (modelUrl.modelUrl.includes("round")) {
          tex.center.set(-0.3, 0.3);
        } else {
          tex.center.set(0, 0.3);
        }
        tex.repeat.set(repeatX, repeatZ);
        tex.offset.set((1 - repeatX) * 0.5, (1 - repeatZ) * 0.5);
      });
    }, [scaleX, scaleZ]);

    // useEffect(() => {
    //   preparedTop.meshes.forEach((mesh) => {
    //     const mat = mesh.material as THREE.MeshStandardMaterial;
    //     if (!mat.map) return;

    //     const repeatX = Math.max(scaleX, 0.0001);
    //     const repeatZ = Math.max(scaleZ, 0.0001);
    //     mat.map.center.set(0, 0.3);
    //     mat.map.repeat.set(repeatX, repeatZ);
    //     // Keep the texture anchored around model center while repeat changes.
    //     mat.map.offset.set((1 - repeatX) * 0.5, (1 - repeatZ) * 0.5);

    //     mat.map.needsUpdate = true;
    //   });
    // }, [scaleX, scaleZ, preparedTop.meshes]);

    useEffect(() => {
      baseMeshManager.setTopModel(preparedTop.root);
    }, [baseMeshManager, preparedTop]);

    return (
      <TopTextureLayer textureUrl={textureUrl}>
        {(textures) => (
          <>
            <TopMaterialBinder
              preparedTop={preparedTop}
              preparedMDF={preparedMDF}
              textures={textures}
              onTopTexturesReady={(tex) => {
                topTexturesRef.current = tex;
              }}
            />

            <group scale={[scaleX, 1, scaleZ]}>
              <primitive object={preparedTop.root} />
              <primitive object={preparedMDF.root} />
            </group>

            {textures.loading && <Loader />}
          </>
        )}
      </TopTextureLayer>
    );
  },
);
