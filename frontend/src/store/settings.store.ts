import { makeAutoObservable } from "mobx";
import { localStorageUtils } from "../utils/localStorage";
import type { RootStore } from "./root.store";
import { api } from "../api/api";
import { DEFAULT_TITLE_MODEL } from "../utils/constants";
import { resolvePromise } from "../utils/utils";

export class SettingsStore {
	private _root: RootStore;

	public key: string;
	private _titleModel: string | null = null;

	constructor(root: RootStore) {
		this._root = root;

		this.key = localStorageUtils.getKey() || "";

		makeAutoObservable(this);
	}

	public get titleModel() {
		return this._titleModel || DEFAULT_TITLE_MODEL;
	}

	public setTitleModel = (titleModel: string | null) => {
		this._titleModel = titleModel;
	};

	public getTitleModelForSelect = () => {
		const currentTitleModel = this.titleModel;
		const openRouterStore = this._root.openrouterStore;
		const models = openRouterStore.models;
		const model = models.find((m) => m.id === currentTitleModel);

		if (!model) {
			return models[0];
		}

		return model;
	};

	public isTitleModelChanged = (selectedModelId: string) => {
		return this.titleModel !== selectedModelId;
	};

	public updateTitleModelAction = (titleModel: string) => {
		const previousTitleModel = this._titleModel;
		this._titleModel = titleModel;

		return resolvePromise({
			promise: () => api.updateTitleModel(titleModel),
			resolve: () => {},
			reject: () => {
				this._titleModel = previousTitleModel;
			},
		});
	};

	public setKey = (key: string) => {
		localStorageUtils.setKey(key);
		this.key = key;
	};
}
