import { useGLTF } from "@react-three/drei";
import { observer } from "mobx-react";
import Loader from "../Loader/Loader";
import type { BaseColor } from "../../../Types/types";
import { BaseTextureLayer } from "./BaseTexture";
import { BaseGeometryLayer } from "./BaseGeometry";
import { prepareBaseModel } from "./prepareBaseModel";
import { useMemo } from "react";

type ModelProps = {
  modelUrl: string;
  textureUrl: BaseColor;
};

const BaseModel = observer(({ modelUrl, textureUrl }: ModelProps) => {
  // BaseModel.tsx

  const gltf = useGLTF(modelUrl);

  // 🔥 PREPARE ONCE PER MODEL
  const preparedModel = useMemo(() => {
    if (!gltf.scene) return null;
    return prepareBaseModel(gltf.scene);
  }, [modelUrl, gltf]);

  if (!preparedModel) return null;

  return (
    <BaseTextureLayer textureUrl={textureUrl}>
      {(textures) => (
        <>
          <BaseGeometryLayer
            preparedModel={preparedModel}
            textures={textures}
          />
         {textures.loading && <Loader />}
        </>
      )}
    </BaseTextureLayer>
  );
});

export default BaseModel;
