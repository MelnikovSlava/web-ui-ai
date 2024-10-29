"use client";

import { makeAutoObservable } from "mobx";
import { api } from "../api/api";
import { getStoreContext } from "../hooks/useCreateStore";
import { resolvePromise } from "../utils/utils";
import { ChatStore } from "./chat.store";
import type { MessageStore } from "./message.store";
import type { RootStore } from "./root.store";
import type { Chat, Message, Workspace } from "./types";

export class WorkspaceStore {
	private _chats: Map<Chat["id"], ChatStore>;

	public data: Workspace;
	public root: RootStore;

	constructor(workspace: Workspace, rootStore: RootStore) {
		this._chats = new Map();
		this.data = workspace;
		this.root = rootStore;

		makeAutoObservable(this);
	}

	public get chats() {
		return [...this._chats.values()];
	}

	public deserialize = (
		workspace: Workspace,
		chats: Chat[],
		messages: Message[],
	) => {
		this.data = workspace;

		chats
			.filter((chat) => chat.workspaceId === workspace.id)
			.forEach((chat) => {
				this._createChat(chat, messages);
			});
	};

	private _createChat = async (chat: Chat, messages: Message[]) => {
		const chatStore = new ChatStore(chat, this);
		chatStore.deserialize(chat, messages);
		this._chats.set(chatStore.data.id, chatStore);
	};

	public existsChat = (id: number) => {
		return this._chats.has(id);
	};

	public getChat = (chatId: number) => {
		const chat = this._chats.get(chatId);

		if (!chat) {
			throw new Error("Chat not found");
		}

		return chat;
	};

	public forkChat = async (message: MessageStore) => {
		const donorChatStore = this.getChat(message.data.chatId);

		return resolvePromise({
			promise: () => api.forkChat(donorChatStore.data.id, message.data.id),
			resolve: ({ data }) => {
				this._createChat(data.chat, data.messages);
			},
		});
	};

	public createChatAction = async () => {
		return resolvePromise({
			promise: () =>
				api.createChat({
					name: "",
					workspaceId: this.data.id,
				}),
			resolve: ({ data }) => {
				const chatStore = new ChatStore(data, this);

				this._chats.set(chatStore.data.id, chatStore);
			},
		});
	};

	public deleteChatAction = async (chatId: number) => {
		const chatStore = this.getChat(chatId);

		this._chats.delete(chatId);

		resolvePromise({
			promise: () => api.deleteChat(chatId),
			resolve: () => {},
			reject: () => {
				this._chats.set(chatId, chatStore);
			},
		});
	};
}

export const WorkspaceStoreData = getStoreContext<WorkspaceStore>();
