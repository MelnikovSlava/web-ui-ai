import { makeAutoObservable } from "mobx";
import { localStorageUtils } from "../utils/localStorage";
import { api } from "../api/api";
import { resolvePromise } from "../utils/utils";
import { getStoreContext } from "../hooks/useCreateStore";

export default class AuthStore {
	public isAuthentificated: boolean;

	constructor() {
		this.isAuthentificated = !!localStorageUtils.getToken();

		// RootStoreInstance.resetCallback(this.reset);
		makeAutoObservable(this);
	}

	public reset = () => {};

	public registrationAction = (
		data: Parameters<typeof api.registerUser>[0],
	) => {
		return resolvePromise({
			promise: () => api.registerUser(data),
			resolve: () => {
				// AmplitudeAnlytics.event("Registration");
			},
		});
	};
}

export const AuthStoreData = getStoreContext<AuthStore>();
