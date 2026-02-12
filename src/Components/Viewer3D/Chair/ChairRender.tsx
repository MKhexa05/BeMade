import * as THREE from "three";
import { observer } from "mobx-react";
import { useMainContext } from "../../../hooks/useMainContext";

type ChairRendererProps = {
  chairModel: THREE.Group<THREE.Object3DEventMap>;
};

const ChairRender = observer(({ chairModel }: ChairRendererProps) => {
  const { designManager } = useMainContext();
  const { chairManager } = designManager;

  const numberOfChairs = chairManager.numberOfChairs;

  return Array.from({ length: numberOfChairs }).map((_, i) => {
    const angle = (i / numberOfChairs) * Math.PI * 2;
    const sign = i % 2 ? 1 : -1;    

    return (
      <group
        key={i}
        position={[0, 0, sign * 0.8]}
        rotation={[0, -angle, 0]}
      >
        <primitive object={chairModel.clone(true)} />
      </group>
    );
  });
});

export default ChairRender;
