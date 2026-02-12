import { makeAutoObservable } from "mobx";
import type { StateManager } from "../StateManager";
import { BaseMeshManager } from "./Base/BaseMeshManager";
import { CameraManager } from "./Camera/CameraManager";

export class Design3DManager {
  private _libstate: StateManager;
  private _baseMeshManager: BaseMeshManager;
  private _cameraManager: CameraManager;

  constructor(libstate: StateManager) {
    this._libstate = libstate;
    this._baseMeshManager = new BaseMeshManager(libstate);
    this._cameraManager = new CameraManager(libstate);
    makeAutoObservable(this);
  }

  get baseMeshManager() {
    return this._baseMeshManager;
  }

  get cameraManager() {
    return this._cameraManager;
  }
}
