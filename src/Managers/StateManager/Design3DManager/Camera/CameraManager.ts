import { makeAutoObservable } from "mobx";
import type { CameraControls } from "@react-three/drei";
import type { RefObject } from "react";
import type { StateManager } from "../../StateManager";

export type CameraPreset = {
  id: string;
  position: [number, number, number];
  target: [number, number, number];
  transition?: boolean;
  zoom?: number;
};

export type CameraAnimationOptions = {
  durationMs?: number;
};

type CameraAnimationRequest = {
  id: number;
  preset: CameraPreset;
  durationMs: number;
};

export class CameraManager {
  private _cameraRef: RefObject<CameraControls | null> | null = null;
  private _cameraControls: CameraControls | null = null;
  private _presets = new Map<string, CameraPreset>();
  private _animationRequest: CameraAnimationRequest | null = null;
  private _requestId = 0;
  private _currentPreset: string | null = null;

  constructor(libstate: StateManager) {
    void libstate;
    makeAutoObservable(this);
  }

  get cameraRef() {
    return this._cameraRef;
  }

  get controls() {
    if (this._cameraControls) return this._cameraControls;
    return this._cameraRef?.current ?? null;
  }

  get hasControls() {
    return !!this.controls;
  }

  get currentPreset() {
    return this._currentPreset;
  }

  setCurrentPreset(presetId: string) {
    this._currentPreset = presetId;
  }

  setCameraRef(ref: RefObject<CameraControls | null> | null) {
    this._cameraRef = ref;
  }

  setCameraControls(controls: CameraControls | null) {
    this._cameraControls = controls;
  }

  registerPreset(id: string, preset: Omit<CameraPreset, "id">) {
    this._presets.set(id, { id, ...preset });
  }

  removePreset(id: string) {
    this._presets.delete(id);
  }

  clearPresets() {
    this._presets.clear();
    this._currentPreset = null;
  }

  async applyPreset(
    presetOrId: CameraPreset | string,
    transitionOverride?: boolean,
  ) {
    const preset =
      typeof presetOrId === "string"
        ? (this._presets.get(presetOrId) ?? null)
        : presetOrId;
    if (!preset) {
      return false;
    }

    this.setCurrentPreset(preset.id);
    return this._applyPreset(preset, transitionOverride);
  }

  requestPresetAnimation(
    presetOrId: CameraPreset | string,
    options: CameraAnimationOptions = {},
  ) {
    const preset =
      typeof presetOrId === "string"
        ? (this._presets.get(presetOrId) ?? null)
        : presetOrId;
    if (!preset) {
      return false;
    }

    const durationMs = Math.max(100, options.durationMs ?? 800);
    this._requestId += 1;
    this._animationRequest = {
      id: this._requestId,
      preset,
      durationMs,
    };
    this._currentPreset = preset.id;
    return true;
  }

  get animationRequest() {
    return this._animationRequest;
  }

  async reset(transition = true) {
    const controls = this.controls;
    if (!controls) {
      return false;
    }
    await controls.reset(transition);
    this._currentPreset = null;
    return true;
  }

  saveState() {
    const controls = this.controls;
    if (!controls) {
      return false;
    }
    controls.saveState();
    return true;
  }

  private async _applyPreset(
    preset: CameraPreset,
    transitionOverride?: boolean,
  ) {
    const controls = this.controls;
    if (!controls) {
      return false;
    }
    const enableTransition = transitionOverride ?? preset.transition ?? true;
    const [px, py, pz] = preset.position;
    const [tx, ty, tz] = preset.target;
    const promises: Promise<void>[] = [
      controls.setLookAt(px, py, pz, tx, ty, tz, enableTransition),
    ];
    if (typeof preset.zoom === "number") {
      promises.push(controls.zoomTo(preset.zoom, enableTransition));
    }
    await Promise.all(promises);
    return true;
  }
}
