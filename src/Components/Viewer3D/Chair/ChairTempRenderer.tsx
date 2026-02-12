import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { useMainContext } from "../../../hooks/useMainContext";
import * as THREE from "three";
import { getShapeCategory } from "../../../Utils/ShapeCategory";
import { placeRoundChairs } from "./PlaceRoundChairs";
import { placeRectangularChairs } from "./PlaceRectangularChairs";
import { placeSquareChairs } from "./PlaceSquareChairs";
import { placeOvalChairs } from "./PlaceOvalChairs";

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

    const ovalPlacements = useMemo(() => {
      if (shape !== "oval")
        return [] as { position: THREE.Vector3; rotationY: number }[];
      if (!tableBox || numberOfChairs === 0)
        return [] as { position: THREE.Vector3; rotationY: number }[];

      const radiusX = (tableBox.max.x - tableBox.min.x) * 0.5;
      const radiusZ = (tableBox.max.z - tableBox.min.z) * 0.5;
      return placeOvalChairs(numberOfChairs, radiusX, radiusZ, 0.12, 0.28);
    }, [shape, tableBox, numberOfChairs]);

    const positions = useMemo(() => {
      if (numberOfChairs === 0) return [] as THREE.Vector3[];
      const category = getShapeCategory(shape);

      if (category === "square") {
        if (!tableBox) return [] as THREE.Vector3[];
        return placeSquareChairs(numberOfChairs, tableBox.min, tableBox.max);
      }

      if (category === "rectangular" && shape !== "oval") {
        if (!tableBox) return [] as THREE.Vector3[];
        return placeRectangularChairs(
          numberOfChairs,
          tableBox.min,
          tableBox.max,
        );
      }

      if (category === "round") {
        if (!tableBox) return [] as THREE.Vector3[];
        const radiusX = (tableBox.max.x - tableBox.min.x) * 0.5;
        const radiusZ = (tableBox.max.z - tableBox.min.z) * 0.5;
        const chairOffset = 0.12;
        return placeRoundChairs(
          numberOfChairs,
          radiusX + chairOffset,
          radiusZ + chairOffset,
        );
      }

      return [] as THREE.Vector3[];
    }, [shape, tableBox, numberOfChairs]);

    if (!chairModel || numberOfChairs === 0) return null;

    if (mode === "twoChair") {
      const spacing = 0.8;
      const chairs = [0, 1];
      return (
        <group>
          {chairs.map((idx) => {
            const x = idx === 0 ? -spacing * 0.35 : spacing * 0.35;
            const angle = idx === 0 ? 0 : Math.PI;
            const instance = clones[idx] ?? chairModel.clone(true);
            return (
              <group key={idx} position={[x, 0, 0]} rotation={[0, angle, 0]}>
                <primitive object={instance} />
              </group>
            );
          })}
        </group>
      );
    }

    if (shape === "oval") {
      return (
        <group>
          {ovalPlacements.map((placement, i) => {
            const instance = clones[i] ?? chairModel.clone(true);
            return (
              <group
                key={i}
                position={[
                  placement.position.x * ratioX,
                  placement.position.y,
                  placement.position.z * ratioZ,
                ]}
                rotation={[0, placement.rotationY, 0]}
              >
                <primitive object={instance} />
              </group>
            );
          })}
        </group>
      );
    }

    if (
      getShapeCategory(shape) === "rectangular" ||
      getShapeCategory(shape) === "square"
    ) {
      if (!tableBox) return null;

      return (
        <group>
          {positions.map((placement, i) => {
            let angle = 0;
            if (Math.abs(tableBox.min.x) > Math.abs(placement.x)) {
              angle = placement.z > 0 ? Math.PI : 0;
            } else {
              angle = placement.x > 0 ? -Math.PI / 2 : Math.PI / 2;
            }

            const instance = clones[i] ?? chairModel.clone(true);
            return (
              <group
                key={i}
                position={[
                  placement.x * ratioX,
                  placement.y,
                  placement.z * ratioZ,
                ]}
                rotation={[0, angle, 0]}
              >
                <primitive object={instance} />
              </group>
            );
          })}
        </group>
      );
    }

    if (getShapeCategory(shape) === "round") {
      return (
        <group>
          {positions.map((placement, i) => {
            const angle = Math.atan2(-placement.x, -placement.z);
            const instance = clones[i] ?? chairModel.clone(true);
            return (
              <group
                key={i}
                position={[
                  placement.x * ratioX,
                  placement.y,
                  placement.z * ratioZ,
                ]}
                rotation={[0, angle, 0]}
              >
                <primitive object={instance} />
              </group>
            );
          })}
        </group>
      );
    }

    return null;
  },
);

export default ChairTempRenderer;
