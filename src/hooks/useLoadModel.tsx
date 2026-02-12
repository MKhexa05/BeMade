import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";

const useLoadModel = (url: string) => {
  const gltf = useGLTF(url);
  return gltf;
};

export default useLoadModel;
