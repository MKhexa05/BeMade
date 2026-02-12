import { CameraControls } from "@react-three/drei";
import { observer } from "mobx-react-lite";
import React from "react";

export const Camera = observer(
  ({ cameraRef }: { cameraRef?: React.Ref<CameraControls> } = {}) => {
    return (
      <>
        <CameraControls enabled={false} ref={cameraRef} />
      </>
    );
  },
);

export default Camera;
