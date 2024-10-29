import { makeAutoObservable } from "mobx";
import type { ChatStore } from "./chat.store";
import type { Message } from "./types";

export class MessageStore {
	public data: Message;
	public chatStore: ChatStore;

	constructor(data: Message, chatStore: ChatStore) {
		this.data = data;
		this.chatStore = chatStore;

		makeAutoObservable(this);
	}

	public setContent = (content: string) => {
		this.data.content = content;
	};

	public setRole = (role: "user" | "assistant") => {
		this.data.role = role;
	};

	// public deserialize = (message: Message) => {
	// 	this.id = message.id;
	// 	this.content = message.content;
	// 	this.timestamp = message.timestamp;
	// 	this.role = message.role;
	// 	this.chatId = message.chatId;
	// };
}
