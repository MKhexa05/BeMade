import { makeAutoObservable, runInAction } from "mobx";
import type { TopShapeInfo } from "../../../../../Types/types";
import type { StateManager } from "../../../StateManager";

export class TopShapeManager {
  private _libstate: StateManager;

  private _topShapeInfoJson: TopShapeInfo[] | null = null;
  private _topShapeDataUrl: string = "api/topShape.json";
  private _selectedTopShapeName: string | null = null;
  private _loading: boolean = false;
  private _error: string | null = null;

  constructor(libstate: StateManager) {
    this._libstate = libstate;
    makeAutoObservable(this);
  }

  get topshapeInfoJson() {
    return this._topShapeInfoJson;
  }

  get topShapeDataUrl() {
    return this._topShapeDataUrl;
  }

  get selectedTopShapeName() {
    return this._selectedTopShapeName;
  }

  async loadBaseShapes() {
    // Deprecated: use `loadTopShapes` instead
    return this.loadTopShapes();
  }

  get loading() {
    return this._loading;
  }

  get error() {
    return this._error;
  }

  async loadTopShapes(force: boolean = false) {
    if (this._topShapeInfoJson && !force) return this._topShapeInfoJson;

    this._loading = true;
    this._error = null;

    try {
      const res = await fetch(this._topShapeDataUrl);
      if (!res.ok) throw new Error(`Failed to fetch top shapes: ${res.status}`);
      const json = (await res.json()) as TopShapeInfo[];

      if (!Array.isArray(json))
        throw new Error("Top shape JSON is not an array");

      runInAction(() => {
        this._topShapeInfoJson = json;
        const selectedBaseShape =
          this._libstate.designManager.tableManager.baseShapeManager.baseShapeInfo?.find(
            (shape) =>
              shape.name ==
              this._libstate.designManager.tableManager.baseShapeManager
                .selectedBaseShapeName,
          );

        if (!selectedBaseShape) {
          // no-op; selection may be set later when base shapes load
        }

        this._selectedTopShapeName =
          json.find((shape) =>
            selectedBaseShape?.available_topShape.includes(shape.name),
          )?.name ?? null;

        this._loading = false;
      });

      return this._topShapeInfoJson;
    } catch (err) {
      runInAction(() => {
        this._error = err instanceof Error ? err.message : String(err);
        this._loading = false;
      });
      return null;
    }
  }

  setTopShapeInfoJson(topShapeInfo: TopShapeInfo[]) {
    this._topShapeInfoJson = topShapeInfo;
  }

  setSelectedTopShapeName(shapeName: string) {
    this._selectedTopShapeName = shapeName;
  }
}
