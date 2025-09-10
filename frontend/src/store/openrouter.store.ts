import { makeAutoObservable, runInAction } from "mobx";
import { localStorageUtils } from "../utils/localStorage";
import { Key, Model } from "./types";
import { MODELS_URL, AUTH_KEY_URL } from "../utils/constants";

export class OpenRouterStore {
	public creditsRemaining: Key | null;
	public models: Model[] = [];

	constructor() {
		this.creditsRemaining = null;

		makeAutoObservable(this);
	}

	private get _key() {
		return localStorageUtils.getKey();
	}

	public fetchModels = async (): Promise<void> => {
		try {
			const response = await fetch(MODELS_URL, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${this._key}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			runInAction(() => {
				this.models = data.data as Model[];
			});
		} catch (error) {
			console.error("Error fetching models:", error);
		}
	};

	public fetchCreditsRemaining = async (): Promise<void> => {
		try {
			const response = await fetch(AUTH_KEY_URL, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${this._key}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			runInAction(() => {
				this.creditsRemaining = data.data;
			});
		} catch (error) {
			console.error("Error fetching credits remaining:", error);
		}
	};
}