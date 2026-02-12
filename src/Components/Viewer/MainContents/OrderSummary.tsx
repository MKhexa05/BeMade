import { observer } from "mobx-react";
import { useMainContext } from "../../../hooks/useMainContext";
import { formatLabel } from "../../../Utils/formatLabel";

type OrderSummaryProps = {
  mode?: "table" | "samples";
  sampleNames?: string[];
};

const OrderSummary = observer(
  ({ mode = "table", sampleNames = [] }: OrderSummaryProps) => {
  const { designManager } = useMainContext();
  const { tableManager, chairManager, priceManager, dimensionManager } =
    designManager;

  const tableTopLength = dimensionManager.selectedLength;
  const numberOfChairs = chairManager.numberOfChairs;
  const tablePrice = priceManager.getPrice("rectangular", tableTopLength) ?? 0;
  const chairPrice = numberOfChairs * 100;
  const samplePrice = sampleNames.length * 20;
  const totalPrice =
    mode === "samples" ? samplePrice : chairPrice + tablePrice + samplePrice;
  priceManager.setTotalPrice(totalPrice);

  return (
    <div>
      <div className="flex items-center justify-between mb-2 lg:mb-4 ">
        <div className="flex items-center gap-3">
          <h2 className="relative inline-block text-lg lg:text-2xl xl:text-3xl font-semibold text-[var(--color-title)]">
            BeMade
            <span className="absolute text-[8px] lg:text-xs top-0 -right-5">
              TM
            </span>
          </h2>
        </div>
      </div>
      <div>
        <div className="flex items-center mb-3 lg:mb-5">
          <p className="uppercase text-[var(--color-font)] text-xs px-4 pl-0">
            Your Design
          </p>
          <p className="uppercase text-[var(--color-font)] text-xs px-4 border-l">
            Our Perfection
          </p>
        </div>
        <div className="mb-2 lg:mb-1 border-t border-[var(--color-stroke)]">
          <h2 className="text-[--color-title] uppercase text-base lg:text-xl py-2 lg:py-4 pb-0 font-medium">
            {mode === "samples" ? "Your Samples" : "Your Build"}
          </h2>
        </div>
        {mode !== "samples" && (
          <>
            <div className="mb-2 lg:mb-3 py-2 border-b border-[var(--color-stroke)] flex justify-between">
              <label className="text-xs lg:text-sm text-[var(--color-primary)]">
                Table Top
              </label>
              <p className="text-xs lg:text-sm text-right">
                {formatLabel(tableManager.topColorManager.selectedTopColor ?? "")}
              </p>
            </div>
            <div className="mb-2 lg:mb-3 py-2 border-b border-[var(--color-stroke)] flex justify-between">
              <label className="text-xs lg:text-sm text-[var(--color-primary)]">
                Base
              </label>
              <p className="text-xs lg:text-sm text-right">
                {formatLabel(tableManager.baseShapeManager.selectedBaseShapeName ?? "")}
              </p>
            </div>
            <div className="mb-2 lg:mb-3 py-2 border-b border-[var(--color-stroke)] flex justify-between">
              <label className="text-xs lg:text-sm text-[var(--color-primary)]">
                Base Colour
              </label>
              <p className="text-xs lg:text-sm text-right">
                {formatLabel(
                  tableManager.baseShapeManager.baseColorManager.selectedBaseColor ??
                    "",
                )}
              </p>
            </div>
            <div className="mb-2 lg:mb-3 py-2 border-b border-[var(--color-stroke)] flex justify-between">
              <label className="text-xs lg:text-sm text-[var(--color-primary)]">
                Dimensions
              </label>
              <p className="text-xs lg:text-sm text-right">
                Length: {dimensionManager.selectedLength} mm x Width:{" "}
                {dimensionManager.selectedWidth} mm
              </p>
            </div>
            <div className="mb-2 lg:mb-3 py-2 border-b border-[var(--color-stroke)] flex justify-between">
              <label className="text-xs lg:text-sm text-[var(--color-primary)]">
                Table Top Shape
              </label>
              <p className="text-xs lg:text-sm text-right">
                {formatLabel(tableManager.topShapeManager.selectedTopShapeName ?? "")}
              </p>
            </div>
            <div className="mb-2 lg:mb-3 py-2 border-b border-[var(--color-stroke)] flex justify-between">
              <label className="text-xs lg:text-sm text-[var(--color-primary)]">
                Chair Type
              </label>
              <p className="text-xs lg:text-sm text-right">
                {chairManager.numberOfChairs
                  ? formatLabel(chairManager.selectedChairName ?? "")
                  : "N/A"}
              </p>
            </div>
            <div className="mb-2 lg:mb-3 py-2 border-b border-[var(--color-stroke)] flex justify-between">
              <label className="text-xs lg:text-sm text-[var(--color-primary)]">
                Chair Colour
              </label>
              <p className="text-xs lg:text-sm text-right">
                {chairManager.numberOfChairs
                  ? formatLabel(chairManager.selectedColor ?? "")
                  : "N/A"}
              </p>
            </div>
            <div className="mb-2 lg:mb-3 py-2 border-b border-[var(--color-stroke)] flex justify-between">
              <label className="text-xs lg:text-sm text-[var(--color-primary)]">
                Chair Quantity
              </label>
              <p className="text-xs lg:text-sm text-right">
                {chairManager.numberOfChairs}
              </p>
            </div>
          </>
        )}
        {mode === "samples" && (
          <>
            <div className="mb-2 lg:mb-3 py-2 border-b border-[var(--color-stroke)] flex justify-between">
              <label className="text-xs lg:text-sm text-[var(--color-primary)]">
                Samples Selected
              </label>
              <p className="text-xs lg:text-sm text-right">{sampleNames.length}</p>
            </div>
            <div className="mb-2 lg:mb-3 py-2 border-b border-[var(--color-stroke)] flex justify-between">
              <label className="text-xs lg:text-sm text-[var(--color-primary)]">
                Samples Total
              </label>
              <p className="text-xs lg:text-sm text-right">{`GBP ${samplePrice}.00`}</p>
            </div>
          </>
        )}

        <div className="space-y-2">
          <div className="bg-[#f9f9f9] p-3 lg:p-4 rounded-2xl mt-4 lg:mt-6">
            {mode !== "samples" && (
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs lg:text-sm text-[var(--color-primary)] font-medium">
                  Dining Table
                </p>
                <p className="text-xs lg:text-sm text-[var(--color-font-color)] font-medium">
                  {`GBP ${tablePrice}.00`}
                </p>
              </div>
            )}
            {mode !== "samples" && (
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs lg:text-sm text-[var(--color-primary)] font-medium">
                  Chairs
                </p>
                <p className="text-xs lg:text-sm text-[var(--color-font-color)] font-medium">
                  {`GBP ${chairPrice}.00`}
                </p>
              </div>
            )}
            {!!sampleNames.length && mode !== "table" && (
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs lg:text-sm text-[var(--color-primary)] font-medium">
                  Samples ({sampleNames.length} x GBP 20)
                </p>
                <p className="text-xs lg:text-sm text-[var(--color-font-color)] font-medium">
                  {`GBP ${samplePrice}.00`}
                </p>
              </div>
            )}
            <div className="border-t border-[var(--color-stroke)] mt-2 pt-2 flex justify-between items-center">
              <p className="text-base lg:text-lg text-[var(--color-primary)] font-medium">
                Total
              </p>
              <p className="text-xs lg:text-sm text-[var(--color-font-color)] font-medium">
                {`GBP ${totalPrice}.00`}
              </p>
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--color-font)] mt-4 lg:mt-6 mb-3 lg:mb-5 font-medium w-fit py-3 px-3 bg-[#E2E8F0] rounded-[25px] leading-relaxed">
              <p className="font-semibold">Estimated Delivery:</p>
              <p className="py-2">
                Our products are all unique, made to order and this takes some
                time in our factory.
              </p>
              <p>
                Once your order has been made, we will notify and arrange
                delivery with you. Currently the estimated delivery times are
                within <span className="font-semibold">14-21 days.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default OrderSummary;
