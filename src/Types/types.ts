export type BaseShapeInfo = {
  name: string;
  previewUrl: string;
  modelUrl: string;
  available_topShape: string[];
  maxLength: number;
  minLength: number;
};

export type BaseColorInfo = {
  name: string;
  colors: BaseColor[];
};

export type BaseColor = {
  name: string;
  colorUrl: string;
  metalnessUrl: string;
  normalUrl: string;
  previewUrl: string;
  roughnessUrl: string;
  thumbnailUrl: string;
};

export type TopShapeInfo = {
  name: string;
  previewUrl: string;
  modelUrl: string;
  modelMDFUrl: string;
};

export type TopColorInfo = {
  type: string;
  colors: TopColor[];
};

export type TopColor = {
  name: string;
  description?: string;
  colorUrl: string;
  mdfColorUrl: string;
  metalnessUrl: string;
  normalUrl: string;
  previewUrl: string;
  roughnessUrl: string;
  samplePreviewUrl: string;
  modelUrl: string;
};

export type ChairInfo = {
  name: string;
  previewUrl: string;
  modelUrl: string;
  colors: ChairColorInfo[];
};

export type ChairColorInfo = {
  name: string;
  legColorUrl: string;
  legMetalnessUrl: string;
  legNormalUrl: string;
  legRoughnessUrl: string;
  topColorUrl: string;
  topMetalnessUrl: string;
  topNormalUrl: string;
  topRoughnessUrl: string;
  previewUrl: string;
  thumnailUrl: string;
};

