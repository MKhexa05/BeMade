import { useCallback } from "react";
import type { StateManager } from "../../../Managers/StateManager/StateManager";
import {
  SHARE_CONFIG_QUERY_KEY,
  buildPersistedDesignConfig,
  encodePersistedDesignConfig,
  savePersistedDesignConfig,
} from "../../../Utils/designConfig";

type UseConfigPersistenceArgs = {
  stateManager: StateManager;
};

export const useConfigPersistence = ({
  stateManager,
}: UseConfigPersistenceArgs) => {
  const handleSaveConfig = useCallback(() => {
    const config = buildPersistedDesignConfig(stateManager);
    savePersistedDesignConfig(config);
  }, [stateManager]);

  const handleShareConfig = useCallback(async () => {
    if (typeof window === "undefined") return;

    const config = buildPersistedDesignConfig(stateManager);
    const encoded = encodePersistedDesignConfig(config);
    const url = new URL(window.location.href);
    url.searchParams.set(SHARE_CONFIG_QUERY_KEY, encoded);
    const shareLink = url.toString();
    savePersistedDesignConfig(config);

    try {
      await navigator.clipboard.writeText(shareLink);
    } catch {
      window.prompt("Copy this share link:", shareLink);
    }
  }, [stateManager]);

  return {
    handleSaveConfig,
    handleShareConfig,
  };
};
