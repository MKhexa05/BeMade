import { useEffect, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useMainContext } from "../../../../hooks/useMainContext";
import type { TopColor, TopColorInfo } from "../../../../Types/types";
import { useNavigate } from "react-router-dom";
import {
  ORDER_SAMPLES_STORAGE_KEY,
  buildSampleCheckoutContext,
  saveCheckoutContext,
} from "../../../../Utils/designConfig";

const formatName = (value: string) =>
  value.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

type OrderSampleProps = {
  isOpen: boolean;
  onClose: () => void;
};

type HoverMeta = {
  color: TopColor;
  side: "right" | "left";
};

const OVERLAY_WIDTH = 260;
const OVERLAY_GAP = 12;

const OrderSample = observer(({ isOpen, onClose }: OrderSampleProps) => {
  const { designManager } = useMainContext();
  const topColorManager = designManager.tableManager.topColorManager;
  const [hovered, setHovered] = useState<HoverMeta | null>(null);
  const [selectedSampleNames, setSelectedSampleNames] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setSelectedSampleNames([]);
      setHovered(null);
    }
  }, [isOpen]);

  const groups = useMemo<TopColorInfo[]>(() => {
    return topColorManager.topColorInfoJson ?? [];
  }, [topColorManager.topColorInfoJson]);

  const selectedSamples = useMemo(() => {
    const allColors = groups.flatMap((group) => group.colors);
    return selectedSampleNames
      .map((name) => allColors.find((color) => color.name === name))
      .filter((color): color is TopColor => !!color);
  }, [groups, selectedSampleNames]);

  if (!isOpen) return null;

  const toggleSample = (name: string) => {
    setSelectedSampleNames((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  const handleBuyNow = () => {
    if (!selectedSamples.length) return;
    const sampleItems = selectedSamples.map((item) => ({
      name: item.name,
      previewUrl: item.samplePreviewUrl ?? item.previewUrl,
    }));
    const payload = {
      unitPrice: 20,
      names: sampleItems.map((item) => item.name),
      samples: sampleItems,
    };
    const checkoutContext = buildSampleCheckoutContext(sampleItems);
    localStorage.setItem(ORDER_SAMPLES_STORAGE_KEY, JSON.stringify(payload));
    saveCheckoutContext(checkoutContext);
    onClose();
    navigate("/checkout", {
      state: checkoutContext,
    });
  };

  const handleHover = (color: TopColor, target: HTMLButtonElement | null) => {
    if (!target) {
      setHovered(null);
      return;
    }
    const rect = target.getBoundingClientRect();
    const bounds = modalRef.current?.getBoundingClientRect();
    const rightEdge = bounds?.right ?? window.innerWidth;
    const leftEdge = bounds?.left ?? 0;
    const fitsRight = rect.right + OVERLAY_WIDTH + OVERLAY_GAP < rightEdge;
    const fitsLeft = rect.left - OVERLAY_WIDTH - OVERLAY_GAP > leftEdge;
    const side: "right" | "left" = fitsRight ? "right" : "left";
    setHovered({ color, side: fitsRight || !fitsLeft ? side : "left" });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 px-3">
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between bg-black text-white px-5 py-3">
          <p className="font-semibold">Order Samples</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order samples"
            className="text-white/80 hover:text-white"
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

        <div className="relative flex flex-col h-[calc(80vh-52px)]">
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="bg-gray-100 rounded-xl p-4 mb-5">
              <p className="font-semibold mb-2">Sample Pricing</p>
              <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>A pair of samples costs GBP 20.</li>
                <li>Ordering just one sample is also GBP 20.</li>
                <li>
                  For more than two samples, it costs GBP 20 for every
                  additional pair. A single extra sample also counts as a full
                  pair.
                </li>
                <li>Please select your samples below:</li>
              </ul>
            </div>

            {groups.map((group) => (
              <div key={group.type} className="mb-6">
                <p className="font-semibold mb-3 capitalize">
                  {formatName(group.type)}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {group.colors.map((color) => (
                    <button
                      key={`${group.type}-${color.name}`}
                      type="button"
                      onClick={() => toggleSample(color.name)}
                      onMouseEnter={(event) =>
                        handleHover(color, event.currentTarget)
                      }
                      onMouseLeave={() => setHovered(null)}
                      className={`relative rounded-xl overflow-visible shadow-sm bg-white border hover:scale-[1.02] transition-transform ${
                        hovered?.color.name === color.name ? "z-30" : ""
                      } ${
                        selectedSampleNames.includes(color.name)
                          ? "border-black ring-2 ring-black/20"
                          : "border-black/5"
                      }`}
                    >
                      <div className="rounded-xl overflow-hidden">
                        <img
                          src={color.samplePreviewUrl ?? color.previewUrl}
                          alt={color.name}
                          className="w-full h-[70px] md:h-[80px] object-cover"
                        />
                        {selectedSampleNames.includes(color.name) && (
                          <div className="absolute top-1 right-1 z-20 w-6 h-6">
                            <img
                              src="/assets/images/selection-icon.svg"
                              alt="selected"
                              className="w-full h-full"
                            />
                          </div>
                        )}
                      </div>
                      {hovered?.color.name === color.name && (
                        <div
                          className={`hidden lg:block absolute top-1/2 -translate-y-1/2 z-40 pointer-events-none ${
                            hovered.side === "right"
                              ? "left-full ml-3"
                              : "right-full mr-3"
                          }`}
                          style={{ width: OVERLAY_WIDTH }}
                        >
                          <div className="bg-white rounded-2xl shadow-xl border border-black/10 p-3">
                            <div className="rounded-xl overflow-hidden">
                              <img
                                src={color.samplePreviewUrl}
                                alt={color.name}
                                className="w-full object-cover"
                              />
                            </div>
                            <div className="pt-2 text-left">
                              <p className="text-sm font-semibold">
                                {formatName(color.name)}
                              </p>
                              <p className="text-xs text-gray-600">
                                Sample texture preview.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {!groups.length && (
              <p className="text-sm text-gray-600">Loading textures...</p>
            )}
          </div>

          <div className="sticky bottom-0 z-10 bg-white border-t p-4 flex justify-end">
            <button
              type="button"
              disabled={!selectedSamples.length}
              onClick={handleBuyNow}
              className="flex items-center gap-2 rounded-full bg-gray-200 text-gray-600 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed enabled:bg-black enabled:text-white"
            >
              Buy Now
              <span aria-hidden>&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default OrderSample;
