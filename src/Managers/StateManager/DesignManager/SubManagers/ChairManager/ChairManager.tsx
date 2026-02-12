import { makeAutoObservable, reaction, runInAction } from "mobx";
import type { StateManager } from "../../../StateManager";
import type { ChairColorInfo, ChairInfo } from "../../../../../Types/types";
import { getShapeCategory } from "../../../../../Utils/ShapeCategory";

type ChairOnRectangle = {
  min: number;
  max: number;
  tightFit: number | null;
  comfortFit: number | null;
};
type ChairOnRound = {
  diameter: number;
  tightFit: number | null;
  comfortFit: number | null;
};
type ChairOnSquare = {
  size: number;
  tightFit: number | null;
  comfortFit: number | null;
};
type NumberChair = {
  rectangular: ChairOnRectangle[];
  round: ChairOnRound[];
  square: ChairOnSquare[];
};

export class ChairManager {
  private _libstate: StateManager;

  private _chairInfoDataUrl: string = "api/chairs.json";
  private _chairInfoJson: ChairInfo[] | null = null;
  private _selectedChairName: string | null = null;
  private _selectedChairColorInfoJson: ChairColorInfo[] | null = null;
  private _selectedColor: string | null = null;
  private _numberOfChairs: number = 0;

  private _numberChairDataUrl: string = "api/numberChairs.json";
  private _numberOfChairsInfoJson: NumberChair | null = null;
  private _comfortFit: number | null = 0;
  private _tightFit: number | null = 0;

  //   CHANGE THIS
  private _maximumNumberOfChairs: number = 12;

  constructor(libstate: StateManager) {
    this._libstate = libstate;
    makeAutoObservable(this);
    this.loadNumberChair();
    this.loadChair();
    this.setupChairRecommendationReaction();
  }

  get chairInfoJson() {
    return this._chairInfoJson;
  }

  get selectedChairName() {
    return this._selectedChairName;
  }

  setSelectedChairName(name: string) {
    this._selectedChairName = name;
    const colorsForSelectedChair = this.chairInfoJson?.find(
      (info) => info.name == name,
    );
    if (colorsForSelectedChair) {
      this._selectedChairColorInfoJson = colorsForSelectedChair.colors;
      this._selectedColor = colorsForSelectedChair.colors[0].name;
    }
  }

  get selectedChairColorInfoJson() {
    return this._selectedChairColorInfoJson;
  }

  get selectedColor() {
    return this._selectedColor;
  }

  setSelectedColor(name: string) {
    this._selectedColor = name;
  }

  get numberOfChairs() {
    return this._numberOfChairs;
  }

  setNumberOfChairs(n: number) {
    this._numberOfChairs = n;
  }

  get maximumNumberOfChairs() {
    return this._maximumNumberOfChairs;
  }

  private async loadChair() {
    if (this._chairInfoJson) return;

    const res = await fetch(this._chairInfoDataUrl);
    const json: ChairInfo[] = await res.json();

    runInAction(() => {
      this._chairInfoJson = json;
      this._selectedChairName = json[0].name;
      this._selectedChairColorInfoJson = json[0].colors;
      this._selectedColor = json[0].colors[0].name;
    });
  }

  private async loadNumberChair() {
    if (this._numberOfChairsInfoJson) return;

    const res = await fetch(this._numberChairDataUrl);
    const json: NumberChair = await res.json();

    runInAction(() => {
      this._numberOfChairsInfoJson = json;
    });
  }

  private setupChairRecommendationReaction() {
    reaction(
      () => {
        const designManager = this._libstate.designManager;
        const numberData = this._numberOfChairsInfoJson;

        if (!designManager) return null;

        const dimensionManager = designManager.dimensionManager;
        const topShapeManager = designManager.tableManager.topShapeManager;

        return {
          length: dimensionManager.selectedLength,
          shape: topShapeManager.selectedTopShapeName,
        };
      },
      (data: { length: number; shape: string | null } | null) => {
        if (!this._numberOfChairsInfoJson) return;
        if (!data) return;
        const { length, shape } = data;
        let result = null;
        const category = getShapeCategory(shape);

        if (category === "rectangular") {
          result = this._numberOfChairsInfoJson.rectangular.find(
            (r) => length >= r.min && length <= r.max,
          );
        }

        if (category === "round") {
          result = this._numberOfChairsInfoJson.round.find(
            (r) => r.diameter === length,
          );
        }

        if (category === "square") {
          result = this._numberOfChairsInfoJson.square.find(
            (r) => r.size === length,
          );
        }

        runInAction(() => {
          this._tightFit = result?.tightFit ?? 0;
          this._comfortFit = result?.comfortFit ?? 0;

          // Optional: auto set numberOfChairs to comfort fit
          this._maximumNumberOfChairs = this._tightFit || this._comfortFit || 0;
          if (this._numberOfChairs > this._maximumNumberOfChairs) {
            this._numberOfChairs = this._maximumNumberOfChairs;
          }
        });
      },
    );
  }

  get tightFit() {
    return this._tightFit;
  }

  get comfortFit() {
    return this._comfortFit;
  }
}
