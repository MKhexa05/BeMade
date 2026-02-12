import { useEffect, useMemo, useState } from "react";
import type { StateManager } from "../../../Managers/StateManager/StateManager";
import {
  SHARE_CONFIG_QUERY_KEY,
  applyPersistedDesignConfig,
  decodePersistedDesignConfig,
  readPersistedDesignConfig,
} from "../../../Utils/designConfig";

type UseViewerBootstrapArgs = {
  stateManager: StateManager;
};

export const useViewerBootstrap = ({ stateManager }: UseViewerBootstrapArgs) => {
  const { design3DManager, designManager } = stateManager;
  const { tableManager } = designManager;
  const { baseShapeManager, topShapeManager, topColorManager } = tableManager;
  const { baseColorManager } = baseShapeManager;

  const [dataReady, setDataReady] = useState(false);
  const [startupLoading, setStartupLoading] = useState(true);

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
        const defaultColor = topColorManager.topColorInfoJson?.[0]?.colors?.[0]?.name;
        if (defaultColor) topColorManager.setSelectedTopColor(defaultColor);
      }

      if (typeof window !== "undefined") {
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
      }

      setDataReady(true);
    };

    void loadInitialData();
    return () => {
      cancelled = true;
    };
  }, [
    stateManager,
    baseShapeManager,
    baseColorManager,
    topShapeManager,
    topColorManager,
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

  return {
    startupLoading,
  };
};
