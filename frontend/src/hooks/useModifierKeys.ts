// useModifierKeys.js
import { useState, useEffect, useCallback } from "react";

const useModifierKeys = () => {
  const [modifierPressed, setModifierPressed] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) {
      setModifierPressed(true);
    }
  }, []);

  const handleKeyUp = useCallback((e) => {
    if (!e.metaKey && !e.ctrlKey && !e.altKey) {
      setModifierPressed(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return modifierPressed;
};

export default useModifierKeys;
