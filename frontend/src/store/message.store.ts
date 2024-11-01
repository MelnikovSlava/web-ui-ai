import { makeAutoObservable } from "mobx";
import { decrypt } from "../utils/encryptor";
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

	public deserialize = (message: Message) => {
		this.data = {
			...message,
			content: decrypt(message.content),
		};
	};
}
