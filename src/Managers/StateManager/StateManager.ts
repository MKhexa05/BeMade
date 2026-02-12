import { makeAutoObservable } from "mobx";

import { DesignManager } from "./DesignManager/DesignManager";
import { Design3DManager } from "./Design3DManager/Design3DManager";


export class StateManager {
  private _designManager = new DesignManager(this);
  private _design3DManager = new Design3DManager(this);

  constructor() {
    makeAutoObservable(this);
  }
  get designManager() {
    return this._designManager;
  }

  get design3DManager() {
    return this._design3DManager;
  }
}
