import { makeAutoObservable, runInAction } from "mobx";
import { localStorageUtils } from "../utils/localStorage";
import { API_URL } from "../utils/constants";


export class AiStore {
	private _controller: AbortController | null = null;

	public isStreaming: boolean;

	constructor() {
		this.isStreaming = false;

		makeAutoObservable(this);
	}

	private get _key() {
		return localStorageUtils.getKey();
	}

	public sendMessage = async (
		messages: Array<{ role: string; content: string }>,
		model = "",
		onPartialResponse: (partial: string) => void = () => {},
	): Promise<string | null> => {
		this._controller = new AbortController();

		runInAction(() => {
			this.isStreaming = true;
		});

		try {
			const response = await fetch(API_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this._key}`,
				},
				body: JSON.stringify({
					model,
					messages,
					stream: true,
				}),
				signal: this._controller.signal,
			});

			if (!response.body) {
				throw new Error("No response body");
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let aiResponse = "";

			while (true) {
				const result = await reader.read();
				const { done, value } = result;
				if (done) break;

				const chunk = decoder.decode(value);
				const lines = chunk.split("\n");

				for (const line of lines) {
					if (line.startsWith("data: ")) {
						const content = line.slice(6).trim();
						if (content === "[DONE]") {
							continue;
						}

						const data = JSON.parse(content);

						if (data.error) {
							throw new Error(data.error?.message ||  "Something is wrong!")
						}

						const partialResponse = data.choices[0].delta.content;
						if (partialResponse) {
							aiResponse += partialResponse;
							onPartialResponse(aiResponse);
						}
					}
				}
			}

			runInAction(() => {
				this.isStreaming = false;
			});

			return aiResponse;
		} catch (error: any) {
			console.error("Error sending message:", error);

			runInAction(() => {
				this.isStreaming = false;
			});

			throw error;
		}
	};

	public abortRequest = (): void => {
		if (this._controller) {
			this._controller.abort();
			runInAction(() => {
				this.isStreaming = false;
			});
		}
	};
}
