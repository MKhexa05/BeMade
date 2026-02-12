import { useGLTF, useTexture } from "@react-three/drei";
import type { ChairColorInfo } from "../../../Types/types";
import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { observer } from "mobx-react";
import ChairTempRenderer from "./ChairTempRenderer";
import { useMainContext } from "../../../hooks/useMainContext";

type ModelProps = {
  chairModelUrl: string;
  chairTextureUrl: ChairColorInfo;
  mode?: "table" | "twoChair";
};

const ChairModel = observer(
  ({ chairModelUrl, chairTextureUrl, mode = "table" }: ModelProps) => {
    const { designManager } = useMainContext();
    const { chairManager } = designManager;
    const chairModel = useGLTF(chairModelUrl);

    const numberOfChairs = chairManager.numberOfChairs;

    const chairTextures = useTexture({
      topMap: chairTextureUrl?.topColorUrl,
      topMetalnessMap: chairTextureUrl?.topMetalnessUrl,
      topNormalMap: chairTextureUrl?.topNormalUrl,
      topRoughnessMap: chairTextureUrl?.topRoughnessUrl,
      legMap: chairTextureUrl?.legColorUrl,
      legMetalnessMap: chairTextureUrl?.legMetalnessUrl,
      legNormalMap: chairTextureUrl?.legNormalUrl,
      legRoughnessMap: chairTextureUrl?.legRoughnessUrl,
    });

    // stable key that changes whenever the selected texture URLs change
    const textureKey = useMemo(
      () =>
        [
          chairTextureUrl?.topColorUrl,
          chairTextureUrl?.topNormalUrl,
          chairTextureUrl?.topRoughnessUrl,
          chairTextureUrl?.topMetalnessUrl,
          chairTextureUrl?.legColorUrl,
        ]
          .filter(Boolean)
          .join("|"),
      [chairTextureUrl],
    );

    // configure textures when available
    useEffect(() => {
      Object.values(chairTextures).forEach((texture) => {
        if (!texture) return;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.offset.set(0, 0);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.flipY = false;
        texture.needsUpdate = true;
      });
    }, [chairTextures, textureKey]);

    // Create a memoized clone of the source scene and apply textures/materials
    // This ensures we have a scene pre-configured with the current textures so
    // downstream cloning (in ChairTempRenderer) produces instances with the
    // correct materials and avoids race conditions with effects.
    const sceneWithTextures = useMemo(() => {
      if (!chairModel?.scene) return null;

      const sceneClone = chairModel.scene.clone(true) as THREE.Group;

      sceneClone.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;

        // clone material(s) so we don't mutate shared instances
        const oldMat = child.material as THREE.Material | THREE.Material[];
        if (Array.isArray(oldMat)) {
          child.material = oldMat.map((m) => (m ? m.clone() : m)) as any;
        } else if (oldMat) {
          child.material = oldMat.clone();
        }

        // apply appropriate textures based on mesh naming
        if (child.name === "Top") {
          const mat = child.material as any;
          mat.map = chairTextures.topMap ?? null;
          mat.normalMap = chairTextures.topNormalMap ?? null;
          mat.roughnessMap = chairTextures.topRoughnessMap ?? null;
          mat.metalnessMap = chairTextures.topMetalnessMap ?? null;
          mat.needsUpdate = true;
          child.castShadow = true;
          child.receiveShadow = true;
        } else if (child.name === "Leg") {
          const mat = child.material as any;
          mat.map = chairTextures.legMap ?? null;
          mat.normalMap = chairTextures.legNormalMap ?? null;
          mat.roughnessMap = chairTextures.legRoughnessMap ?? null;
          mat.metalnessMap = chairTextures.legMetalnessMap ?? null;
          mat.needsUpdate = true;
        }
      });

      return sceneClone;
    }, [chairModel, chairTextures, textureKey]);

    return (
      <>
        {numberOfChairs && (
          <ChairTempRenderer
            chairModel={sceneWithTextures ?? chairModel.scene}
            textureKey={textureKey}
            mode={mode}
          />
        )}
      </>
    );
  },
);

export default ChairModel;
