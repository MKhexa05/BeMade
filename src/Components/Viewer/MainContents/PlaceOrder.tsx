import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../../../hooks/useMainContext";
import {
  ORDER_PREVIEW_STORAGE_KEY,
  ORDER_SAMPLES_STORAGE_KEY,
} from "../../../Utils/designConfig";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const waitNextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const PlaceOrder = observer(() => {
  const { designManager, design3DManager } = useMainContext();
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    const hasChairs = (designManager.chairManager.numberOfChairs ?? 0) > 0;
    const presetId = hasChairs ? "right_chair" : "right";
    design3DManager.cameraManager.requestPresetAnimation(presetId, {
      durationMs: 900,
    });
    await wait(950);
    await waitNextFrame();
    await waitNextFrame();

    const canvas = (document.querySelector("canvas.canvas-3d") ??
      document.querySelector("canvas")) as HTMLCanvasElement | null;
    if (canvas) {
      try {
        const image = canvas.toDataURL("image/png");
        if (image.startsWith("data:image/")) {
          localStorage.setItem(ORDER_PREVIEW_STORAGE_KEY, image);
        } else {
          localStorage.removeItem(ORDER_PREVIEW_STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(ORDER_PREVIEW_STORAGE_KEY);
      }
    }
    localStorage.removeItem(ORDER_SAMPLES_STORAGE_KEY);
    navigate("/checkout", {
      state: {
        checkoutType: "table",
      },
    });
  };

  return (
    <div className="w-full px-0 lg:px-3">
      <button
        type="button"
        onClick={handlePlaceOrder}
        className="flex items-center justify-center gap-2 rounded-md border border-[var(--color-border-color)] 
        bg-[var(--color-secondary)] text-[var(--color-font)] 
        hover:bg-[var(--color-primary)] hover:text-[var(--color-secondary)] 
        transition-all duration-300 ease-in-out disabled:!cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent px-6 py-2 md:py-3 text-md md:text-base base:text-lg !font-semibold w-full !bg-[var(--color-primary)] text-[var(--color-secondary)] uppercase mt-3 lg:mt-[15px] mb-0 text-bold !rounded-[99px] hover:scale-95 disabled:hover:scale-100"
      >
        <span>Place Order</span>
      </button>
    </div>
  );
});

export default PlaceOrder;
