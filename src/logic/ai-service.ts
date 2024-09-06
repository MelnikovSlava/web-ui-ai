// ai-service.ts

import { makeAutoObservable, runInAction } from "mobx";
import { localStorageUtils } from "../utils/localStorage";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface Model {
  id: string;
  name: string;
  description: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  context_length: number;
  top_provider: string;
}

export class AiStore {
  private _controller: AbortController | null = null;
  private _key: string | null;

  public isStreaming: boolean;
  public models: Model[] = [];

  constructor() {
    this.isStreaming = false;
    this._key = localStorageUtils.getToken();

    makeAutoObservable(this);
  }

  public updateKey = (key: string): void => {
    this._key = key;
  };

  public fetchModels = async (): Promise<void> => {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/models", {
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
            try {
              const data = JSON.parse(content);
              if (data.choices?.[0].delta.content) {
                const newContent = data.choices[0].delta.content;
                aiResponse += newContent;
                onPartialResponse(aiResponse);
              }
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        }
      }

      return aiResponse;
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Fetch error:", error);
      }
      return null;
    } finally {
      runInAction(() => {
        this.isStreaming = false;
        this._controller = null;
      });
    }
  };

  stopStreaming() {
    if (this._controller) {
      this._controller.abort();
    }

    runInAction(() => {
      this.isStreaming = false;
    });
  }
}
