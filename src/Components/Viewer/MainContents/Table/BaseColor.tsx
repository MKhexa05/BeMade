import { observer } from "mobx-react";
import { useMainContext } from "../../../../hooks/useMainContext";
import { useEffect } from "react";
import { formatLabel } from "../../../../Utils/formatLabel";

const BaseColor = observer(() => {
  //   const [data, setData] = useState<baseColorInfo[]>([]);
  const { designManager } = useMainContext();
  const { tableManager } = designManager;
  const { baseShapeManager } = tableManager;
  const { baseColorManager } = baseShapeManager;
  useEffect(() => {
    void baseShapeManager.loadBaseShapes();
    void baseColorManager.loadBaseColor();
  }, [baseShapeManager, baseColorManager]);

  const data = baseColorManager.baseColorInfoJson;
  const selectedColor = baseColorManager.selectedBaseColor;

  const colorsForSelectedShape = baseShapeManager.selectedBaseShapeName
    ? data?.find((color) => {
        return color.name == baseShapeManager.selectedBaseShapeName;
      })?.colors
    : [];

  useEffect(() => {
    if (colorsForSelectedShape && colorsForSelectedShape.length) {
      baseColorManager.setSelectedBaseColor(colorsForSelectedShape[0].name);
    }
  }, [colorsForSelectedShape]);

  const selectBaseColor = (name: string) => {
    baseColorManager.setSelectedBaseColor(name);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2 lg:mb-4 ">
        <div className="flex items-center gap-3">
          <h2 className="text-lg lg:text-2xl xl:text-3xl font-semibold text-[var(--color-title)]">
            Choose Base Colour
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-3">
        {colorsForSelectedShape &&
          colorsForSelectedShape.map((color) => (
            <div key={color.previewUrl}>
              <div
                className="relative h-auto lg:h-25 max-h-28 mb-2 cursor-pointer overflow-hidden rounded-2xl"
                onClick={() => selectBaseColor(color.name)}
              >
                <img
                  src={color.previewUrl}
                  alt={color.name}
                  className="h-full w-full object-cover rounded-2xl cursor-pointer"
                />
                {selectedColor && selectedColor == color.name && (
                  <div className="absolute top-1 right-1">
                    <div className="w-[25px] lg:w-[40px] h-[25px] lg:h-[40px] !w-[25px] !h-[25px]">
                      <img
                        src="assets/images/selection-icon.svg"
                        alt="color-icon"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                )}
              </div>
              <p className="font-medium text-xs md:text-xs lg:text-base mb-1 text-[var(--color-primary)]">
                {formatLabel(color.name ?? "")}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
});

export default BaseColor;
