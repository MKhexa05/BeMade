import { makeAutoObservable, runInAction } from "mobx";
import type { StateManager } from "../../StateManager";

type RectanglePrice = {
  min: number;
  max: number;
  price: number;
};

type FixedPrice = {
  size: number;
  price: number;
};

type PricingData = {
  rectangular: RectanglePrice[];
  square: FixedPrice[];
  round: FixedPrice[];
};

export class PriceManager {
  private _libstate: StateManager;
  private _priceInfoJson: PricingData;
  private _priceDataUrl = "api/price.json";
  private _totalPrice = 0;

  constructor(libstate: StateManager) {
    this._libstate = libstate;
    this.loadPricingData();
    makeAutoObservable(this);
  }

  getPrice(
    shape: "rectangular" | "square" | "round",
    length: number,
  ): number | null {
    if (this._priceInfoJson) {
      if (shape === "rectangular") {
        const rule = this._priceInfoJson.rectangular.find(
          (r) => length >= r.min && length <= r.max,
        );
        return rule?.price ?? null;
      }

      const rule = this._priceInfoJson[shape].find((r) => r.size === length);
      return rule?.price ?? null;
    }
    return null;
  }

  setTotalPrice(price: number) {
    this._totalPrice = price;
  }

  get totalPrice() {
    return this._totalPrice;
  }

  async loadPricingData() {
    if (this._priceInfoJson) return;

    const json = await fetch(this._priceDataUrl).then((r) => r.json());

    runInAction(() => {
      this._priceInfoJson = json;
      // console.log(this._priceInfoJson);
    });
  }
}
