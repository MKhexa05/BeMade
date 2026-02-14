// Base/BaseGeometryLayer.tsx
import { observer } from "mobx-react";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { prepareBaseModel, type PreparedBaseModel } from "./prepareBaseModel";
import { useMainContext } from "../../../hooks/useMainContext";
import { useGLTF } from "@react-three/drei";

type Props = {
  preparedModel: PreparedBaseModel;
  textures: {
    map: THREE.Texture | null;
    normalMap: THREE.Texture | null;
    roughnessMap: THREE.Texture | null;
    metalnessMap: THREE.Texture | null;
    loading: boolean;
  };
};

export const BaseGeometryLayer = observer(
  ({ preparedModel, textures }: Props) => {
    const { designManager } = useMainContext();
    const { dimensionManager, tableManager } = designManager;
    const { baseShapeManager } = tableManager;

    const selectedLength = dimensionManager.selectedLength;
    const maxLength = dimensionManager.maxLength;
    const selectedBaseShape = baseShapeManager.selectedBaseShapeName;

    const smallGltf = useGLTF(
      "/assets/images/base-shape/cradle/smallModel.glb",
    ); // optional preload

    const preparedSmallModel = useMemo(() => {
      if (!smallGltf.scene) return null;
      return prepareBaseModel(smallGltf.scene);
    }, [smallGltf]);

    const modelToRender =
      selectedBaseShape == "cradle" && selectedLength < 2400
        ? (preparedSmallModel ?? preparedModel)
        : preparedModel;

    /** 🦵 LEG POSITION LOGIC (cheap, isolated) */
    useEffect(() => {
      if (!preparedModel.legMeshes.length) return;

      const factor =
        selectedBaseShape === "moon"
          ? selectedLength > 2900
            ? 1
            : 0.8
          : maxLength
            ? selectedLength / maxLength
            : 1;

      preparedModel.legMeshes.forEach((m, i) => {
        m.position.x = preparedModel.legOriginalX[i] * factor;
      });
    }, [selectedLength, selectedBaseShape, maxLength, preparedModel]);

    /** 🎨 MATERIAL UPDATES (cheap, no traversal) */
    useEffect(() => {
      modelToRender.materials.forEach((mat) => {
        mat.map = textures.map ?? null;
        mat.normalMap = textures.normalMap ?? null;
        mat.roughnessMap = textures.roughnessMap ?? null;
        mat.metalnessMap = textures.metalnessMap ?? null;
        mat.metalness = 0.75;
        mat.needsUpdate = true;
      });
    }, [
      textures.map,
      textures.normalMap,
      textures.roughnessMap,
      textures.metalnessMap,
      modelToRender,
    ]);

    return <primitive object={modelToRender.scene} />;
  },
);
