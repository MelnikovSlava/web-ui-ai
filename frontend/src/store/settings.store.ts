import { makeAutoObservable } from "mobx";
import { localStorageUtils } from "../utils/localStorage";
import type { RootStore } from "./root.store";

export class SettingsStore {
	private _root: RootStore;

	public key: string;

	constructor(root: RootStore) {
		this._root = root;

		this.key = localStorageUtils.getKey() || "";

		makeAutoObservable(this);
	}

	public setKey = (token: string) => {
		this.key = token;
	};

	public applySettings = () => {
		localStorageUtils.setKey(this.key);
	};
}
