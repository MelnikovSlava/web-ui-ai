import { makeAutoObservable } from "mobx";
import { RootStore } from "./root.store";
import { localStorageUtils } from "../utils/localStorage";

export class SettingsStore {
	private _root: RootStore;

	public token: string;

	constructor(root: RootStore) {
		this._root = root;

		this.token = localStorageUtils.getToken() || "";

		makeAutoObservable(this);
	}

	public setToken = (token: string) => {
		this.token = token;
	};

	public applySettings = () => {
		localStorageUtils.setToken(this.token);
	};
}
