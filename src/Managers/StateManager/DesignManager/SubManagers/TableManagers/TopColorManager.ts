import { makeAutoObservable, runInAction } from "mobx";
import type { StateManager } from "../../../StateManager";
import type { TopColorInfo } from "../../../../../Types/types";

export class TopColorManager {
  private _topColorDataUrl: string = "api/topColor.json";
  private _topColorInfoJson: TopColorInfo[] | null = null;
  private _loading: boolean = false;
  private _error: string | null = null;
  private _selectedTopColor: string | null = null;

  constructor(libstate: StateManager) {
    void libstate;
    makeAutoObservable(this);
  }

  get selectedTopColor() {
    return this._selectedTopColor;
  }

  setSelectedTopColor(name: string) {
    this._selectedTopColor = name;
  }

  get topColorInfoJson() {
    // Getter is pure: return cached data only. Call `loadTopColors()` explicitly to fetch.
    return this._topColorInfoJson;
  }

  get loading() {
    return this._loading;
  }

  get error() {
    return this._error;
  }

  /**
   * Explicitly load top colors from `api/topColor.json`.
   * Getter `topColorInfoJson` is pure and will return cached data only.
   */
  async loadTopColors(force: boolean = false): Promise<TopColorInfo[] | null> {
    if (this._topColorInfoJson && !force) return this._topColorInfoJson;

    this._loading = true;
    this._error = null;

    try {
      const res = await fetch(this._topColorDataUrl);
      if (!res.ok) throw new Error(`Failed to fetch top colors: ${res.status}`);

      const json = (await res.json()) as TopColorInfo[];

      if (!Array.isArray(json))
        throw new Error("Top color JSON is not an array");

      runInAction(() => {
        this._topColorInfoJson = json;
        this._selectedTopColor ??= json?.[0]?.colors?.[0]?.name ?? null;
        this._loading = false;
      });

      return this._topColorInfoJson;
    } catch (err) {
      runInAction(() => {
        this._error = err instanceof Error ? err.message : String(err);
        this._loading = false;
      });
      return null;
    }
  }
}
