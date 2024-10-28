import { makeAutoObservable } from "mobx";
import { generateNewId, getTimestamp } from "../utils/utils";
import type { ChatStore } from "./chat.store";
import type { Message } from "./types";

export class MessageStore implements Message {
	public id: number;
	public timestamp: number;
	public content: string;
	public role: "user" | "assistant";
	public chatId: number;

	public chatStore: ChatStore;

	constructor(chatStore: ChatStore) {
		this.chatStore = chatStore;

		this.id = generateNewId(this.chatStore.workspace.root.allMessages);
		this.content = "";
		this.timestamp = getTimestamp();
		this.role = "user";
		this.chatId = this.chatStore.id;

		makeAutoObservable(this);
	}

	public setContent = (content: string) => {
		this.content = content;
	};

	public setRole = (role: "user" | "assistant") => {
		this.role = role;
	};

	public serialize = (): Message => {
		return {
			id: this.id,
			content: this.content,
			timestamp: this.timestamp,
			role: this.role,
			chatId: this.chatId,
		};
	};

	public deserialize = (message: Message) => {
		this.id = message.id;
		this.content = message.content;
		this.timestamp = message.timestamp;
		this.role = message.role;
		this.chatId = message.chatId;
	};
}
