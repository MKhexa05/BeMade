import type { StateManager } from "../../StateManager";
import { makeAutoObservable } from "mobx";
import { BaseShapeManager } from "./TableManagers/BaseShapeManager";
import { TopShapeManager } from "./TableManagers/TopShapeManager";
import { TopColorManager } from "./TableManagers/TopColorManager";

export class TableManager {
  private _baseManager: BaseShapeManager;
  private _topShapeManager: TopShapeManager;
  private _topColorManager: TopColorManager;

  constructor(libstate: StateManager) {
    this._baseManager = new BaseShapeManager(libstate);
    this._topShapeManager = new TopShapeManager(libstate);
    this._topColorManager = new TopColorManager(libstate);
    makeAutoObservable(this);
  }

  get topShapeManager() {
    return this._topShapeManager;
  }

  get topColorManager() {
    return this._topColorManager;
  }

  get baseShapeManager() {
    return this._baseManager;
  }
}
