import { Vector3 } from "three";

export type OvalChairPlacement = {
  position: Vector3;
  rotationY: number;
};

export function placeOvalChairs(
  numberOfChairs: number,
  radiusX: number,
  radiusZ: number,
  offset = 0.12,
  endMarginRadians = 0.25,
) {
  const placements: OvalChairPlacement[] = [];
  if (numberOfChairs <= 0) return placements;

  const rx = Math.max(radiusX + offset, 1e-4);
  const rz = Math.max(radiusZ + offset, 1e-4);
  const topCount = Math.ceil(numberOfChairs / 2);
  const bottomCount = Math.floor(numberOfChairs / 2);

  const pushSide = (count: number, startAngle: number, endAngle: number) => {
    if (count <= 0) return;
    for (let i = 1; i <= count; i++) {
      const t = i / (count + 1);
      const theta = startAngle + (endAngle - startAngle) * t;
      const x = rx * Math.cos(theta) * 1.09;
      const z = rz * Math.sin(theta) * 1.09;

      // Inward normal on ellipse: -[x/rx^2, z/rz^2]
      const inwardX = -x / (rx * rx);
      const inwardZ = -z / (rz * rz);
      const rotationY = Math.atan2(inwardX, inwardZ);

      placements.push({
        position: new Vector3(x, 0, z),
        rotationY,
      });
    }
  };

  // Top long edge arc (z > 0), trimmed near the short ends.
  pushSide(topCount, Math.PI - endMarginRadians, endMarginRadians);
  // Bottom long edge arc (z < 0), trimmed near the short ends.
  pushSide(
    bottomCount,
    Math.PI + endMarginRadians,
    Math.PI * 2 - endMarginRadians,
  );

  return placements;
}
