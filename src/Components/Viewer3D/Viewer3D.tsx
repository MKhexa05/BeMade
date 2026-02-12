import Canvas3D from "./Canvas3D/Canvas3D";
import Camera from "./Camera/Camera";
import CameraAnimator from "./Camera/CameraAnimator";
import ViewButtons from "../Viewer/OnCanvas/ViewButtons";
import TextureDesciption from "../Viewer/OnCanvas/TextureDesciption";
import TopRightButtons from "../Viewer/OnCanvas/TopRightButtons";
import Base from "./Base/Base";
import Top from "./Top/Top";
import Chair from "./Chair/Chair3D";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Loader from "./Loader/Loader";
import { useMainContext } from "../../hooks/useMainContext";
import ShadowPlane from "./ShadowPlane/ShadowPlane";
import SceneLights from "./SceneLights";
import MyEnvironment from "./Environment/Environment";
import { observer } from "mobx-react";
import type { CameraControls } from "@react-three/drei";
import {
  SHARE_CONFIG_QUERY_KEY,
  applyPersistedDesignConfig,
  buildPersistedDesignConfig,
  decodePersistedDesignConfig,
  encodePersistedDesignConfig,
  readPersistedDesignConfig,
  savePersistedDesignConfig,
} from "../../Utils/designConfig";

const Viewer3D = observer(() => {
  const stateManager = useMainContext();
  const { design3DManager, designManager } = stateManager;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [startupLoading, setStartupLoading] = useState(true);
  const { tableManager } = designManager;
  const { baseShapeManager, topShapeManager, topColorManager } = tableManager;
  const { baseColorManager } = baseShapeManager;

  const handleCameraControlsRef = useCallback(
    (controls: CameraControls | null) => {
      design3DManager.cameraManager.setCameraControls(controls);
    },
    [design3DManager],
  );

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      const baseShapes = await baseShapeManager.loadBaseShapes();
      if (cancelled) return;

      const selectedBase =
        baseShapeManager.selectedBaseShapeName ?? baseShapes?.[0]?.name ?? null;
      if (selectedBase && !baseShapeManager.selectedBaseShapeName) {
        baseShapeManager.setSelectedBaseShapeName(selectedBase);
      }

      await baseColorManager.loadBaseColor();
      if (cancelled) return;
      const baseColors =
        baseColorManager.baseColorInfoJson?.find((c) => c.name === selectedBase)
          ?.colors ?? [];
      if (baseColors.length && !baseColorManager.selectedBaseColor) {
        baseColorManager.setSelectedBaseColor(baseColors[0].name);
      }

      await topShapeManager.loadTopShapes(true);
      if (cancelled) return;
      if (!topShapeManager.selectedTopShapeName) {
        const defaultTop = topShapeManager.topshapeInfoJson?.[0]?.name;
        if (defaultTop) topShapeManager.setSelectedTopShapeName(defaultTop);
      }

      await topColorManager.loadTopColors();
      if (cancelled) return;
      if (!topColorManager.selectedTopColor) {
        const defaultColor =
          topColorManager.topColorInfoJson?.[0]?.colors?.[0]?.name;
        if (defaultColor) topColorManager.setSelectedTopColor(defaultColor);
      }

      const sharedConfigEncoded = new URLSearchParams(window.location.search).get(
        SHARE_CONFIG_QUERY_KEY,
      );
      const sharedConfig = sharedConfigEncoded
        ? decodePersistedDesignConfig(sharedConfigEncoded)
        : null;
      const localConfig = readPersistedDesignConfig();
      const initialConfig = sharedConfig ?? localConfig;
      if (initialConfig) {
        applyPersistedDesignConfig(stateManager, initialConfig);
      }

      setDataReady(true);
    };

    void loadInitialData();
    return () => {
      cancelled = true;
    };
  }, [
    baseShapeManager,
    baseColorManager,
    topShapeManager,
    topColorManager,
    stateManager,
  ]);

  const sceneReady = useMemo(() => {
    return (
      dataReady &&
      design3DManager.cameraManager.hasControls &&
      design3DManager.baseMeshManager.topModelVersion > 0
    );
  }, [
    dataReady,
    design3DManager.cameraManager.hasControls,
    design3DManager.baseMeshManager.topModelVersion,
  ]);

  useEffect(() => {
    if (sceneReady) {
      setStartupLoading(false);
    }
  }, [sceneReady]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;
    try {
      if (document.fullscreenElement === container) {
        await document.exitFullscreen();
      } else {
        await container.requestFullscreen();
      }
    } catch {
      // ignore fullscreen API failures
    }
  };

  const handleSaveConfig = () => {
    const config = buildPersistedDesignConfig(stateManager);
    savePersistedDesignConfig(config);
  };

  const handleShareConfig = async () => {
    const config = buildPersistedDesignConfig(stateManager);
    const encoded = encodePersistedDesignConfig(config);
    const url = new URL(window.location.href);
    url.searchParams.set(SHARE_CONFIG_QUERY_KEY, encoded);
    const shareLink = url.toString();
    savePersistedDesignConfig(config);
    try {
      await navigator.clipboard.writeText(shareLink);
    } catch {
      window.prompt("Copy this share link:", shareLink);
    }
  };

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
        {/* <mesh rotation-x={-Math.PI * 0.5} receiveShadow position={[0,0.0001,0]}>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.06} />
          </mesh> */}
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
        <div className="fixed inset-0 z-[120] bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-full border-4 border-black/10 border-t-black animate-spin" />
            <p className="text-sm text-[var(--color-font)]">Loading scene...</p>
          </div>
        </div>
      )}
    </div>
  );
});

export default Viewer3D;
