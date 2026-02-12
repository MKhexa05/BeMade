export enum TableShapeCategory {
  RECTANGULAR = "rectangular",
  ROUND = "round",
  SQUARE = "square",
}

export function getShapeCategory(
  shapeName: string | null,
): TableShapeCategory | null {
  if (!shapeName) return null;

  const rectangularShapes = ["rectangle", "oval", "capsule", "oblong"];
  const roundShapes = ["round"];
  const squareShapes = ["square"];

  if (rectangularShapes.includes(shapeName))
    return TableShapeCategory.RECTANGULAR;

  if (roundShapes.includes(shapeName)) return TableShapeCategory.ROUND;

  if (squareShapes.includes(shapeName)) return TableShapeCategory.SQUARE;

  return null;
}
