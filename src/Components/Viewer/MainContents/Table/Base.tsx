import { observer } from "mobx-react";
import { useEffect } from "react";
import { useMainContext } from "../../../../hooks/useMainContext";
import { formatLabel } from "../../../../Utils/formatLabel";

const Base = observer(() => {
  const { designManager } = useMainContext();
  const { tableManager, dimensionManager } = designManager;
  const { baseShapeManager } = tableManager;
  const { baseColorManager } = baseShapeManager;

  useEffect(() => {
    void baseShapeManager.loadBaseShapes();
    void baseColorManager.loadBaseColor();
  }, [baseShapeManager, baseColorManager]);

  const data = baseShapeManager.baseShapeInfo;

  const selectBase = (name: string) => {
    const selectedBaseShapeInfo = data?.find((shape) => shape.name == name);
    if (selectedBaseShapeInfo) {
      if (name == "linea-dome") {
        console.log(name);
        dimensionManager.setMaxWidth(selectedBaseShapeInfo.maxLength);
        dimensionManager.setMinWidth(selectedBaseShapeInfo.minLength);
        // dimensionManager.setSelectedLength(dimensionManager.selectedLength);
        // dimensionManager.setSelectedWidth(dimensionManager.selectedLength);
      } else {
        dimensionManager.setMaxWidth(1300);
        dimensionManager.setMinWidth(800);
      }
      dimensionManager.setMaxLength(selectedBaseShapeInfo.maxLength);
      dimensionManager.setMinLength(selectedBaseShapeInfo.minLength);
      // dimensionManager.setSelectedLength(dimensionManager.maxLength);
      // dimensionManager.setSelectedWidth(dimensionManager.maxWidth);
    }
    baseShapeManager.setSelectedBaseShapeName(name);
  };
  const selectedBase = baseShapeManager.selectedBaseShapeName;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 lg:mb-4 ">
        <div className="flex items-center gap-3">
          <h2 className="text-lg lg:text-2xl xl:text-3xl font-semibold text-[var(--color-title)]">
            Choose Base
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 gap-y-3">
        {data &&
          data.map((item) => (
            <div key={item.name}>
              <div
                className="relative h-auto md:h-auto lg:h-35 max-h-38 mb-2 rounded-2xl overflow-hidden bg-[var(--color-grid-bg)] aspect-[150/140] cursor-pointer"
                onClick={() => selectBase(item.name)}
              >
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className="w-full h-full rounded-2xl transition-all duration-300 ease-in-out hover:scale-112 $ object-contain"
                />

                {selectedBase && item.name == selectedBase && (
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

              <p className="font-medium text-xs md:text-xs lg:text-base mb-1 text-(--color-primary)">
                {formatLabel(item.name)}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
});

export default Base;
