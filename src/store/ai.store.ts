import { makeAutoObservable, runInAction } from "mobx";
import { localStorageUtils } from "../utils/localStorage";
import type { Key, Model } from "./types";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const AUTH_KEY_URL = "https://openrouter.ai/api/v1/auth/key";
const MODELS_URL = "https://openrouter.ai/api/v1/models";

export class AiStore {
  private _controller: AbortController | null = null;
  private _token: string | null;

  public creditsRemaining: Key | null;
  public isStreaming: boolean;
  public models: Model[] = [];

  constructor() {
    this.isStreaming = false;
    this._token = localStorageUtils.getToken();
    this.creditsRemaining = null;

    makeAutoObservable(this);
  }

  public updateToken = (key: string): void => {
    this._token = key;
  };

  public fetchCreditsRemaining = async (): Promise<void> => {
    try {
      const response = await fetch(AUTH_KEY_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this._token}`,
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

  public fetchModels = async (): Promise<void> => {
    try {
      const response = await fetch(MODELS_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this._token}`,
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

  public sendMessage = async (
    messages: Array<{ role: string; content: string }>,
    model: string,
    onPartialResponse: (partial: string) => void
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
          Authorization: `Bearer ${this._token}`,
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
        const { done, value } = await reader.read();
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
    } catch (error) {
      console.error("Error sending message:", error);
      runInAction(() => {
        this.isStreaming = false;
      });
      return null;
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

export const aiStore = new AiStore();
