import { makeAutoObservable } from "mobx";
import type { StateManager } from "../../StateManager";
import * as THREE from "three";
export class BaseMeshManager {
  private _selectedBaseShapeMesh: THREE.Scene | null = null;

  private _topModel: THREE.Object3D | null = null;
  private _topModelVersion: number = 0;
  private _topModelBounds: THREE.Box3 | null = null;

  constructor(libstate: StateManager) {
    void libstate;
    makeAutoObservable(this);
  }

  get selectedBaseShapeMesh() {
    return this._selectedBaseShapeMesh;
  }

  setTopModel(topModel: THREE.Object3D) {
    this._topModel = topModel;
    this._recomputeTopModelBounds();
    this._topModelVersion += 1;
  }

  get topModel() {
    return this._topModel;
  }

  get topModelVersion() {
    return this._topModelVersion;
  }

  get topModelBounds() {
    return this._topModelBounds;
  }

  private _recomputeTopModelBounds() {
    if (!this._topModel) {
      this._topModelBounds = null;
      return;
    }
    try {
      this._topModel.updateWorldMatrix(true, true);
      const box = new THREE.Box3().setFromObject(this._topModel);
      this._topModelBounds = box;
    } catch {
      this._topModelBounds = null;
    }
  }
}
