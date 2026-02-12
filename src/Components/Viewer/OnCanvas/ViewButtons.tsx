import { observer } from "mobx-react";
import { useCameraPresetWorkflow } from "./hooks/useCameraPresetWorkflow";

const ViewButtons = observer(() => {
  const { presets, activeIndex, applyByIndex } = useCameraPresetWorkflow();

  const dotClass = (index: number) =>
    `w-[13px] h-[13px] rounded-full cursor-pointer transition-transform duration-200 ${
      index === activeIndex
        ? "bg-[var(--color-font)] scale-110"
        : "bg-[var(--color-secondary)] hover:scale-110"
    }`;

  return (
    <div className="absolute left-1/2 bottom-3 lg:bottom-5 translate-x-[-50%]">
      <div className="flex items-end gap-2 lg:gap-3">
        <button
          type="button"
          onClick={() => applyByIndex(activeIndex - 1)}
          className="flex items-center justify-center gap-2 rounded-md border border-[var(--color-border-color)] bg-[var(--color-secondary)] text-[var(--color-font)] hover:bg-[var(color-primary)] hover:text-[var(--color-secondary)] transition-all duration-300 ease-in-out disabled:!cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent bg-transparent hover:bg-transparent hover:!text-[var(--color-font)] border-none p-[5px] md:p-0 hover:scale-120 disabled:hover:scale-100"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="30"
            width="30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"></path>
          </svg>
        </button>
        <div className="h-[30px] hidden lg:flex items-center">
          <div className="flex items-center gap-[16px]">
            {presets.map((preset, idx) => (
              <div key={preset.id} className="relative group">
                <button
                  type="button"
                  className={dotClass(idx)}
                  onClick={() => applyByIndex(idx)}
                  aria-label={preset.label}
                  title={preset.label}
                />
                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 whitespace-nowrap rounded-md bg-black/85 px-2 py-1 text-[11px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  {preset.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => applyByIndex(activeIndex + 1)}
          className="flex items-center justify-center gap-2 rounded-md border border-[var(--color-border-color)] 
        bg-[var(--color-secondary)] text-[var(--color-font)] 
        hover:bg-[var(--color-primary)] hover:text-[var(--color-secondary)] 
        transition-all duration-300 ease-in-out disabled:!cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent bg-transparent hover:bg-transparent hover:!text-[var(--color-font)] border-none p-[5px] md:p-0 hover:scale-120 disabled:hover:scale-100"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="30"
            width="30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
});

export default ViewButtons;
