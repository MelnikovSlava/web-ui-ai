import { useHotkeys } from "react-hotkeys-hook";
import { useGlobalStore } from "../store/global.store";

export const useHotkeysGlobal = () => {
  const store = useGlobalStore();

  useHotkeys("ctrl+n", () => {
    if (store.currentWorkspaceStore) {
      store.currentWorkspaceStore.createNewChat();
    }
  });
};
