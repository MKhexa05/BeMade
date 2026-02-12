import { makeAutoObservable, runInAction } from "mobx";
import type { StateManager } from "../../../StateManager";
import type { BaseColorInfo } from "../../../../../Types/types";

export class BaseColorManager {
  private _baseColorUrl: string = "api/baseColors.json";
  private _baseColorInfoJson: BaseColorInfo[] | null = null;
  private _selectedBaseColor: string | null = null;
  private _loading: boolean = false;
  private _error: string | null = null;

  constructor(libstate: StateManager) {
    void libstate;
    makeAutoObservable(this);
  }

  get baseColorUrl() {
    return this._baseColorUrl;
  }

  get selectedBaseColor() {
    return this._selectedBaseColor;
  }

  setSelectedBaseColor(name: string) {
    this._selectedBaseColor = name;
  }

  get baseColorInfoJson() {
    // Pure getter — call `loadBaseColor()` explicitly to fetch data.
    return this._baseColorInfoJson;
  }

  async loadBaseColor() {
    if (this._baseColorInfoJson) return this._baseColorInfoJson;

    this._loading = true;
    this._error = null;

    try {
      const res = await fetch(this._baseColorUrl);
      if (!res.ok)
        throw new Error(`Failed to fetch base colors: ${res.status}`);
      const json = (await res.json()) as BaseColorInfo[];

      if (!Array.isArray(json))
        throw new Error("Base color JSON is not an array");

      runInAction(() => {
        this._baseColorInfoJson = json;
        this._loading = false;
      });

      return this._baseColorInfoJson;
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

  setBaseColorInfoJson(info: BaseColorInfo[]) {
    this._baseColorInfoJson = info;
  }
}
