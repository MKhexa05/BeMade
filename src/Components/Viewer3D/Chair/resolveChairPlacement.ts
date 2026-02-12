import * as THREE from "three";
import { getShapeCategory } from "../../../Utils/ShapeCategory";
import { placeOvalChairs } from "./PlaceOvalChairs";
import { placeRectangularChairs } from "./PlaceRectangularChairs";
import { placeRoundChairs } from "./PlaceRoundChairs";
import { placeSquareChairs } from "./PlaceSquareChairs";

export type ChairRendererMode = "table" | "twoChair";

export type ResolvedChairPlacement = {
  position: [number, number, number];
  rotationY: number;
};

type ResolveChairPlacementArgs = {
  mode: ChairRendererMode;
  shape: string | null;
  numberOfChairs: number;
  tableBox: THREE.Box3 | null;
  ratioX: number;
  ratioZ: number;
};

export const resolveChairPlacement = ({
  mode,
  shape,
  numberOfChairs,
  tableBox,
  ratioX,
  ratioZ,
}: ResolveChairPlacementArgs): ResolvedChairPlacement[] => {
  if (numberOfChairs <= 0) return [];

  if (mode === "twoChair") {
    const spacing = 0.8;
    return [
      { position: [-spacing * 0.35, 0, 0], rotationY: 0 },
      { position: [spacing * 0.35, 0, 0], rotationY: Math.PI },
    ];
  }

  const category = getShapeCategory(shape);
  if (!category || !tableBox) return [];

  if (shape === "oval") {
    const radiusX = (tableBox.max.x - tableBox.min.x) * 0.5;
    const radiusZ = (tableBox.max.z - tableBox.min.z) * 0.5;
    const placements = placeOvalChairs(numberOfChairs, radiusX, radiusZ, 0.12, 0.28);

    return placements.map((placement) => ({
      position: [
        placement.position.x * ratioX,
        placement.position.y,
        placement.position.z * ratioZ,
      ],
      rotationY: placement.rotationY,
    }));
  }

  if (category === "square" || category === "rectangular") {
    const positions =
      category === "square"
        ? placeSquareChairs(numberOfChairs, tableBox.min, tableBox.max)
        : placeRectangularChairs(numberOfChairs, tableBox.min, tableBox.max);

    return positions.map((placement) => {
      let rotationY = 0;
      if (Math.abs(tableBox.min.x) > Math.abs(placement.x)) {
        rotationY = placement.z > 0 ? Math.PI : 0;
      } else {
        rotationY = placement.x > 0 ? -Math.PI / 2 : Math.PI / 2;
      }

      return {
        position: [
          placement.x * ratioX,
          placement.y,
          placement.z * ratioZ,
        ],
        rotationY,
      };
    });
  }

  if (category === "round") {
    const radiusX = (tableBox.max.x - tableBox.min.x) * 0.5;
    const radiusZ = (tableBox.max.z - tableBox.min.z) * 0.5;
    const chairOffset = 0.12;
    const positions = placeRoundChairs(
      numberOfChairs,
      radiusX + chairOffset,
      radiusZ + chairOffset,
    );

    return positions.map((placement) => ({
      position: [placement.x * ratioX, placement.y, placement.z * ratioZ],
      rotationY: Math.atan2(-placement.x, -placement.z),
    }));
  }

  return [];
};
