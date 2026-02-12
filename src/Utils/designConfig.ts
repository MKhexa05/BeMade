import type { StateManager } from "../Managers/StateManager/StateManager";
import type { BaseColorInfo, ChairInfo, TopColorInfo } from "../Types/types";

export const DESIGN_CONFIG_STORAGE_KEY = "bemade:selected_config";
export const ORDER_SAMPLES_STORAGE_KEY = "bemade:order_samples";
export const ORDER_PREVIEW_STORAGE_KEY = "bemade:order_preview_image";
export const SHARE_CONFIG_QUERY_KEY = "config";

export type PersistedDesignConfig = {
  baseShape: string | null;
  baseColor: string | null;
  topShape: string | null;
  topColor: string | null;
  length: number | null;
  width: number | null;
  numberOfChairs: number;
  chairType: string | null;
  chairColor: string | null;
};

export const buildPersistedDesignConfig = (
  stateManager: StateManager,
): PersistedDesignConfig => {
  const designManager = stateManager.designManager;
  const tableManager = designManager.tableManager;
  const chairManager = designManager.chairManager;
  const dimensionManager = designManager.dimensionManager;

  return {
    baseShape: tableManager.baseShapeManager.selectedBaseShapeName,
    baseColor: tableManager.baseShapeManager.baseColorManager.selectedBaseColor,
    topShape: tableManager.topShapeManager.selectedTopShapeName,
    topColor: tableManager.topColorManager.selectedTopColor,
    length: dimensionManager.selectedLength,
    width: dimensionManager.selectedWidth,
    numberOfChairs: chairManager.numberOfChairs ?? 0,
    chairType: chairManager.selectedChairName,
    chairColor: chairManager.selectedColor,
  };
};

export const savePersistedDesignConfig = (config: PersistedDesignConfig) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(DESIGN_CONFIG_STORAGE_KEY, JSON.stringify(config));
};

export const readPersistedDesignConfig =
  (): PersistedDesignConfig | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(DESIGN_CONFIG_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as PersistedDesignConfig;
    } catch {
      return null;
    }
  };

export const encodePersistedDesignConfig = (config: PersistedDesignConfig) => {
  const json = JSON.stringify(config);
  return btoa(encodeURIComponent(json));
};

export const decodePersistedDesignConfig = (
  encoded: string,
): PersistedDesignConfig | null => {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json) as PersistedDesignConfig;
  } catch {
    return null;
  }
};

const pickBaseColor = (
  baseColors: BaseColorInfo[] | null,
  baseShape: string | null,
  preferred: string | null,
) => {
  const options =
    baseColors?.find((entry) => entry.name === baseShape)?.colors ?? [];
  if (!options.length) return null;
  if (preferred && options.some((c) => c.name === preferred)) return preferred;
  return options[0].name;
};

const hasTopColor = (topColors: TopColorInfo[] | null, name: string | null) => {
  if (!name) return false;
  return (topColors ?? []).some((group) =>
    group.colors.some((color) => color.name === name),
  );
};

const pickChairType = (chairs: ChairInfo[] | null, preferred: string | null) => {
  if (!chairs?.length) return null;
  if (preferred && chairs.some((chair) => chair.name === preferred)) {
    return preferred;
  }
  return chairs[0].name;
};

export const applyPersistedDesignConfig = (
  stateManager: StateManager,
  config: PersistedDesignConfig,
) => {
  const designManager = stateManager.designManager;
  const tableManager = designManager.tableManager;
  const chairManager = designManager.chairManager;
  const dimensionManager = designManager.dimensionManager;
  const { baseShapeManager, topShapeManager, topColorManager } = tableManager;
  const { baseColorManager } = baseShapeManager;

  const knownBaseShape =
    config.baseShape &&
    baseShapeManager.baseShapeInfo?.some((shape) => shape.name === config.baseShape)
      ? config.baseShape
      : baseShapeManager.selectedBaseShapeName;
  if (knownBaseShape) {
    baseShapeManager.setSelectedBaseShapeName(knownBaseShape);
  }

  const safeBaseColor = pickBaseColor(
    baseColorManager.baseColorInfoJson,
    knownBaseShape ?? null,
    config.baseColor,
  );
  if (safeBaseColor) {
    baseColorManager.setSelectedBaseColor(safeBaseColor);
  }

  const allowedTopShapes =
    baseShapeManager.baseShapeInfo?.find((shape) => shape.name === knownBaseShape)
      ?.available_topShape ?? [];
  const safeTopShape =
    config.topShape && allowedTopShapes.includes(config.topShape)
      ? config.topShape
      : topShapeManager.selectedTopShapeName;
  if (safeTopShape) {
    topShapeManager.setSelectedTopShapeName(safeTopShape);
  }

  const safeTopColor = hasTopColor(topColorManager.topColorInfoJson, config.topColor)
    ? config.topColor
    : topColorManager.selectedTopColor;
  if (safeTopColor) {
    topColorManager.setSelectedTopColor(safeTopColor);
  }

  if (typeof config.length === "number") {
    dimensionManager.setSelectedLength(config.length);
  }
  if (typeof config.width === "number") {
    dimensionManager.setSelectedWidth(config.width);
  }

  const safeChairType = pickChairType(chairManager.chairInfoJson, config.chairType);
  if (safeChairType) {
    chairManager.setSelectedChairName(safeChairType);
  }
  if (config.chairColor) {
    chairManager.setSelectedColor(config.chairColor);
  }
  const max = chairManager.maximumNumberOfChairs ?? 0;
  const requested = Math.max(0, Math.min(max, config.numberOfChairs ?? 0));
  chairManager.setNumberOfChairs(requested % 2 === 0 ? requested : requested - 1);
};
