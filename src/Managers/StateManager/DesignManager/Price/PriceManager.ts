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
  private _priceInfoJson: PricingData | null = null;
  private _priceDataUrl = "api/price.json";
  private _totalPrice = 0;
  private _initPromise: Promise<void> | null = null;
  private _loadPricingPromise: Promise<void> | null = null;

  constructor(libstate: StateManager) {
    this._libstate = libstate;
    makeAutoObservable(this);
    // Compatibility path while callers migrate to explicit init().
    void this.init().catch(() => undefined);
  }

  async init() {
    if (this._priceInfoJson) return;
    if (this._initPromise) return this._initPromise;

    this._initPromise = (async () => {
      await this.loadPricingData();
    })().finally(() => {
      this._initPromise = null;
    });

    return this._initPromise;
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
    if (this._loadPricingPromise) return this._loadPricingPromise;

    this._loadPricingPromise = (async () => {
      const json = await fetch(this._priceDataUrl).then((r) => r.json());

      runInAction(() => {
        this._priceInfoJson = json;
        // console.log(this._priceInfoJson);
      });
    })().finally(() => {
      this._loadPricingPromise = null;
    });

    return this._loadPricingPromise;
  }
}
