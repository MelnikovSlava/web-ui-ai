import { useHotkeys } from "react-hotkeys-hook";
import { useGlobalStore } from "../store/global.store";

export const useHotkeysGlobal = () => {
  const store = useGlobalStore();

  useHotkeys("ctrl+m", () => {
    if (store.currentWorkspaceStore) {
      store.currentWorkspaceStore.createNewChat();
    }
  });
};
