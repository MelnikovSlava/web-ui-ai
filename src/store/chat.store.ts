import { makeAutoObservable, runInAction } from "mobx";
import type { IndexedDb } from "../logic/indexed-db";
import type { Chat, Message, MessageBase } from "../logic/types";
import type { RootStore } from "./global.store";

export class ChatStore {
  private _db: IndexedDb;
  private _root: RootStore;

  public chat: Chat;
  public model: string;
  public messages: Map<Message["id"], Message>;
  public input: string;
  public currentStreamedMessage: MessageBase;

  constructor(chat: Chat, model: string, db: IndexedDb, root: RootStore) {
    this.chat = chat;
    this._root = root;
    this.model = model;
    this._db = db;
    this.messages = new Map();
    this.input = "";
    this.currentStreamedMessage = {
      chatId: this.chat.id,
      content: "",
      role: "assistant",
    };

    this._init();

    makeAutoObservable(this);
  }

  public get created() {
    return this.chat.timestamp;
  }

  public get default() {
    return this.chat.default;
  }

  private get _aiStore() {
    return this._root.aiStore;
  }

  private async _init() {
    const messages = await this._db.getMessages(this.chat.id);
    this.messages = new Map(messages.map((m) => [m.id, m]));
  }

  public get isStreaming() {
    return this._aiStore.isStreaming;
  }

  public setInput = (input: string) => {
    this.input = input;
  };

  private async _updateChatTitle(firstMessage: MessageBase) {
    const title = firstMessage.content.trim().substring(0, 100);
    await this._db.updateChatName(this.chat.id, title);
    this.chat.name = title;
  }

  public clearMessages = () => {
    runInAction(() => {
      this.messages.clear();
      this.currentStreamedMessage.content = "";
    });
  };

  public async sendMessage(content: string) {
    const userMessage: MessageBase = {
      chatId: this.chat.id,
      role: "user",
      content,
    };

    // Создаем массив сообщений для отправки в AI
    const messagesForAi = Array.from(this.messages.values())
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((msg) => ({ role: msg.role, content: msg.content }));

    // Добавляем текущее сообщение пользователя
    messagesForAi.push({ role: "user", content });

    const addedMessage = await this._db.addMessage(userMessage);

    runInAction(() => {
      this.messages.set(addedMessage.id, addedMessage);
      this.input = "";

      if (this.messages.size === 1 && !this.chat.default) {
        this._updateChatTitle(userMessage);
      }
    });

    const aiResponse = await this._aiStore.sendMessage(
      messagesForAi,
      this.model,
      (partial: string) => {
        runInAction(() => {
          this.currentStreamedMessage.content = partial;
        });
      }
    );

    if (aiResponse) {
      const aiMessage: MessageBase = {
        chatId: this.chat.id,
        role: "assistant",
        content: aiResponse,
      };

      const addedAiMessage = await this._db.addMessage(aiMessage);

      runInAction(() => {
        this.messages.set(addedAiMessage.id, addedAiMessage);
        this.currentStreamedMessage.content = "";
      });
    }
  }

  public stopStreaming = () => {
    this._aiStore.stopStreaming();
  };
}
