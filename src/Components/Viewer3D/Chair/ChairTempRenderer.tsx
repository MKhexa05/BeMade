import { useMemo } from "react";
import { observer } from "mobx-react";
import { useMainContext } from "../../../hooks/useMainContext";
import * as THREE from "three";
import { resolveChairPlacement } from "./resolveChairPlacement";

type ChairRendererProps = {
  chairModel: THREE.Group<THREE.Object3DEventMap> | null;
  textureKey?: string;
  mode?: "table" | "twoChair";
};

const ChairTempRenderer = observer(
  ({ chairModel, textureKey, mode = "table" }: ChairRendererProps) => {
    const { designManager, design3DManager } = useMainContext();
    const { chairManager, tableManager } = designManager;
    const { topShapeManager } = tableManager;
    const { baseMeshManager } = design3DManager;
    const { dimensionManager } = designManager;
    const shape = topShapeManager.selectedTopShapeName;
    const numberOfChairs = Math.max(0, chairManager.numberOfChairs || 0);
    const tableBox = baseMeshManager.topModelBounds;
    const selectedLength = dimensionManager.selectedLength;
    const selectedWidth = dimensionManager.selectedWidth;
    const maxLength = dimensionManager.maxLength;
    const maxWidth = dimensionManager.maxWidth;
    const ratioX = maxLength > 0 ? selectedLength / maxLength : 1;
    const ratioZ = maxWidth > 0 ? selectedWidth / maxWidth : 1;

    const clones = useMemo(() => {
      if (!chairModel || numberOfChairs === 0) return [] as THREE.Object3D[];
      return Array.from({ length: numberOfChairs }, () =>
        chairModel.clone(true),
      );
    }, [chairModel, numberOfChairs, textureKey]);

    const placements = useMemo(
      () =>
        resolveChairPlacement({
          mode,
          shape,
          numberOfChairs,
          tableBox,
          ratioX,
          ratioZ,
        }),
      [mode, shape, numberOfChairs, tableBox, ratioX, ratioZ],
    );

    if (!chairModel || numberOfChairs === 0) return null;
    if (placements.length === 0) return null;

    return (
      <group>
        {placements.map((placement, i) => {
          const instance = clones[i] ?? chairModel.clone(true);
          return (
            <group
              key={i}
              position={placement.position}
              rotation={[0, placement.rotationY, 0]}
            >
              <primitive object={instance} />
            </group>
          );
        })}
      </group>
    );
  },
);

export default ChairTempRenderer;
