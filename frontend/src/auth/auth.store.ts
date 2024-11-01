import { makeAutoObservable } from "mobx";
import { api } from "../api/api";
import { getStoreContext } from "../hooks/useCreateStore";
import { localStorageUtils } from "../utils/localStorage";
import { resolvePromise } from "../utils/utils";

export default class AuthStore {
	constructor() {
		makeAutoObservable(this);
	}

	public reset = () => {};

	public registrationAction = (params: Parameters<typeof api.register>[0]) => {
		return resolvePromise({
			promise: () => api.register(params),
			resolve: ({ data }) => {
				this._setToken(data.token);
				this._setSecret(params.password);
			},
		});
	};

	public loginAction = (params: Parameters<typeof api.login>[0]) => {
		return resolvePromise({
			promise: () => api.login(params),
			resolve: ({ data }) => {
				this._setToken(data.token);
				this._setSecret(params.password);
			},
		});
	};

	private _setToken = (token: string) => {
		localStorageUtils.setToken(token);
	};

	private _setSecret = (secret: string) => {
		localStorageUtils.setSecret(secret);
	};
}

export const AuthStoreData = getStoreContext<AuthStore>();
