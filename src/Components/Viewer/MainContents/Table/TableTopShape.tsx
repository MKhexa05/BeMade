import { observer } from "mobx-react";
import { useMainContext } from "../../../../hooks/useMainContext";
import { formatLabel } from "../../../../Utils/formatLabel";

const TableTopShape = observer(() => {
  const { designManager } = useMainContext();
  const { tableManager } = designManager;
  const { topShapeManager, baseShapeManager } = tableManager;

  const data = topShapeManager.topshapeInfoJson;

  const selectedBaseName = baseShapeManager.selectedBaseShapeName;
  const selectedBase = baseShapeManager.baseShapeInfo?.find(
    (shape) => shape.name == selectedBaseName,
  );

  const availableTopShapes = selectedBase?.available_topShape ?? [];
  const selectTopShape = (name: string) => {
    topShapeManager.setSelectedTopShapeName(name);
  };

  const selectedTopShape = topShapeManager.selectedTopShapeName;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 lg:mb-4 ">
        <div className="flex items-center gap-3">
          <h2 className="text-lg lg:text-2xl xl:text-3xl font-semibold text-[var(--color-title)]">
            Choose Table Top Shape
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 gap-y-3">
        {data &&
          data.map((shape) => {
            const isDisabled = !availableTopShapes.includes(shape.name);
            return (
              <div key={shape.name}>
                <div
                  aria-disabled={isDisabled}
                  className={`relative h-auto md:h-auto lg:h-35 max-h-38 mb-2 rounded-2xl overflow-hidden bg-[var(--color-grid-bg)] aspect-[150/140] cursor-pointer
                  ${isDisabled ? "hover:cursor-not-allowed opacity-40" : ""}
                `}
                  onClick={() => {
                    if (isDisabled) return;
                    selectTopShape(shape.name);
                  }}
                >
                  <img
                    src={shape.previewUrl}
                    alt={shape.name}
                    className="w-full h-full rounded-2xl transition-all duration-300 ease-in-out hover:scale-112 $ object-cover"
                  />
                  {/* Selected icon */}
                  {selectedTopShape && selectedTopShape == shape.name && (
                    <div className="absolute top-1 right-1">
                      <div className="w-[25px] lg:w-[40px] h-[25px] lg:h-[40px] ">
                        <img
                          src="/assets/images/selection-icon.svg"
                          alt="selection-icon"
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <p className="font-medium text-xs md:text-xs lg:text-base mb-1 text-[var(--color-primary)]">
                  {formatLabel(shape.name)}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
});

export default TableTopShape;
