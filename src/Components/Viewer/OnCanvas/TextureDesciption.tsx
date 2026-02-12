import { observer } from "mobx-react";
import { useMemo, useState } from "react";
import { useMainContext } from "../../../hooks/useMainContext";
import { formatLabel } from "../../../Utils/formatLabel";

const TextureDesciption = observer(() => {
  const { designManager } = useMainContext();
  const { topColorManager } = designManager.tableManager;
  const [isOpen, setIsOpen] = useState(false);

  const selectedTopColor = topColorManager.selectedTopColor;
  const selectedTopColorInfo = useMemo(() => {
    if (!selectedTopColor) return null;
    for (const group of topColorManager.topColorInfoJson ?? []) {
      const color = group.colors.find((entry) => entry.name === selectedTopColor);
      if (color) return { color, type: group.type };
    }
    return null;
  }, [topColorManager.topColorInfoJson, selectedTopColor]);

  const title = selectedTopColor ? formatLabel(selectedTopColor) : "Top Color";
  const finish = selectedTopColorInfo?.type ?? "N/A";
  const description =
    selectedTopColorInfo?.color.description ??
    "Select a top color to view texture details.";

  return (
    <div className="absolute left-3 lg:left-5 bottom-3 lg:bottom-5 z-50">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Hide texture info" : "Show texture info"}
          aria-expanded={isOpen}
          className={`flex items-center justify-center w-[34px] h-[34px] rounded-md border border-[var(--color-border-color)] bg-white/90 text-[var(--color-font)] shadow-md hover:scale-105 transition-transform ${
            isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="18"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M256 56C145.9 56 56 145.9 56 256s89.9 200 200 200 200-89.9 200-200S366.1 56 256 56zm0 72c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24zm32 272h-64c-8.8 0-16-7.2-16-16s7.2-16 16-16h16v-96h-16c-8.8 0-16-7.2-16-16s7.2-16 16-16h48c8.8 0 16 7.2 16 16v112h16c8.8 0 16 7.2 16 16s-7.2 16-16 16z"></path>
          </svg>
        </button>

        <div
          className={`${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          } absolute left-0 bottom-0 transition-all duration-200 ease-in-out`}
        >
          <div className="w-[320px] md:w-[430px] p-3 lg:p-4 py-3 bg-white 2xl:bg-white/60 rounded-2xl shadow-lg backdrop-blur-sm">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close texture info"
                className="absolute top-1 right-0 text-gray-600 hover:text-black"
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
              <p className="text-[var(--color-primary)] font-semibold text-base md:text-lg mb-2 capitalize">
                {title}
              </p>
              <p className="text-[var(--color-font)] font-semibold text-xs lg:text-sm bg-[var(--color-grid-bg)] 2xl:bg-[var(--color-secondary)] px-3 py-1 rounded-[33px] mb-2 w-fit capitalize">
                {finish}
              </p>
              <p className="text-[var(--color-font)] text-xs lg:text-sm line-clamp-3 md:line-clamp-2 leading-normal">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TextureDesciption;
