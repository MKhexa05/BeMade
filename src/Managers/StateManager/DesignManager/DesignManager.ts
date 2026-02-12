import { makeAutoObservable } from "mobx";

import type { StateManager } from "../StateManager";
import { TableManager } from "./SubManagers/TableManager";
import { ChairManager } from "./SubManagers/ChairManager/ChairManager";
import { PriceManager } from "./Price/PriceManager";
import { DimensionManager } from "./Dimension/DimensionManager";

export class DesignManager {
  private _libstate: StateManager;

  private _tableManager: TableManager;
  private _dimensionManager: DimensionManager;
  private _chairManager: ChairManager;
  private _priceManager: PriceManager;

  constructor(libstate: StateManager) {
    this._libstate = libstate;
    this._tableManager = new TableManager(this._libstate);
    this._dimensionManager = new DimensionManager(this._libstate);
    this._chairManager = new ChairManager(this._libstate);
    this._priceManager = new PriceManager(this._libstate);
    makeAutoObservable(this);
  }

  get chairManager() {
    return this._chairManager;
  }

  get tableManager() {
    return this._tableManager;
  }

  get priceManager() {
    return this._priceManager;
  }

  get dimensionManager() {
    return this._dimensionManager;
  }
}
