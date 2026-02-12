import { Vector3 } from "three";

export function placeSquareChairs(
  numberOfChair: number,
  tableMin: Vector3,
  tableMax: Vector3,
) {
  const length = tableMax.x - tableMin.x;
  const width = tableMax.z - tableMin.z;
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

  // front (min.z) positions along x
  if (frontCount > 0) {
    for (let i = 1; i <= frontCount; i++) {
      const t = (i / (frontCount + 1));
      const x = tableMin.x + t * length ;
      positions.push(new Vector3(x, 0, tableMin.z));
    }
  }

  // back (max.z) positions along x
  if (backCount > 0) {
    for (let i = 1; i <= backCount; i++) {
      const t = i / (backCount + 1);
      const x = tableMin.x + t * length;
      positions.push(new Vector3(x, 0, tableMax.z));
    }
  }

  // left (min.x) positions along z
  if (leftCount > 0) {
    for (let i = 1; i <= leftCount; i++) {
      const t = i / (leftCount + 1);
      const z = tableMin.z + t * width;
      positions.push(new Vector3(tableMin.x, 0, z));
    }
  }

  // right (max.x) positions along z
  if (rightCount > 0) {
    for (let i = 1; i <= rightCount; i++) {
      const t = i / (rightCount + 1);
      const z = tableMin.z + t * width;
      positions.push(new Vector3(tableMax.x, 0, z));
    }
  }

  return positions;
}
