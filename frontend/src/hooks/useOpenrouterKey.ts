import { localStorageUtils } from "../utils/localStorage";

export const useOpenrouterKey = () => {
	return localStorageUtils.getKey();
};
