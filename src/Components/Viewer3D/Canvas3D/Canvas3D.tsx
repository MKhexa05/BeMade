import { Canvas } from "@react-three/fiber";
import { observer } from "mobx-react";
import React, { Suspense } from "react";
import Loader from "../Loader/Loader";
import * as THREE from "three";

const Canvas3D = observer(({ children }: { children: React.ReactNode }) => {
  return (
    // <div style={{ position: "relative", width: "100%", height: "100%" }}>
    <Canvas
      className="canvas-3d"
      shadows
      gl={{ preserveDrawingBuffer: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
    >
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </Canvas>
    // </div>
  );
});

export default Canvas3D;
