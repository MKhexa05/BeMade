import { makeAutoObservable, runInAction, reaction } from "mobx";
import type { BaseShapeInfo } from "../../../../../Types/types";
import type { StateManager } from "../../../StateManager";
import { BaseColorManager } from "./BaseColorManager";

export class BaseShapeManager {
  private _libstate: StateManager;

  private _baseShapeInfoJson: BaseShapeInfo[] | null = null;
  private _baseShapeDataUrl: string = "api/baseShape.json";
  private _selectedBaseShapeName: string | null = null;
  private _loading: boolean = false;
  private _error: string | null = null;

  private _baseColorManager: BaseColorManager;

  constructor(libstate: StateManager) {
    this._libstate = libstate;
    this._baseColorManager = new BaseColorManager(this._libstate);
    makeAutoObservable(this);

    // React to selected base shape changes: pick a default top shape and update dimensions
    reaction(
      () => ({
        selected: this._selectedBaseShapeName,
        info: this._baseShapeInfoJson,
      }),
      ({ selected, info }) => {
        if (!selected || !info) return;
        const selectedShapeInfo = info.find((shape) => shape.name == selected);
        if (!selectedShapeInfo) return;

        const designManager = this._libstate.designManager;
        const topShapeManager = designManager.tableManager.topShapeManager;

        const dimensionManager = designManager.dimensionManager;

        runInAction(() => {
          // Only change the selected top if the currently selected top
          // is not available for the newly selected base shape.
          const currentTop = topShapeManager.selectedTopShapeName;
          const allowed = selectedShapeInfo.available_topShape || [];
          if (!currentTop || !allowed.includes(currentTop)) {
            const defaultTop = allowed[0];
            if (defaultTop) topShapeManager.setSelectedTopShapeName(defaultTop);
          }

          // Update dimension constraints for the selected base
          dimensionManager.setMaxLength(selectedShapeInfo.maxLength);
          dimensionManager.setMinLength(selectedShapeInfo.minLength);

          // Special-case width for certain shapes
          if (selected === "linea-dome") {
            dimensionManager.setMaxWidth(selectedShapeInfo.maxLength);
            dimensionManager.setMinWidth(selectedShapeInfo.minLength);
          } else {
            dimensionManager.setMaxWidth(dimensionManager.maxWidth ?? 1300);
            dimensionManager.setMinWidth(dimensionManager.minWidth ?? 800);
          }

          // If selected dimensions now fall outside the allowed range,
          // snap them to the new maximum (per requested behavior).
          dimensionManager.setSelectedLength(dimensionManager.maxLength);
          dimensionManager.setSelectedWidth(dimensionManager.maxWidth);
        });
      },
    );
  }

  get baseColorManager() {
    return this._baseColorManager;
  }

  get baseShapeInfo() {
    return this._baseShapeInfoJson;
  }

  get baseShapeDataUrl() {
    return this._baseShapeDataUrl;
  }

  get selectedBaseShapeName() {
    return this._selectedBaseShapeName;
  }

  setSelectedBaseShapeName(shapeName: string) {
    this._selectedBaseShapeName = shapeName;
  }

  async loadBaseShapes() {
    if (this._baseShapeInfoJson) return this._baseShapeInfoJson;

    this._loading = true;
    this._error = null;

    try {
      const res = await fetch(this._baseShapeDataUrl);
      if (!res.ok)
        throw new Error(`Failed to fetch base shapes: ${res.status}`);
      const json = (await res.json()) as BaseShapeInfo[];

      if (!Array.isArray(json))
        throw new Error("Base shape JSON is not an array");

      runInAction(() => {
        this._baseShapeInfoJson = json;
        this._selectedBaseShapeName ??= json[0].name;
        this._loading = false;
      });

      return this._baseShapeInfoJson;
    } catch (err) {
      runInAction(() => {
        this._error = err instanceof Error ? err.message : String(err);
        this._loading = false;
      });
      return null;
    }
  }

  get loading() {
    return this._loading;
  }

  get error() {
    return this._error;
  }

  setBaseShapeInfoJson(baseShapeInfoJson: BaseShapeInfo[]) {
    this._baseShapeInfoJson = baseShapeInfoJson;
  }
}
