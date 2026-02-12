import { observer } from "mobx-react";
import { useMainContext } from "../../../../hooks/useMainContext";
import { formatLabel } from "../../../../Utils/formatLabel";
import { useMemo, useState } from "react";

const SHAPE_TO_PDF_PAGE: Record<string, number> = {
  rectangle: 1,
  capsule: 2,
  square: 3,
  round: 4,
  oval: 5,
  oblong: 6,
};

const Chair = observer(() => {
  const { designManager } = useMainContext();
  const { chairManager } = designManager;
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const selectedTopShape =
    designManager.tableManager.topShapeManager.selectedTopShapeName ?? "";
  const selectedGuidePage = useMemo(
    () => SHAPE_TO_PDF_PAGE[selectedTopShape] ?? 1,
    [selectedTopShape],
  );

  const data = chairManager.chairInfoJson;

  const colorData = chairManager.selectedChairColorInfoJson;

  const selectChair = (name: string) => {
    chairManager.setSelectedChairName(name);
  };
  const selectedChair = chairManager.selectedChairName;

  const selectColor = (name: string) => {
    chairManager.setSelectedColor(name);
  };
  const selectedColor = chairManager.selectedColor;

  const numberOfChairs = chairManager.numberOfChairs;
  const maximumChairs = chairManager.maximumNumberOfChairs;

  const tightFit = chairManager.tightFit;
  const changeCount = (change: number) => {
    const number = numberOfChairs + change;
    if (number < 0 || number > maximumChairs) {
      chairManager.setNumberOfChairs(
        Math.max(0, Math.min(maximumChairs, number)),
      );
      return;
    }
    if (number % 2 !== 0) {
      chairManager.setNumberOfChairs(number + 1);
      return;
    }
    chairManager.setNumberOfChairs(number);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2 lg:mb-4 pt-5">
        <div className="flex items-center gap-3">
          <h2 className="text-lg lg:text-2xl xl:text-3xl font-semibold text-(--color-title)">
            Wear It With
          </h2>
        </div>
      </div>
      <div>
        <h3 className="text-base lg:text-lg font-semibold mb-3 capitalize text-(--color-font-color) ">
          {tightFit != 0
            ? tightFit == numberOfChairs
              ? "Tight"
              : "Comfortable"
            : "Comfortable"}{" "}
          Seating
        </h3>

        {/* Chair previews */}
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 gap-y-3">
          {data &&
            data.map((chair) => (
              <div key={chair.name}>
                <div
                  className="cursor-pointer relative h-auto md:h-auto lg:h-35 max-h-full lg:max-h-38 mb-2 bg-(--color-grid-bg) p-1 overflow-hidden rounded-2xl"
                  onClick={() => selectChair(chair.name)}
                >
                  <img
                    src={chair.previewUrl}
                    alt={chair.name}
                    className="w-full h-full object-contain rounded-2xl transition-all duration-300 ease-in-out hover:scale-112"
                  />
                  {selectedChair && chair.name == selectedChair && (
                    <div className="absolute top-1 right-1">
                      <div className="w-6.25 lg:w-10 h-6.25 lg:h-10 ">
                        <img
                          src="assets/images/selection-icon.svg"
                          alt="selection-icon"
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-(--color-primary) font-medium text-base mb-2 ">
                  {formatLabel(chair.name)}
                </p>
              </div>
            ))}
        </div>

        {/* Select color and number of chairs */}
        <div className="pt-2">
          <h3 className="text-base lg:text-lg font-semibold mb-3 capitalize text-(--color-font-color) ">
            Select Chair Color
          </h3>

          {/* Color Buttons */}
          <div className="flex space-x-4 mb-5 mt-3">
            {colorData &&
              colorData.map((color) => (
                <div
                  key={color.name}
                  className={`relative w-6.25 lg:w-8 h-6.25 lg:h-8 rounded-full overflow-hidden transition-all duration-300 ease-in-out 
                  ${selectedColor && selectedColor == color.name ? "outline-2 outline-offset-2 outline-(--color-primary)" : ""}  hover:scale-110 cursor-pointer`}
                  onClick={() => selectColor(color.name)}
                  title={color.name}
                >
                  <img
                    src={color.previewUrl}
                    alt={color.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
          </div>

          {/* Select Chair Quantity */}
          <div className="flex gap-3 items-center">
            <h3 className="text-base lg:text-lg font-semibold capitalize text-(--color-font-color) mb-0!">
              Select Chair Quantity
            </h3>
            {/* info icon button for chair arrangement pdf */}
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              aria-label="Open chair size chart"
              className="cursor-pointer text-[20px] md:text-[28px]"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path>
              </svg>
            </button>
          </div>

          {/* chair quantity buttons */}
          <div>
            <div className="flex items-center gap-4 mt-3 rounded-lg bg-(--color-secondary) w-fit border overflow-hidden">
              <button
                disabled={numberOfChairs == 0}
                className="p-1.25 md:p-2 border-none rounded-l-md bg-(--color-primary) text-(--color-secondary) disabled:opacity-40! disabled:cursor-not-allowed! flex justify-center items-center qtyBtn"
                onClick={() => changeCount(-2)}
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="qtyIcon"
                  height="18"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span className="text-base text-center font-semibold w-12.5">
                {numberOfChairs}
              </span>
              <button
                disabled={numberOfChairs >= maximumChairs}
                className="p-1.25 md:p-2 border-none rounded-r-md bg-(--color-primary) text-(--color-secondary) disabled:opacity-40! flex justify-center items-center disabled
                :!cursor-not-allowed qtyBtn"
                onClick={() => changeCount(2)}
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="qtyIcon"
                  height="18"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isGuideOpen && (
        <div className="fixed inset-0 z-[120] bg-black/40 flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl h-[85vh] overflow-hidden">
            <div className="h-12 border-b border-black/10 px-4 flex items-center justify-between">
              <p className="text-sm md:text-base font-semibold text-[var(--color-font)]">
                Chair Size Chart - {formatLabel(selectedTopShape || "default")}
              </p>
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="text-black/70 hover:text-black"
                aria-label="Close chair size chart"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  height="20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z"></path>
                </svg>
              </button>
            </div>
            <iframe
              title="Chair size chart"
              src={`/assets/images/chair_size_chart.pdf#page=${selectedGuidePage}&view=FitH&zoom=page-fit&pagemode=none&toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-[calc(85vh-48px)] border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default Chair;
