import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMainContext } from "../../../../hooks/useMainContext";

type CameraPresetView = {
  id: string;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
};

type UseCameraPresetWorkflowResult = {
  presets: CameraPresetView[];
  activeIndex: number;
  applyByIndex: (index: number) => void;
};

export const useCameraPresetWorkflow = (): UseCameraPresetWorkflowResult => {
  const { design3DManager, designManager } = useMainContext();
  const cameraManager = design3DManager.cameraManager;
  const chairCount = designManager.chairManager.numberOfChairs ?? 0;
  const hasChairs = chairCount > 0;
  const { tableManager } = designManager;
  const { baseShapeManager, topShapeManager, topColorManager } = tableManager;
  const { baseColorManager } = baseShapeManager;

  const presets = useMemo(
    () => [
      {
        id: "front",
        label: "Front view",
        position: [0, 1, 2.5] as [number, number, number],
        target: [0, 0.6, 0] as [number, number, number],
      },
      {
        id: "left",
        label: "Left view",
        position: [-2.4, 0.9, 0.6] as [number, number, number],
        target: [0, 0.6, 0] as [number, number, number],
      },
      {
        id: "top",
        label: "Top view",
        position: [0, 4, 0.6] as [number, number, number],
        target: [0, 0.6, 0] as [number, number, number],
      },
      {
        id: "right",
        label: "Right view",
        position: [2.5, 1.2, 1.2] as [number, number, number],
        target: [0, 0.6, 0] as [number, number, number],
      },
      ...(hasChairs
        ? [
            {
              id: "two_chair",
              label: "Two-Chair View",
              position: [0, 1, 3] as [number, number, number],
              target: [0, 0.6, 0] as [number, number, number],
            },
            {
              id: "right_chair",
              label: "Right Chair View",
              position: [3, 1.8, 1.7] as [number, number, number],
              target: [0, 0.6, 0] as [number, number, number],
            },
            {
              id: "top_chair",
              label: "Top Chair View",
              position: [0, 4, 0.6] as [number, number, number],
              target: [0, 0.6, 0] as [number, number, number],
            },
          ]
        : []),
    ],
    [hasChairs],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const initializedRef = useRef(false);
  const prevBaseShapeRef = useRef<string | null>(null);
  const prevBaseColorRef = useRef<string | null>(null);
  const prevTopShapeRef = useRef<string | null>(null);
  const prevTopColorRef = useRef<string | null>(null);
  const prevChairCountRef = useRef<number>(chairCount);

  useEffect(() => {
    presets.forEach((preset) =>
      cameraManager.registerPreset(preset.id, {
        position: preset.position,
        target: preset.target,
      }),
    );
    if (!hasChairs) {
      cameraManager.removePreset("two_chair");
      cameraManager.removePreset("right_chair");
      cameraManager.removePreset("top_chair");
    }
  }, [cameraManager, presets, hasChairs]);

  const applyByPresetId = useCallback(
    (presetId: string, durationMs = 1200) => {
      const idx = presets.findIndex((p) => p.id === presetId);
      if (idx < 0) return;
      setActiveIndex(idx);
      cameraManager.requestPresetAnimation(presetId, { durationMs });
    },
    [cameraManager, presets],
  );

  const currentPreset = cameraManager.currentPreset;
  useEffect(() => {
    if (!currentPreset) return;
    const idx = presets.findIndex((p) => p.id === currentPreset);
    if (idx >= 0) {
      setActiveIndex(idx);
    }
  }, [currentPreset, presets]);

  useEffect(() => {
    if (!cameraManager.hasControls || presets.length === 0) return;
    if (initializedRef.current) return;

    initializedRef.current = true;
    applyByPresetId("front", 900);

    prevBaseShapeRef.current = baseShapeManager.selectedBaseShapeName;
    prevBaseColorRef.current = baseColorManager.selectedBaseColor;
    prevTopShapeRef.current = topShapeManager.selectedTopShapeName;
    prevTopColorRef.current = topColorManager.selectedTopColor;
    prevChairCountRef.current = chairCount;
  }, [
    cameraManager.hasControls,
    presets,
    applyByPresetId,
    baseShapeManager.selectedBaseShapeName,
    baseColorManager.selectedBaseColor,
    topShapeManager.selectedTopShapeName,
    topColorManager.selectedTopColor,
    chairCount,
  ]);

  useEffect(() => {
    if (!initializedRef.current) return;

    const baseShape = baseShapeManager.selectedBaseShapeName;
    const baseColor = baseColorManager.selectedBaseColor;
    const topShape = topShapeManager.selectedTopShapeName;
    const topColor = topColorManager.selectedTopColor;
    const previousBaseShape = prevBaseShapeRef.current;
    const previousBaseColor = prevBaseColorRef.current;
    const previousTopShape = prevTopShapeRef.current;
    const previousTopColor = prevTopColorRef.current;
    const previousChairCount = prevChairCountRef.current;

    const chairCountChanged = previousChairCount !== chairCount;
    const baseChanged =
      baseShape !== previousBaseShape || baseColor !== previousBaseColor;
    const topChanged = topShape !== previousTopShape || topColor !== previousTopColor;

    if (chairCountChanged && chairCount > 0 && hasChairs) {
      applyByPresetId("right_chair", 1300);
    } else if (baseChanged) {
      applyByPresetId("front", 1200);
    } else if (topChanged) {
      applyByPresetId("top", 1200);
    }

    prevBaseShapeRef.current = baseShape;
    prevBaseColorRef.current = baseColor;
    prevTopShapeRef.current = topShape;
    prevTopColorRef.current = topColor;
    prevChairCountRef.current = chairCount;
  }, [
    chairCount,
    hasChairs,
    applyByPresetId,
    baseShapeManager.selectedBaseShapeName,
    baseColorManager.selectedBaseColor,
    topShapeManager.selectedTopShapeName,
    topColorManager.selectedTopColor,
  ]);

  const applyByIndex = useCallback(
    (index: number) => {
      if (presets.length === 0) return;
      const boundedIndex = (index + presets.length) % presets.length;
      setActiveIndex(boundedIndex);
      cameraManager.requestPresetAnimation(presets[boundedIndex].id, {
        durationMs: 1500,
      });
    },
    [cameraManager, presets],
  );

  return { presets, activeIndex, applyByIndex };
};
