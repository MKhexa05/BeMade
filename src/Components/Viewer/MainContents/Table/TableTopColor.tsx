import { observer } from "mobx-react";
import { useEffect } from "react";
import { useMainContext } from "../../../../hooks/useMainContext";
import { formatLabel } from "../../../../Utils/formatLabel";

const TableTopColor = observer(() => {
  const { designManager } = useMainContext();
  const { tableManager } = designManager;
  const { topColorManager } = tableManager;

  useEffect(() => {
    void topColorManager.loadTopColors();
  }, [topColorManager]);

  const data = topColorManager.topColorInfoJson;

  const selectTopColor = (name: string) => {
    topColorManager.setSelectedTopColor(name);
  };

  const selectedTopColor = topColorManager.selectedTopColor;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 lg:mb-4 ">
        <div className="flex items-center gap-3">
          <h2 className="text-lg lg:text-2xl xl:text-3xl font-semibold text-[var(--color-title)]">
            Choose Table Top
          </h2>
        </div>
      </div>
      <div>
        {data &&
          data.map((type) => (
            <div className="mb-3 lg:mb-6 last:mb-0" key={type.type}>
              <h3 className="text-md lg:text-xl font-semibold mb-3 capitalize text-[var(--color-primary)] border border-[var(--color-stroke)] w-fit px-2 rounded-md">
                {type.type}
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 gap-y-3">
                {type.colors.map((color) => (
                  <div key={color.name}>
                    <div
                      className="relative h-auto md:h-auto lg:h-35 max-h-38 mb-2 cursor-pointer overflow-hidden rounded-2xl aspect-[150/140]"
                      onClick={() => selectTopColor(color.name)}
                    >
                      <img
                        src={color.previewUrl}
                        alt="Amani Grey"
                        className="w-full h-full object-cover rounded-2xl transition-all duration-300 ease-in-out hover:scale-112"
                      />
                      {selectedTopColor && selectedTopColor == color.name && (
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
                      {formatLabel(color.name)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
});
export default TableTopColor;
