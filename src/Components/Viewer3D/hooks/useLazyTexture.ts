import * as THREE from "three";
import { useEffect, useState } from "react";

const textureCache = new Map<string, THREE.Texture>();
const pendingTextureLoads = new Map<string, Promise<THREE.Texture>>();

function loadTexture(url: string): Promise<THREE.Texture> {
  const cachedTexture = textureCache.get(url);
  if (cachedTexture) {
    return Promise.resolve(cachedTexture);
  }

  const pendingLoad = pendingTextureLoads.get(url);
  if (pendingLoad) {
    return pendingLoad;
  }

  const loader = new THREE.TextureLoader();

  const loadPromise = new Promise<THREE.Texture>((resolve, reject) => {
    loader.load(
      url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = false;

        textureCache.set(url, texture);
        pendingTextureLoads.delete(url);
        resolve(texture);
      },
      undefined,
      (error) => {
        pendingTextureLoads.delete(url);
        reject(error);
      },
    );
  });

  pendingTextureLoads.set(url, loadPromise);
  return loadPromise;
}

export function useLazyTexture(url: string) {
  const [texture, setTexture] = useState<THREE.Texture | null>(() =>
    url ? (textureCache.get(url) ?? null) : null,
  );
  const [loading, setLoading] = useState(() =>
    Boolean(url && !textureCache.has(url)),
  );

  useEffect(() => {
    if (!url) {
      setTexture(null);
      setLoading(false);
      return;
    }

    const cachedTexture = textureCache.get(url);
    if (cachedTexture) {
      setTexture(cachedTexture);
      setLoading(false);
      return;
    }

    let isCancelled = false;
    setLoading(true);

    loadTexture(url)
      .then((loadedTexture) => {
        if (isCancelled) return;

        setTexture(loadedTexture);
        setLoading(false);
      })
      .catch(() => {
        if (isCancelled) return;

        setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [url]);

  return { texture, loading };
}
