import { useMainContext } from "../../../hooks/useMainContext";
import { observer } from "mobx-react";
import TopModel from "./TopModel";

const Top = observer(() => {
  const { designManager, design3DManager } = useMainContext();
  const { tableManager } = designManager;
  const { topShapeManager, topColorManager } = tableManager;
  const { cameraManager } = design3DManager;

  const currentPreset = cameraManager.currentPreset;

  const selectedTopName = topShapeManager.selectedTopShapeName;
  const modelUrl = topShapeManager.topshapeInfoJson?.find(
    (shape) => shape.name == selectedTopName,
  );

  const selectedTopColor = topColorManager.selectedTopColor;

  const textureUrl = topColorManager.topColorInfoJson
    ?.map((type) =>
      type.colors.find((color) => color.name === selectedTopColor),
    )
    .find((s) => s);

  if (currentPreset == "two_chair") {
    return null;
  }

  return (
    <>
      {modelUrl && textureUrl && (
        <TopModel modelUrl={modelUrl} textureUrl={textureUrl} />
      )}
    </>
  );
});

export default Top;
