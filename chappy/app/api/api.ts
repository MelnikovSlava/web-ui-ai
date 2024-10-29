"use client";

import axios, { type AxiosInstance } from "axios";
import { redirect } from "next/navigation";
import { routes } from "../routers";
import type { Chat, Data, Message, Workspace } from "../store/types";
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
		this._baseUrl =
			process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
		this._prefix = "/api";

		this._axios = axios.create({
			baseURL: this._baseUrl,
			// baseURL: this._prefix,
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
				if (
					error.response?.status === 401 &&
					window.location.pathname !== routes.auth
				) {
					console.log("r", window.location.pathname, routes.auth);
					redirect(routes.auth);
				}

				const message = error.response?.data?.message || error.message;
				return Promise.reject(new Error(message));
			},
		);
	}

	public register = (params: AuthParams) => {
		return this._axios.post<TokenResponse>("/auth/register", params);
	};

	public login = (params: AuthParams) => {
		return this._axios.post<TokenResponse>("/auth/login", params);
	};

	public getData = () => {
		return this._axios.get<Data>("/data");
	};

	public createWorkspace = (params: { name: string; model: string }) => {
		return this._axios.post<Workspace>("/workspaces", params);
	};

	public deleteWorkspace = (id: number) => {
		return this._axios.delete(`/workspaces/${id}`);
	};

	public updateWorkspace = (params: {
		id: number;
		newName: string;
		newModel: string;
	}) => {
		return this._axios.put("/workspaces", params);
	};

	public createChat = (params: { name: string; workspaceId: number }) => {
		return this._axios.post<Chat>("/chats", params);
	};

	public deleteChat = (chatId: number) => {
		return this._axios.delete(`/chats/${chatId}`);
	};

	public forkChat = (chatId: number, messageId: number) => {
		return this._axios.post<{ chat: Chat; messages: Message[] }>(
			`/chats/${chatId}/fork`,
			{ messageId },
		);
	};

	public updateChatName = (id: number, newName: string) => {
		return this._axios.put(`/chats/${id}`, { newName });
	};

	public addMessage = (params: {
		chatId: number;
		content: string;
		role: string;
	}) => {
		return this._axios.post<Message>("/messages", params);
	};

	public deleteMessages = (messageIds: number[]) => {
		return this._axios.delete("/messages", { data: { ids: messageIds } });
	};

	public updateMessage = (messageId: number, newContent: string) => {
		return this._axios.put(`/messages/${messageId}`, { newContent });
	};
}

export const api = new Api();
