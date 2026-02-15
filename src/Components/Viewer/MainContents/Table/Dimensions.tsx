import { observer } from "mobx-react";
import { useMainContext } from "../../../../hooks/useMainContext";

const Dimensions = observer(() => {
  const { designManager } = useMainContext();
  const { dimensionManager } = designManager;
  const maxLength = dimensionManager.maxLength;
  const minLength = dimensionManager.minLength;
  const maxWidth = dimensionManager.maxWidth;
  const minWidth = dimensionManager.minWidth;
  const lengthSliderStep =
    (maxLength - minLength) % dimensionManager.lengthStep === 0
      ? dimensionManager.lengthStep
      : 1;
  const widthSliderStep =
    (maxWidth - minWidth) % dimensionManager.widthStep === 0
      ? dimensionManager.widthStep
      : 1;

  const topShapeName =
    designManager.tableManager.topShapeManager.selectedTopShapeName ?? "";
  const isSquare = topShapeName === "square";
  const isRound = topShapeName === "round";

  const selectedWidth = dimensionManager.selectedWidth;
  const selectedLength = dimensionManager.selectedLength;

  const selectWidth = (width: number) => {
    dimensionManager.setSelectedWidth(width);
  };
  const selectLength = (length: number) => {
    dimensionManager.setSelectedLength(length);
  };

  // For combined slider use the length min/max directly (length/width
  // constraints are synchronized for square/round tops).
  const combinedMin = minLength;
  const combinedMax = maxLength;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 lg:mb-4 ">
        <div className="flex items-center gap-3">
          <h2 className="text-lg lg:text-2xl xl:text-3xl font-semibold text-(--color-title)">
            Dimensions
          </h2>
        </div>
      </div>
      <div>
        <div className="shadow-[0_0_8px_0_rgba(0,0,0,0.16)] flex gap-3 p-2 lg:p-3 items-center mb-6 rounded-lg">
          <i className="fa-solid fa-info bg-(--color-primary) px-2 py-0.5 text-(--color-secondary)"></i>
          <p className="text-xs lg:text-sm lg:text-md text-(--color-font)">
            All table heights are fixed between{" "}
            <span className="text-xs lg:text-base text-(--color-title) font-medium">
              730mm to 750mm
            </span>
          </p>
        </div>
        {/* If the selected top is square or round show a single combined slider */}
        {isSquare || isRound ? (
          <div className="mb-8 lg:mb-10 mt-6">
            <p className="text-base lg:text-[18px] font-semibold mb-4 capitalize text-(--color-title)">
              {isRound ? "Top Diameter" : "Top Size"}
            </p>
            <div className="flex items-center gap-2 lg:gap-4 relative">
              <button
                type="button"
                className="flex items-center justify-center gap-2 dim-btn"
                onClick={() => {
                  dimensionManager.adjustLengthBy(-50);
                  dimensionManager.adjustWidthBy(-50);
                }}
              >
                <i className="fa-solid fa-minus"></i>
              </button>
              <input
                type="range"
                min={combinedMin}
                max={combinedMax}
                step={lengthSliderStep}
                className="flex-1 range-slider dim-range"
                value={Math.round((selectedLength + selectedWidth) / 2)}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  dimensionManager.setSelectedLength(val);
                  dimensionManager.setSelectedWidth(val);
                }}
              />
              <p className="dim-value text-xs lg:text-base">
                {Math.round((selectedLength + selectedWidth) / 2)}mm
              </p>
              <button
                type="button"
                className="flex items-center justify-center gap-2 dim-btn"
                onClick={() => {
                  dimensionManager.adjustLengthBy(50);
                  dimensionManager.adjustWidthBy(50);
                }}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-8 lg:mb-10 mt-6">
            <p className="text-base lg:text-[18px] font-semibold mb-4 capitalize text-(--color-title)">
              Top Length
            </p>
            <div className="flex items-center gap-2 lg:gap-4 relative">
              <button
                type="button"
                className="flex items-center justify-center gap-2 dim-btn"
                onClick={() => {
                  dimensionManager.adjustLengthBy(-100);
                }}
              >
                <i className="fa-solid fa-minus"></i>
              </button>
              <input
                type="range"
                min={minLength}
                max={maxLength}
                step={lengthSliderStep}
                className="flex-1 range-slider dim-range"
                value={selectedLength}
                onChange={(e) => selectLength(Number(e.target.value))}
              />
              <p className="dim-value text-xs lg:text-base">
                {selectedLength}mm
              </p>
              <button
                type="button"
                className="flex items-center justify-center gap-2 dim-btn"
                onClick={() => {
                  dimensionManager.adjustLengthBy(+100);
                }}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        )}
        {/* If combined slider visible above, hide width slider. Otherwise show width. */}
        {!(isSquare || isRound) && (
          <div className="mb-8 lg:mb-10 mt-6">
            <p className="text-base lg:text-[18px] font-semibold mb-4 capitalize text-(--color-title)">
              Top Width
            </p>
            <div className="flex items-center gap-2 lg:gap-4 relative">
              <button
                type="button"
                className="flex items-center justify-center gap-2 dim-btn"
                onClick={() => {
                  dimensionManager.adjustWidthBy(-50);
                }}
              >
                <i className="fa-solid fa-minus"></i>
              </button>
              <input
                type="range"
                min={minWidth}
                max={maxWidth}
                step={widthSliderStep}
                className="flex-1 range-slider dim-range"
                value={selectedWidth}
                onChange={(e) => selectWidth(Number(e.target.value))}
              />
              <p className="dim-value text-xs lg:text-base">
                {selectedWidth}mm
              </p>
              <button
                type="button"
                className="flex items-center justify-center gap-2 dim-btn"
                onClick={() => {
                  dimensionManager.adjustWidthBy(50);
                }}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default Dimensions;
