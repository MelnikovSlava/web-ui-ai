import axios, { type AxiosInstance } from "axios";
import { router, routes } from "../router";
import type { Chat, Data, Workspace } from "../store/types";
import { localStorageUtils } from "../utils/localStorage";

export type TokenResponse = {
	token: string;
};

export type AuthParams = {
	username: string;
	password: string;
};

class Api {
	private _dev: boolean;
	private _baseUrl: string;
	private _prefix: string;
	private _axios: AxiosInstance;

	constructor() {
		this._dev = process.env.NODE_ENV === "development";
		this._baseUrl = "";
		this._prefix = "/api";

		if (this._dev) {
			this._baseUrl = "http://localhost:4000";
		}

		this._axios = axios.create({
			baseURL: this._baseUrl + this._prefix,
			headers: {
				"Content-Type": "application/json",
			},
		});

		this._axios.interceptors.request.use((config) => {
			const token = localStorageUtils.getToken();

			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}

			return config;
		});

		this._axios.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response?.status === 401) {
					router.navigate(routes.auth);
				}
				const message = error.response?.data?.message || error.message;
				return Promise.reject(new Error(message));
			},
		);
	}

	public register = (params: AuthParams) => {
		return this._axios.post<TokenResponse>("/register", params);
	};

	public login = (params: AuthParams) => {
		return this._axios.post<TokenResponse>("/login", params);
	};

	public getData = () => {
		return this._axios.get<Data>("/data");
	};

	public createWorkspace = (params: { name: string; model: string }) => {
		return this._axios.post<Workspace>("/workspace", params);
	};

	public deleteWorkspace = (id: number) => {
		return this._axios.delete(`/workspace/${id}`);
	};

	public updateWorkspace = (params: {
		id: number;
		newName: string;
		newModel: string;
	}) => {
		return this._axios.put("/workspace", params);
	};

	public createChat = (params: { name: string; workspaceId: number }) => {
		return this._axios.post<Chat>("/chats", params);
	};

	public deleteChat = (chatId: number) => {
		return this._axios.delete(`/chats/${chatId}`);
	};
}

export const api = new Api();
