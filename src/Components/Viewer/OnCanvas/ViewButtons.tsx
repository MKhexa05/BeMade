import { useEffect, useMemo, useState } from "react";
import { useMainContext } from "../../../hooks/useMainContext";
import { observer } from "mobx-react";
import { useRef } from "react";

const ViewButtons = observer(() => {
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
  const autoSwitchEnabledRef = useRef(false);
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

  const applyByPresetId = (presetId: string, durationMs = 1200) => {
    const idx = presets.findIndex((p) => p.id === presetId);
    if (idx < 0) return;
    setActiveIndex(idx);
    cameraManager.requestPresetAnimation(presetId, { durationMs });
  };

  useEffect(() => {
    const currentPresetId = cameraManager.currentPreset;
    if (!currentPresetId) return;
    const idx = presets.findIndex((p) => p.id === currentPresetId);
    if (idx >= 0) {
      setActiveIndex(idx);
    }
  }, [cameraManager, presets]);

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
    baseShapeManager.selectedBaseShapeName,
    baseColorManager.selectedBaseColor,
    topShapeManager.selectedTopShapeName,
    topColorManager.selectedTopColor,
    chairCount,
  ]);

  useEffect(() => {
    if (!initializedRef.current) return;
    if (autoSwitchEnabledRef.current) return;

    const ready =
      !!baseShapeManager.selectedBaseShapeName &&
      !!baseColorManager.selectedBaseColor &&
      !!topShapeManager.selectedTopShapeName &&
      !!topColorManager.selectedTopColor;
    if (!ready) return;

    autoSwitchEnabledRef.current = true;
    prevBaseShapeRef.current = baseShapeManager.selectedBaseShapeName;
    prevBaseColorRef.current = baseColorManager.selectedBaseColor;
    prevTopShapeRef.current = topShapeManager.selectedTopShapeName;
    prevTopColorRef.current = topColorManager.selectedTopColor;
    prevChairCountRef.current = chairCount;
  }, [
    baseShapeManager.selectedBaseShapeName,
    baseColorManager.selectedBaseColor,
    topShapeManager.selectedTopShapeName,
    topColorManager.selectedTopColor,
    chairCount,
  ]);

  useEffect(() => {
    if (!initializedRef.current || !autoSwitchEnabledRef.current) return;

    const baseShape = baseShapeManager.selectedBaseShapeName;
    const baseColor = baseColorManager.selectedBaseColor;
    const topShape = topShapeManager.selectedTopShapeName;
    const topColor = topColorManager.selectedTopColor;
    const chairIncreasedFromZero =
      prevChairCountRef.current <= 0 && chairCount > 0;

    if (chairIncreasedFromZero && hasChairs) {
      applyByPresetId("right_chair", 1300);
    } else if (
      baseShape !== prevBaseShapeRef.current ||
      baseColor !== prevBaseColorRef.current
    ) {
      applyByPresetId("front", 1200);
    } else if (
      topShape !== prevTopShapeRef.current ||
      topColor !== prevTopColorRef.current
    ) {
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
    baseShapeManager.selectedBaseShapeName,
    baseColorManager.selectedBaseColor,
    topShapeManager.selectedTopShapeName,
    topColorManager.selectedTopColor,
    presets,
  ]);

  const applyByIndex = (index: number) => {
    const boundedIndex = (index + presets.length) % presets.length;
    setActiveIndex(boundedIndex);
    cameraManager.requestPresetAnimation(presets[boundedIndex].id, {
      durationMs: 1500,
    });
  };

  const dotClass = (index: number) =>
    `w-[13px] h-[13px] rounded-full cursor-pointer transition-transform duration-200 ${
      index === activeIndex
        ? "bg-[var(--color-font)] scale-110"
        : "bg-[var(--color-secondary)] hover:scale-110"
    }`;

  return (
    <div className="absolute left-1/2 bottom-3 lg:bottom-5 translate-x-[-50%]">
      <div className="flex items-end gap-2 lg:gap-3">
        <button
          type="button"
          onClick={() => applyByIndex(activeIndex - 1)}
          className="flex items-center justify-center gap-2 rounded-md border border-[var(--color-border-color)] bg-[var(--color-secondary)] text-[var(--color-font)] hover:bg-[var(color-primary)] hover:text-[var(--color-secondary)] transition-all duration-300 ease-in-out disabled:!cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent bg-transparent hover:bg-transparent hover:!text-[var(--color-font)] border-none p-[5px] md:p-0 hover:scale-120 disabled:hover:scale-100"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="30"
            width="30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"></path>
          </svg>
        </button>
        <div className="h-[30px] hidden lg:flex items-center">
          <div className="flex items-center gap-[16px]">
            {presets.map((preset, idx) => (
              <div key={preset.id} className="relative group">
                <button
                  type="button"
                  className={dotClass(idx)}
                  onClick={() => applyByIndex(idx)}
                  aria-label={preset.label}
                  title={preset.label}
                />
                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 whitespace-nowrap rounded-md bg-black/85 px-2 py-1 text-[11px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  {preset.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => applyByIndex(activeIndex + 1)}
          className="flex items-center justify-center gap-2 rounded-md border border-[var(--color-border-color)] 
        bg-[var(--color-secondary)] text-[var(--color-font)] 
        hover:bg-[var(--color-primary)] hover:text-[var(--color-secondary)] 
        transition-all duration-300 ease-in-out disabled:!cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent bg-transparent hover:bg-transparent hover:!text-[var(--color-font)] border-none p-[5px] md:p-0 hover:scale-120 disabled:hover:scale-100"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="30"
            width="30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
});

export default ViewButtons;
