import { useHotkeys } from "react-hotkeys-hook";
import { useRootStore } from "../store/root.store";

export const useHotkeysGlobal = () => {
  const store = useRootStore();

  useHotkeys("ctrl+n", () => {
    if (store.currentWorkspaceStore) {
      store.currentWorkspaceStore.createNewChat();
    }
  });
};
