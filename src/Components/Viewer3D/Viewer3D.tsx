import Canvas3D from "./Canvas3D/Canvas3D";
import Camera from "./Camera/Camera";
import CameraAnimator from "./Camera/CameraAnimator";
import ViewButtons from "../Viewer/OnCanvas/ViewButtons";
import TextureDesciption from "../Viewer/OnCanvas/TextureDesciption";
import TopRightButtons from "../Viewer/OnCanvas/TopRightButtons";
import Base from "./Base/Base";
import Top from "./Top/Top";
import Chair from "./Chair/Chair3D";
import { Suspense, useCallback } from "react";
import Loader from "./Loader/Loader";
import { useMainContext } from "../../hooks/useMainContext";
import ShadowPlane from "./ShadowPlane/ShadowPlane";
import SceneLights from "./SceneLights";
import MyEnvironment from "./Environment/Environment";
import { observer } from "mobx-react";
import type { CameraControls } from "@react-three/drei";
import { useViewerBootstrap } from "./hooks/useViewerBootstrap";
import { useViewerFullscreen } from "./hooks/useViewerFullscreen";
import { useConfigPersistence } from "./hooks/useConfigPersistence";

const Viewer3D = observer(() => {
  const stateManager = useMainContext();
  const { design3DManager } = stateManager;
  const { startupLoading } = useViewerBootstrap({ stateManager });
  const { containerRef, isFullscreen, toggleFullscreen } =
    useViewerFullscreen();
  const { handleSaveConfig, handleShareConfig } = useConfigPersistence({
    stateManager,
  });

  const handleCameraControlsRef = useCallback(
    (controls: CameraControls | null) => {
      design3DManager.cameraManager.setCameraControls(controls);
    },
    [design3DManager],
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full transition-all duration-300 ease-in-out"
    >
      <Canvas3D>
        {/* Camera with external ref for programmatic presets */}
        <Camera cameraRef={handleCameraControlsRef} />
        <CameraAnimator />
        <MyEnvironment />
        {/* Lighting: hemisphere for soft fill, directional key light with shadows, and a spot for highlights */}
        <SceneLights />
        <group>
          <Suspense fallback={<Loader />}>
            <Base />
          </Suspense>
          <Suspense fallback={<Loader />}>
            <Top />
          </Suspense>
          <Suspense fallback={<Loader />}>
            <Chair />
          </Suspense>
        </group>
        <ShadowPlane />
      </Canvas3D>
      <TopRightButtons
        onSave={handleSaveConfig}
        onShare={handleShareConfig}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />
      <ViewButtons />
      <TextureDesciption />
      {startupLoading && (
        <div className="fixed inset-0 z-120 bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-full border-4 border-black/10 border-t-black animate-spin" />
            <p className="text-sm text-(--color-font)">
              Loading 3D Configurator...
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

export default Viewer3D;
