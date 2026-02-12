import { observer } from "mobx-react";
import { useMainContext } from "../../../hooks/useMainContext";
import ChairModel from "./ChairModel";

const Chair = observer(() => {
  const { designManager, design3DManager } = useMainContext();
  const { chairManager } = designManager;
  const currentPreset = design3DManager.cameraManager.currentPreset;
  const chairCount = chairManager.numberOfChairs ?? 0;
  const isTwoChairView = currentPreset === "two_chair";
  const isChairTableView =
    currentPreset === "right_chair" || currentPreset === "top_chair";

  if (chairCount <= 0) return null;
  if (!isTwoChairView && !isChairTableView) return null;

  const selectedChair = chairManager.selectedChairName;
  const chairColor = chairManager.selectedChairColorInfoJson;

  const chairModelUrl = chairManager.chairInfoJson?.find(
    (chair) => chair.name == selectedChair,
  )?.modelUrl;

  const chairTextureUrl = chairColor?.find(
    (color) => color.name === chairManager.selectedColor,
  );
  return (
    <>
      {chairModelUrl && chairTextureUrl && (
        <ChairModel
          chairModelUrl={chairModelUrl}
          chairTextureUrl={chairTextureUrl}
          mode={isTwoChairView ? "twoChair" : "table"}
        />
      )}
    </>
  );
});
export default Chair;
