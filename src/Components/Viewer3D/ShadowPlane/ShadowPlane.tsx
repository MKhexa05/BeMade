import { ContactShadows } from "@react-three/drei";
import { useMainContext } from "../../../hooks/useMainContext";
import { observer } from "mobx-react";

const ShadowPlane = observer(() => {
  const { designManager, design3DManager } = useMainContext();
  const { chairManager } = designManager;
  const { cameraManager, baseMeshManager } = design3DManager;
  const numberOfChairs = chairManager.numberOfChairs || 1;
  const currentPreset = cameraManager.currentPreset ?? "front";
  const topModelVersion = baseMeshManager.topModelVersion;
  const isTwoChairView = currentPreset === "two_chair";

  const shadowKey = `${currentPreset}-${numberOfChairs}-${topModelVersion}`;

  return (
    <ContactShadows
      key={shadowKey}
      position={isTwoChairView ? [0, 0, 0] : [0, 0, 0.1]}
      scale={isTwoChairView ? 3 : 10}
      blur={isTwoChairView ? 1.2 : 0.7}
      opacity={isTwoChairView ? 0.45 : 0.3}
      far={isTwoChairView ? 2 : 5}
      resolution={1024}
      frames={isTwoChairView ? Infinity : 1}
    />
  );
});

export default ShadowPlane;
