export const TABLE_SHAPE_CATEGORY = {
  RECTANGULAR: "rectangular",
  ROUND: "round",
  SQUARE: "square",
} as const;

export type TableShapeCategory =
  (typeof TABLE_SHAPE_CATEGORY)[keyof typeof TABLE_SHAPE_CATEGORY];

export function getShapeCategory(
  shapeName: string | null,
): TableShapeCategory | null {
  if (!shapeName) return null;

  const rectangularShapes = ["rectangle", "oval", "capsule", "oblong"];
  const roundShapes = ["round"];
  const squareShapes = ["square"];

  if (rectangularShapes.includes(shapeName))
    return TABLE_SHAPE_CATEGORY.RECTANGULAR;

  if (roundShapes.includes(shapeName)) return TABLE_SHAPE_CATEGORY.ROUND;

  if (squareShapes.includes(shapeName)) return TABLE_SHAPE_CATEGORY.SQUARE;
  return null;
}
