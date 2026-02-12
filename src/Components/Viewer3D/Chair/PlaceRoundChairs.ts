import { Vector3 } from "three";

export function placeRoundChairs(
  numberOfChairs: number,
  distanceFromCenterX: number,
  distanceFromCenterZ: number,
) {
  if (numberOfChairs <= 0) return [] as Vector3[];
  const angle = Math.PI / numberOfChairs;

  const positions: Vector3[] = [];

  for (let i = 0; i < numberOfChairs; i++) {
    const angleForChair = angle * (2 * i + 1);
    const pos = new Vector3(
      Math.cos(angleForChair) * distanceFromCenterX,
      0,
      Math.sin(angleForChair) * distanceFromCenterZ,
    );
    positions.push(pos);
  }
  return positions;
}
