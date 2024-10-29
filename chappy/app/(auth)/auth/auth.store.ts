"use client";

import { makeAutoObservable } from "mobx";
import { api } from "../../api/api";
import { getStoreContext } from "../../hooks/useCreateStore";
import { localStorageUtils } from "../../utils/localStorage";
import { resolvePromise } from "../../utils/utils";

export default class AuthStore {
	constructor() {
		makeAutoObservable(this);
	}

	public reset = () => {};

	public registrationAction = (data: Parameters<typeof api.register>[0]) => {
		return resolvePromise({
			promise: () => api.register(data),
			resolve: ({ data }) => {
				this._setToken(data.token);
			},
		});
	};

	public loginAction = (data: Parameters<typeof api.login>[0]) => {
		return resolvePromise({
			promise: () => api.login(data),
			resolve: ({ data }) => {
				this._setToken(data.token);
			},
		});
	};

	private _setToken = (token: string) => {
		localStorageUtils.setToken(token);
	};
}

export const AuthStoreData = getStoreContext<AuthStore>();
