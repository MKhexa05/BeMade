import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";
import { useMainContext } from "../../../hooks/useMainContext";

type AnimationState = {
  running: boolean;
  elapsed: number;
  duration: number;
  startPos: Vector3;
  startTarget: Vector3;
  endPos: Vector3;
  endTarget: Vector3;
  endZoom: number | null;
};

const easeSmoothSlowEnd = (t: number) => {
  const smooth = t * t * (3 - 2 * t); // smoothstep
  return 1 - Math.pow(1 - smooth, 4);
};

const CameraAnimator = () => {
  const { design3DManager } = useMainContext();
  const cameraManager = design3DManager.cameraManager;
  const lastRequestIdRef = useRef(0);
  const stateRef = useRef<AnimationState>({
    running: false,
    elapsed: 0,
    duration: 10.8,
    startPos: new Vector3(),
    startTarget: new Vector3(),
    endPos: new Vector3(),
    endTarget: new Vector3(),
    endZoom: null,
  });

  useFrame((_, delta) => {
    const controls = cameraManager.controls;
    if (!controls) return;

    const request = cameraManager.animationRequest;
    if (request && request.id !== lastRequestIdRef.current) {
      lastRequestIdRef.current = request.id;

      const currentPos = controls.camera.position.clone();
      const currentTarget = new Vector3();
      controls.getTarget(currentTarget);

      stateRef.current = {
        running: true,
        elapsed: 0,
        duration: request.durationMs / 1000,
        startPos: currentPos,
        startTarget: currentTarget,
        endPos: new Vector3(...request.preset.position),
        endTarget: new Vector3(...request.preset.target),
        endZoom:
          typeof request.preset.zoom === "number" ? request.preset.zoom : null,
      };
    }

    const state = stateRef.current;
    if (!state.running) {
      return;
    }

    state.elapsed += Math.min(delta, 0.05);
    const t = Math.min(1, state.elapsed / state.duration);
    const e = easeSmoothSlowEnd(t);
    const pos = state.startPos.clone().lerp(state.endPos, e);
    const target = state.startTarget.clone().lerp(state.endTarget, e);

    void controls.setLookAt(
      pos.x,
      pos.y,
      pos.z,
      target.x,
      target.y,
      target.z,
      false,
    );

    if (t >= 1) {
      state.running = false;
      if (state.endZoom !== null) {
        void controls.zoomTo(state.endZoom, false);
      }
    }
  });

  return null;
};

export default CameraAnimator;
