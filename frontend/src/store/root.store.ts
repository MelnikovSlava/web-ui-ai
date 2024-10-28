import { makeAutoObservable } from "mobx";
import { api } from "../api/api";
import {} from "../utils/constants";
import { resolvePromise } from "../utils/utils";
import { AiStore } from "./ai.store";
import type { ChatStore } from "./chat.store";
import type { MessageStore } from "./message.store";
import { SettingsStore } from "./settings.store";
import type { Chat, Message, Workspace } from "./types";
import { WorkspaceStore } from "./workspace.store";

export class RootStore {
	public workspaces: Map<Workspace["id"], WorkspaceStore>;

	public aiStore: AiStore;
	public settingsStore: SettingsStore;

	constructor() {
		this.aiStore = new AiStore();
		this.settingsStore = new SettingsStore(this);
		this.workspaces = new Map();

		makeAutoObservable(this);
	}

	public get allWorkspaces() {
		return Array.from(this.workspaces.values());
	}

	public get allChats() {
		const chats: ChatStore[] = [];

		for (const workspace of this.allWorkspaces) {
			chats.push(...workspace.chats);
		}

		return chats;
	}

	public get allMessages() {
		const messages: MessageStore[] = [];

		for (const chat of this.allChats) {
			messages.push(...chat.messages);
		}

		return messages;
	}

	public getDataAction = async () => {
		return resolvePromise({
			promise: () => api.getData(),
			resolve: ({ data }) => {
				data.workspaces.forEach((workspace) => {
					const store = new WorkspaceStore(this);
					store.deserialize(workspace, data.chats, data.messages);
					this.workspaces.set(workspace.id, store);
				});
			},
		});
	};

	public serialize = () => {
		return {
			workspaces: this.allWorkspaces.map((workspace) => workspace.serialize()),
			chats: this.allChats.map((chat) => chat.serialize()),
			messages: this.allMessages.map((message) => message.serialize()),
		};
	};

	public deserialize = (
		workspaces: Workspace[],
		chats: Chat[],
		messages: Message[],
	) => {
		workspaces.forEach((workspace) => {
			const store = new WorkspaceStore(this);
			store.deserialize(workspace, chats, messages);
			this.workspaces.set(workspace.id, store);
		});
	};

	public getWorkspace = (id: number) => {
		const workspace = this.workspaces.get(id);

		if (!workspace) {
			throw new Error("Workspace not found");
		}

		return workspace;
	};

	public getChat = (workspaceId: number, chatId: number) => {
		return this.workspaces.get(workspaceId)?.getChat(chatId);
	};

	public createNewWorkspace = () => {
		const store = new WorkspaceStore(this);

		this.workspaces.set(store.id, store);

		return store;
	};

	public deleteWorkspace = (workspaceId: number) => {
		this.workspaces.delete(workspaceId);
	};
}

export const rootStore = new RootStore();
export const useRootStore = () => rootStore;
