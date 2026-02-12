import * as THREE from "three";
import { useThree, useLoader } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useEffect } from "react";

function MyEnvironment() {
  const { scene } = useThree();
  const texture = useLoader(
    THREE.TextureLoader,
    "/assets/images/background/background.svg",
  );
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    scene.background = texture;
  }, [scene, texture]);



  return <Environment preset="studio" environmentIntensity={0.2}/>;
}
export default MyEnvironment;
