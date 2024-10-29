"use client";

import { makeAutoObservable } from "mobx";
import { api } from "../api/api";
import { resolvePromise } from "../utils/utils";
import { AiStore } from "./ai.store";
import { SettingsStore } from "./settings.store";
import type { Workspace } from "./types";
import { WorkspaceStore } from "./workspace.store";

export class RootStore {
	public aiStore: AiStore;
	public workspaces: Map<Workspace["id"], WorkspaceStore>;

	public settingsStore: SettingsStore;

	constructor() {
		this.settingsStore = new SettingsStore(this);
		this.workspaces = new Map();
		this.aiStore = new AiStore();

		makeAutoObservable(this);
	}

	public get allWorkspaces() {
		return Array.from(this.workspaces.values());
	}

	// public get allChats() {
	// 	const chats: ChatStore[] = [];

	// 	for (const workspace of this.allWorkspaces) {
	// 		chats.push(...workspace.chats);
	// 	}

	// 	return chats;
	// }

	// public get allMessages() {
	// 	const messages: MessageStore[] = [];

	// 	for (const chat of this.allChats) {
	// 		messages.push(...chat.messages);
	// 	}

	// 	return messages;
	// }

	public getDataAction = async () => {
		return resolvePromise({
			promise: () => api.getData(),
			resolve: ({ data }) => {
				data.workspaces.forEach((workspace) => {
					const store = new WorkspaceStore(workspace, this);
					store.deserialize(workspace, data.chats, data.messages);
					this.workspaces.set(workspace.id, store);
				});
			},
		});
	};

	public existsWorkspace = (id: number) => {
		return this.workspaces.has(id);
	};

	public getWorkspace = (id: number) => {
		const workspace = this.workspaces.get(id);

		if (!workspace) {
			throw new Error(`Workspace not found: ${id}`);
		}

		return workspace;
	};

	public getChat = (workspaceId: number, chatId: number) => {
		return this.workspaces.get(workspaceId)?.getChat(chatId);
	};

	public deleteWorkspace = (workspaceId: number) => {
		this.workspaces.delete(workspaceId);
	};

	public createWorkspaceAction = async () => {
		return resolvePromise({
			promise: () => api.createWorkspace({ model: "", name: "" }),
			resolve: ({ data }) => {
				const workspaceStore = new WorkspaceStore(data, this);
				this.workspaces.set(workspaceStore.data.id, workspaceStore);
			},
		});
	};

	public deleteWorkspaceAction = async (workspaceId: number) => {
		const workspaceStore = this.getWorkspace(workspaceId);

		this.workspaces.delete(workspaceId);

		return resolvePromise({
			promise: () => api.deleteWorkspace(workspaceId),
			resolve: () => {},
			reject: () => {
				this.workspaces.set(workspaceId, workspaceStore);
			},
		});
	};

	public updateWorkspaceAction = (
		workspaceId: number,
		data: { name?: string; model?: string },
	) => {
		const workspaceStore = this.getWorkspace(workspaceId);

		return resolvePromise({
			promise: () =>
				api.updateWorkspace({
					id: workspaceId,
					newModel: data.model || workspaceStore.data.model,
					newName: data.name || workspaceStore.data.name,
				}),
			resolve: () => {
				workspaceStore.data.model = data.model || workspaceStore.data.model;
				workspaceStore.data.name = data.name || workspaceStore.data.name;
			},
		});
	};
}

export const rootStore = new RootStore();
export const useRootStore = () => rootStore;
