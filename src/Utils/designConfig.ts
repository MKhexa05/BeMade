import type { StateManager } from "../Managers/StateManager/StateManager";
import type { BaseColorInfo, ChairInfo, TopColorInfo } from "../Types/types";

export const DESIGN_CONFIG_STORAGE_KEY = "bemade:selected_config";
export const ORDER_SAMPLES_STORAGE_KEY = "bemade:order_samples";
export const ORDER_PREVIEW_STORAGE_KEY = "bemade:order_preview_image";
export const CHECKOUT_CONTEXT_STORAGE_KEY = "bemade:checkout_context";
export const SHARE_CONFIG_QUERY_KEY = "config";

export type CheckoutType = "table" | "samples";

export type CheckoutSampleItem = {
  name: string;
  previewUrl: string;
};

export type CheckoutContext = {
  checkoutType: CheckoutType;
  sampleNames: string[];
  sampleItems: CheckoutSampleItem[];
};

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

// Returns all selected stuffs
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

// Saves all selected stuff to local Storage (when save button is clicked)
export const savePersistedDesignConfig = (config: PersistedDesignConfig) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(DESIGN_CONFIG_STORAGE_KEY, JSON.stringify(config));
};

// Read from local storage if exists
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

// Encode into a link (when share is clicked)
export const encodePersistedDesignConfig = (config: PersistedDesignConfig) => {
  const json = JSON.stringify(config);
  return btoa(encodeURIComponent(json));
};

// Decode selected stuff from link if exists
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

// Pick color from all colors and set it 
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

// Select all the selectable stuffs 
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

const isCheckoutType = (value: unknown): value is CheckoutType =>
  value === "table" || value === "samples";

const normalizeSampleItem = (item: unknown): CheckoutSampleItem | null => {
  if (!item || typeof item !== "object") return null;
  const raw = item as { name?: unknown; previewUrl?: unknown };
  if (typeof raw.name !== "string" || !raw.name.trim()) return null;
  return {
    name: raw.name,
    previewUrl: typeof raw.previewUrl === "string" ? raw.previewUrl : "",
  };
};

const normalizeSampleNames = (names: unknown): string[] => {
  if (!Array.isArray(names)) return [];
  return names
    .filter((name): name is string => typeof name === "string" && !!name.trim())
    .filter((name, index, arr) => arr.indexOf(name) === index);
};

const normalizeSampleItems = (items: unknown): CheckoutSampleItem[] => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => normalizeSampleItem(item))
    .filter((item): item is CheckoutSampleItem => !!item);
};

const mapItemsToNames = (items: CheckoutSampleItem[]) =>
  items.map((item) => item.name);

export const buildTableCheckoutContext = (): CheckoutContext => ({
  checkoutType: "table",
  sampleNames: [],
  sampleItems: [],
});

export const buildSampleCheckoutContext = (
  sampleItems: CheckoutSampleItem[],
): CheckoutContext => ({
  checkoutType: "samples",
  sampleNames: mapItemsToNames(sampleItems),
  sampleItems,
});

export const saveCheckoutContext = (context: CheckoutContext) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHECKOUT_CONTEXT_STORAGE_KEY, JSON.stringify(context));
};

export const readCheckoutContext = (): CheckoutContext | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CHECKOUT_CONTEXT_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as {
      checkoutType?: unknown;
      sampleNames?: unknown;
      sampleItems?: unknown;
    };
    if (!isCheckoutType(parsed.checkoutType)) return null;
    if (parsed.checkoutType === "table") return buildTableCheckoutContext();
    const sampleItems = normalizeSampleItems(parsed.sampleItems);
    const sampleNames = normalizeSampleNames(parsed.sampleNames);
    return {
      checkoutType: "samples",
      sampleItems,
      sampleNames: sampleNames.length ? sampleNames : mapItemsToNames(sampleItems),
    };
  } catch {
    return null;
  }
};

export const clearCheckoutContext = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHECKOUT_CONTEXT_STORAGE_KEY);
};

const readStoredSamplePayload = (): CheckoutSampleItem[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ORDER_SAMPLES_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as {
      names?: unknown;
      samples?: unknown;
    };
    const items = normalizeSampleItems(parsed.samples);
    if (items.length) return items;
    const names = normalizeSampleNames(parsed.names);
    return names.map((name) => ({ name, previewUrl: "" }));
  } catch {
    return [];
  }
};

export const resolveCheckoutContext = (state: unknown): CheckoutContext => {
  const stateObj =
    state && typeof state === "object"
      ? (state as {
          checkoutType?: unknown;
          sampleNames?: unknown;
          sampleItems?: unknown;
        })
      : null;

  const stateType = stateObj?.checkoutType;
  if (isCheckoutType(stateType)) {
    if (stateType === "table") return buildTableCheckoutContext();
    const stateItems = normalizeSampleItems(stateObj?.sampleItems);
    const stateNames = normalizeSampleNames(stateObj?.sampleNames);
    const sampleItems = stateItems.length ? stateItems : readStoredSamplePayload();
    const sampleNames = stateNames.length ? stateNames : mapItemsToNames(sampleItems);
    return {
      checkoutType: "samples",
      sampleItems,
      sampleNames,
    };
  }

  const storedContext = readCheckoutContext();
  if (storedContext) {
    if (storedContext.checkoutType === "table") return storedContext;
    const sampleItems =
      storedContext.sampleItems.length > 0
        ? storedContext.sampleItems
        : readStoredSamplePayload();
    return {
      checkoutType: "samples",
      sampleItems,
      sampleNames:
        storedContext.sampleNames.length > 0
          ? storedContext.sampleNames
          : mapItemsToNames(sampleItems),
    };
  }

  return buildTableCheckoutContext();
};
