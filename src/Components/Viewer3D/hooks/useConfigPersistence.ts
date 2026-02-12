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
  onSaveSuccess?: () => void;
  onShareSuccess?: () => void;
  onShareFailure?: () => void;
};

export const useConfigPersistence = ({
  stateManager,
  onSaveSuccess,
  onShareSuccess,
  onShareFailure,
}: UseConfigPersistenceArgs) => {
  const handleSaveConfig = useCallback(() => {
    const config = buildPersistedDesignConfig(stateManager);
    savePersistedDesignConfig(config);
    onSaveSuccess?.();
  }, [stateManager, onSaveSuccess]);

  const handleShareConfig = useCallback(async () => {
    if (typeof window === "undefined") return;

    const config = buildPersistedDesignConfig(stateManager);
    const encoded = encodePersistedDesignConfig(config);
    const url = new URL(window.location.href);
    url.searchParams.set(SHARE_CONFIG_QUERY_KEY, encoded);
    const shareLink = url.toString();
    savePersistedDesignConfig(config);

    const copyWithClipboardApi = async () => {
      if (!navigator.clipboard?.writeText) return false;
      try {
        await navigator.clipboard.writeText(shareLink);
        return true;
      } catch {
        return false;
      }
    };

    const copyWithTextareaFallback = () => {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = shareLink;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(textarea);
        return copied;
      } catch {
        return false;
      }
    };

    const copied = (await copyWithClipboardApi()) || copyWithTextareaFallback();
    if (copied) {
      onShareSuccess?.();
      return;
    }

    onShareFailure?.();
    window.prompt("Copy this share link:", shareLink);
  }, [stateManager, onShareSuccess, onShareFailure]);

  return {
    handleSaveConfig,
    handleShareConfig,
  };
};
