import { makeAutoObservable } from "mobx";
import { api } from "../api/api";
import {} from "../utils/constants";
import { encrypt } from "../utils/encryptor";
import { localStorageUtils } from "../utils/localStorage";
import { resolvePromise } from "../utils/utils";
import { AiStore } from "./ai.store";
import { SettingsStore } from "./settings.store";
import type { Workspace } from "./types";
import { WorkspaceStore } from "./workspace.store";
import { router, routes } from "../router";

export class RootStore {
	public aiStore: AiStore;
	private _workspaces: Map<Workspace["id"], WorkspaceStore>;

	public settingsStore: SettingsStore;

	constructor() {
		this.settingsStore = new SettingsStore(this);
		this._workspaces = new Map();
		this.aiStore = new AiStore();

		makeAutoObservable(this);
	}

	public get workspaces() {
		return Array.from(this._workspaces.values());
	}

	public getDataAction = async () => {
		return resolvePromise({
			promise: () => api.getData(),
			resolve: ({ data }) => {
				data.workspaces.forEach((workspace) => {
					const store = new WorkspaceStore(workspace, this);
					store.deserialize(workspace, data.chats, data.messages);
					this._workspaces.set(workspace.id, store);
				});
			},
		});
	};

	public existsWorkspace = (id: number) => {
		return this._workspaces.has(id);
	};

	public getWorkspace = (id: number) => {
		const workspace = this._workspaces.get(id);

		if (!workspace) {
			throw new Error(`Workspace not found: ${id}`);
		}

		return workspace;
	};

	public getChat = (workspaceId: number, chatId: number) => {
		return this._workspaces.get(workspaceId)?.getChat(chatId);
	};

	public deleteWorkspace = (workspaceId: number) => {
		this._workspaces.delete(workspaceId);
	};

	public createWorkspaceAction = async () => {
		return resolvePromise({
			promise: () => api.createWorkspace({ model: "", name: "" }),
			resolve: ({ data }) => {
				const workspaceStore = new WorkspaceStore(data, this);
				this._workspaces.set(workspaceStore.data.id, workspaceStore);
			},
		});
	};

	public deleteWorkspaceAction = async (workspaceId: number) => {
		const workspaceStore = this.getWorkspace(workspaceId);

		this._workspaces.delete(workspaceId);

		return resolvePromise({
			promise: () => api.deleteWorkspace(workspaceId),
			resolve: () => {},
			reject: () => {
				this._workspaces.set(workspaceId, workspaceStore);
			},
		});
	};

	public updateWorkspaceModelAction = (workspaceId: number, model: string) => {
		const workspaceStore = this.getWorkspace(workspaceId);

		return resolvePromise({
			promise: () => api.updateWorkspaceModel({ id: workspaceId, model }),
			resolve: () => {
				workspaceStore.data.model = model;
			},
		});
	};

	public updateWorkspaceNameAction = (workspaceId: number, name: string) => {
		const workspaceStore = this.getWorkspace(workspaceId);

		return resolvePromise({
			promise: () =>
				api.updateWorkspaceName({ id: workspaceId, name: encrypt(name) }),
			resolve: () => {
				workspaceStore.data.name = name;
			},
		});
	};

	public logout = () => {
		localStorageUtils.clearAllSettings();
		router.navigate(routes.auth);
	};
}

export const rootStore = new RootStore();
export const useRootStore = () => rootStore;
