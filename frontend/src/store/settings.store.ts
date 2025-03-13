import { makeAutoObservable } from "mobx";
import { localStorageUtils } from "../utils/localStorage";
import type { RootStore } from "./root.store";

import { api } from "../api/api";

export class SettingsStore {
	private _root: RootStore;

	public key: string;

	constructor(root: RootStore) {
		this._root = root;

		this.key = localStorageUtils.getKey() || "";

		makeAutoObservable(this);
	}

	public setKey = (key: string) => {
		localStorageUtils.setKey(key);
		this.key = key;
	};

	public applySettings = () => {
		localStorageUtils.setKey(this.key);
	};
}
