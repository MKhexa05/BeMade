import { Vector3 } from "three";

export function placeSquareChairs(
  numberOfChair: number,
  tableMin: Vector3,
  tableMax: Vector3,
) {
  const extraGap = 0.15;
  const positions: Vector3[] = [];

  if (numberOfChair <= 0) return positions;

  // Map small fixed counts per your rules
  let lengthTotal = 0;
  let widthTotal = 0;

  if (numberOfChair === 2) {
    lengthTotal = 2;
    widthTotal = 0;
  } else if (numberOfChair === 4) {
    lengthTotal = 2;
    widthTotal = 2;
  } else if (numberOfChair === 6) {
    lengthTotal = 4;
    widthTotal = 2;
  } else if (numberOfChair === 8) {
    lengthTotal = 4;
    widthTotal = 4;
  } else if (numberOfChair < 4) {
    lengthTotal = numberOfChair;
    widthTotal = 0;
  } else {
    // For counts > 8 or other values, distribute evenly around 4 sides
    const base = Math.floor(numberOfChair / 4);
    let rem = numberOfChair % 4;
    // start with base for each side
    const perSide = [base, base, base, base];
    // distribute remainder to front/back (length) first to prefer length edges
    let i = 0;
    while (rem > 0) {
      perSide[i % 4]++;
      i++;
      rem--;
    }
    // perSide[0] = front, [2] = back contribute to lengthTotal
    lengthTotal = perSide[0] + perSide[2];
    widthTotal = perSide[1] + perSide[3];
  }

  // split totals between the two opposite sides
  const frontCount = Math.ceil(lengthTotal / 2);
  const backCount = lengthTotal - frontCount;
  const leftCount = Math.ceil(widthTotal / 2);
  const rightCount = widthTotal - leftCount;

  const distributeWithExtraGap = (
    count: number,
    min: number,
    max: number,
  ): number[] => {
    if (count <= 0) return [];
    if (count === 1) return [(min + max) * 0.5];

    const center = (min + max) * 0.5;
    const baseStep = (max - min) / (count + 1);
    const step = baseStep + extraGap;
    const totalSpan = step * (count - 1);
    const start = center - totalSpan * 0.5;

    const values: number[] = [];
    for (let i = 0; i < count; i++) {
      const value = start + step * i;
      values.push(Math.min(max, Math.max(min, value)));
    }
    return values;
  };

  // front (min.z) positions along x
  if (frontCount > 0) {
    const xs = distributeWithExtraGap(frontCount, tableMin.x, tableMax.x);
    for (const x of xs) {
      positions.push(new Vector3(x, 0, tableMin.z - 0.15));
    }
  }

  // back (max.z) positions along x
  if (backCount > 0) {
    const xs = distributeWithExtraGap(backCount, tableMin.x, tableMax.x);
    for (const x of xs) {
      positions.push(new Vector3(x, 0, tableMax.z + 0.15));
    }
  }

  // left (min.x) positions along z
  if (leftCount > 0) {
    const zs = distributeWithExtraGap(leftCount, tableMin.z, tableMax.z);
    for (const z of zs) {
      positions.push(new Vector3(tableMin.x - 0.15, 0, z));
    }
  }

  // right (max.x) positions along z
  if (rightCount > 0) {
    const zs = distributeWithExtraGap(rightCount, tableMin.z, tableMax.z);
    for (const z of zs) {
      positions.push(new Vector3(tableMax.x + 0.15, 0, z));
    }
  }

  return positions;
}
