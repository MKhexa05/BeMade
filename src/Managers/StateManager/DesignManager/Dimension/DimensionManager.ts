import { makeAutoObservable } from "mobx";
import type { StateManager } from "../../StateManager";

export class DimensionManager {
  private _maxLength: number = 3180;
  private _minLength: number = 1200;
  private _maxWidth: number = 1300;
  private _minWidth: number = 800;

  private _selectedLength: number = 3180;
  private _selectedWidth: number = 1300;
  private _lengthStep: number = 80;
  private _widthStep: number = 30;

  constructor(libstate: StateManager) {
    void libstate;
    makeAutoObservable(this);
  }

  get maxLength() {
    return this._maxLength;
  }

  setMaxLength(length: number) {
    this._maxLength = length;
    this._selectedLength = Math.min(this.selectedLength, length);
  }
  get minLength() {
    return this._minLength;
  }

  setMinLength(length: number) {
    this._minLength = length;
    this._selectedLength = Math.max(this.selectedLength, length);
  }

  get maxWidth() {
    return this._maxWidth;
  }

  setMaxWidth(width: number) {
    this._maxWidth = width;
    this._selectedWidth = Math.min(this._selectedWidth, width);
  }

  get minWidth() {
    return this._minWidth;
  }

  setMinWidth(width: number) {
    this._minWidth = width;
    this._selectedWidth = Math.max(this._selectedWidth, width);
  }

  get selectedLength() {
    return this._selectedLength;
  }

  get lengthStep() {
    return this._lengthStep;
  }

  get widthStep() {
    return this._widthStep;
  }

  setSelectedLength(length: number) {
    const clamped = Math.max(this.minLength, Math.min(this.maxLength, length));

    // Allow exact endpoints even if not a multiple of the step (e.g. 1580).
    if (clamped === this.maxLength || clamped === this.minLength) {
      this._selectedLength = clamped;
      return;
    }

    // Prefer snapping to a multiple of 100 when that snapped value falls
    // inside the allowed range. Otherwise snap to the configured step.
    const snap100 = Math.round(clamped / 100) * 100;
    if (snap100 >= this.minLength && snap100 <= this.maxLength) {
      this._selectedLength = snap100;
      return;
    }

    this._selectedLength = Math.max(
      this.minLength,
      Math.min(
        this.maxLength,
        Math.round(clamped / this.lengthStep) * this.lengthStep,
      ),
    );
    // this._selectedLength = length;
  }

  adjustLengthBy(delta: number) {
    this.setSelectedLength(this._selectedLength + delta);
  }

  // Combined helpers removed. Use explicit setters from the component
  // when length and width must be kept equal.

  get selectedWidth() {
    return this._selectedWidth;
  }

  setSelectedWidth(length: number) {
    const clamped = Math.max(this.minWidth, Math.min(this.maxWidth, length));

    if (clamped === this.maxWidth || clamped === this.minWidth) {
      this._selectedWidth = clamped;
      return;
    }

    const snap50 = Math.round(clamped / 50) * 50;
    if (snap50 >= this.minWidth && snap50 <= this.maxWidth) {
      this._selectedWidth = snap50;
      return;
    }

    this._selectedWidth = this.maxWidth;
  }

  adjustWidthBy(delta: number) {
    this.setSelectedWidth(this._selectedWidth + delta);
  }
}
