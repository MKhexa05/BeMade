import { useMainContext } from "../../../hooks/useMainContext";
import { observer } from "mobx-react";
import BaseModel from "./BaseModel";

const Base = observer(() => {
  const { designManager, design3DManager } = useMainContext();
  const { tableManager } = designManager;
  const { baseShapeManager } = tableManager;
  const { baseColorManager } = baseShapeManager;
  const { cameraManager } = design3DManager;

  const currentPreset = cameraManager.currentPreset;

  const selectedBaseName = baseShapeManager.selectedBaseShapeName;
  const modelUrl = baseShapeManager.baseShapeInfo?.find(
    (shape) => shape.name == selectedBaseName,
  )?.modelUrl;

  const selectedBaseColor = baseColorManager.selectedBaseColor;
  const textureUrl = baseColorManager.baseColorInfoJson
    ?.find((color) => color.name == selectedBaseName)
    ?.colors.find((c) => c.name == selectedBaseColor);

  if (currentPreset == "two_chair") {
    return null;
  }
  return (
    <>
      {modelUrl && textureUrl && (
        <BaseModel modelUrl={modelUrl} textureUrl={textureUrl} />
      )}
    </>
  );
});

export default Base;
