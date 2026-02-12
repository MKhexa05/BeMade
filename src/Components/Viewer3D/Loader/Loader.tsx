import type { CSSProperties } from "react";
const spinnerStyle: CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: "6px solid rgba(0,0,0,0.08)",
  borderTopColor: "#111",
  animation: "bm-spin 1s linear infinite",
  pointerEvents: "auto",
};

const styleTag = `
@keyframes bm-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

import { Html } from "@react-three/drei";

const Loader = () => {
  return (
    <Html center>
      <style>{styleTag}</style>
      <div style={spinnerStyle} />
    </Html>
  );
};

export default Loader;
