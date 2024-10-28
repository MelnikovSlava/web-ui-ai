import { localStorageUtils } from "../utils/localStorage";

export const useJwtToken = () => {
	return localStorageUtils.getToken();
};
