import { Vector3 } from "three";

export function placeRectangularChairs(
  numberOfChair: number,
  tableMin: Vector3,
  tableMax: Vector3,
  offsetX = 0.275,
  offsetZ = 0.275,
) {
  const positions: Vector3[] = [];
  if (numberOfChair <= 0) return positions;

  const length = tableMax.x - tableMin.x;
  const frontZ = tableMin.z - offsetZ;
  const backZ = tableMax.z + offsetZ;

  // Rule kept as requested:
  // - For n >= 4: exactly 2 chairs on width sides (parallel to z axis), one per side.
  // - Remaining chairs are placed on front/back (parallel to x axis).
  const sideCount = numberOfChair >= 4 ? 2 : 0;
  const remaining = numberOfChair - sideCount;
  const frontCount = Math.ceil(remaining / 2);
  const backCount = remaining - frontCount;

  if (frontCount > 0) {
    const step = length / (frontCount + 1);
    for (let i = 1; i <= frontCount; i++) {
      positions.push(new Vector3(tableMin.x + step * i, 0, frontZ));
    }
  }

  if (backCount > 0) {
    const step = length / (backCount + 1);
    for (let i = 1; i <= backCount; i++) {
      positions.push(new Vector3(tableMin.x + step * i, 0, backZ));
    }
  }

  if (sideCount === 2) {
    const midZ = (tableMin.z + tableMax.z) * 0.5;
    positions.push(new Vector3(tableMin.x - offsetX, 0, midZ));
    positions.push(new Vector3(tableMax.x + offsetX, 0, midZ));
  }

  return positions;
}

