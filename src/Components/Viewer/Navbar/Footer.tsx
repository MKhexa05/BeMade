import { observer } from "mobx-react";
import { useMainContext } from "../../../hooks/useMainContext";
import { formatLabel } from "../../../Utils/formatLabel";

const Footer = observer(() => {
  const { designManager } = useMainContext();
  const { tableManager } = designManager;
  const { chairManager } = designManager;
  const { dimensionManager } = designManager;
  return (
    <div className="flex [box-shadow:0px_1px_8px_0px_#00000029] gap-4 items-center p-3 px-6 justify-center">
      <div className="flex justify-between items-center w-full">
        <div>
          <label className="text-xs text-[var(--color-font-color)] mb-2">
            Your Build
          </label>
          <p className="text-[var(--color-primary)] text-base">Dining Table</p>
        </div>

        {/* Table Top Color */}
        <div>
          <label className="text-xs text-[var(--color-font-color)] mb-2">
            Table Top
          </label>
          <p className="text-[var(--color-primary)] text-base">
            {formatLabel(tableManager.topColorManager.selectedTopColor ?? "")}
          </p>
        </div>
        {/* Table Base Shape*/}
        <div>
          <label className="text-xs text-[var(--color-font-color)] mb-2">
            Table Base
          </label>
          <p className="text-[var(--color-primary)] text-base">
            {formatLabel(
              tableManager.baseShapeManager.selectedBaseShapeName ?? "",
            )}
          </p>
        </div>
        {/* Table Base Color */}
        <div>
          <label className="text-xs text-[var(--color-font-color)] mb-2">
            Table Base Colour
          </label>
          <p className="text-[var(--color-primary)] text-base">
            {formatLabel(
              tableManager.baseShapeManager.baseColorManager
                .selectedBaseColor ?? "",
            )}
          </p>
        </div>

        {/* DIMENSIONS */}
        <div>
          <label className="text-xs text-[var(--color-font-color)] mb-2">
            Dimensions (mm)
          </label>
          <p className="text-[var(--color-primary)] text-base">
            {dimensionManager.selectedLength}×{dimensionManager.selectedWidth}
          </p>
        </div>
        {/* Table Top Shape */}
        <div>
          <label className="text-xs text-[var(--color-font-color)] mb-2">
            Table Top Shape
          </label>
          <p className="text-[var(--color-primary)] text-base">
            {formatLabel(
              tableManager.topShapeManager.selectedTopShapeName ?? "",
            )}
          </p>
        </div>

        {/* Chair Type */}
        <div>
          <label className="text-xs text-[var(--color-font-color)] mb-2">
            Chair Style
          </label>
          <p className="text-[var(--color-primary)] text-base">
            {chairManager.numberOfChairs
              ? formatLabel(chairManager.selectedChairName ?? "")
              : "N/A"}
          </p>
        </div>

        {/* Chair Color */}
        <div>
          <label className="text-xs text-[var(--color-font-color)] mb-2">
            Chair Color
          </label>
          <p className="text-[var(--color-primary)] text-base">
            {chairManager.numberOfChairs
              ? formatLabel(chairManager.selectedColor ?? "")
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
});

export default Footer;
