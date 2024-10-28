import { makeAutoObservable, runInAction } from "mobx";
import { generateNewId, getTimestamp } from "../utils/utils";
import { AiStore } from "./ai.store";
import { MessageStore } from "./message.store";
import type { Chat, Message } from "./types";
import type { WorkspaceStore } from "./workspace.store";

export class ChatStore implements Chat {
	private _messages: Map<Message["id"], MessageStore>;

	public id: number;
	public name: string;
	public timestamp: number;
	public workspaceId: number;

	public workspace: WorkspaceStore;

	constructor(workspaceStore: WorkspaceStore) {
		this._messages = new Map();

		this.workspace = workspaceStore;
		this.id = generateNewId(this.workspace.root.allChats);
		this.name = "";
		this.timestamp = getTimestamp();
		this.workspaceId = this.workspace.id;

		makeAutoObservable(this);
	}

	public get messages() {
		return Array.from(this._messages.values());
	}

	private get _aiStore() {
		return this.workspace.root.aiStore;
	}

	public get isStreaming() {
		return this._aiStore.isStreaming;
	}

	private async _updateChatTitle() {
		const ai = new AiStore();

		const firstTwoMessages = this.messages.slice(0, 2);
		const messageShortHistory = this._prepareMessagesForAi(firstTwoMessages);

		messageShortHistory.push({
			content:
				"Write a short name for the chat. From 2 to 4 words. The title must be in the same language as the chat conversation. Choose the appropriate emoji for the title of this chat. Answer, like json object, example: {title: 'Title', emoji: 'emoji'}",
			role: "user",
		});

		const response = await ai.sendMessage(messageShortHistory);

		if (response) {
			const jsonRegex = /\{.*\}/s;
			const match = response.match(jsonRegex);

			if (match) {
				const jsonString = match[0];
				const parsedObject = JSON.parse(jsonString);

				const title = `${parsedObject.emoji} ${parsedObject.title}`;

				runInAction(() => {
					this.name = title;
				});
			} else {
				console.error("Объект JSON не найден");
			}
		}
	}

	public deleteMessage(msg: Message) {
		this._messages.delete(msg.id);
	}

	public onEditMessage = (messageId: number, newContent: string) => {
		const editedMessage = this._messages.get(messageId);

		if (!editedMessage) {
			console.error("Message not found");
			return;
		}

		// Update the message content in the local store
		editedMessage.setContent(newContent);

		// this._messages.set(messageId, editedMessage);

		// Get all messages after the edited message
		const messagesToDelete = this.messages.filter(
			(msg) => msg.timestamp > editedMessage.timestamp,
		);

		// Delete messages after the edited one
		for (const msg of messagesToDelete) {
			this.deleteMessage(msg);
		}

		this._sendMessagesToAi();
	};

	public serialize = (): Chat => {
		return {
			id: this.id,
			name: this.name,
			timestamp: this.timestamp,
			workspaceId: this.workspaceId,
		};
	};

	public deserialize = (chat: Chat, messages: Message[]) => {
		this.id = chat.id;
		this.name = chat.name;
		this.timestamp = chat.timestamp;

		messages
			.filter((m) => m.chatId === chat.id)
			.forEach((message) => {
				const messageStore = new MessageStore(this);
				messageStore.deserialize(message);

				this._messages.set(message.id, messageStore);
			});
	};

	public inputMessage = (content: string) => {
		this._addNewMessage(content, "user");
		this._sendMessagesToAi();
	};

	private _prepareMessagesForAi = (messages: Message[]) => {
		const messagesForAi = messages
			.sort((a, b) => a.timestamp - b.timestamp)
			.map((msg) => ({ role: msg.role, content: msg.content }));

		return messagesForAi;
	};

	public pushMessage = (content: string, role: Message["role"]) => {
		this._addNewMessage(content, role);
	};

	private _addNewMessage = (content: string, role: Message["role"]) => {
		const message = new MessageStore(this);

		message.setContent(content);
		message.setRole(role);

		this._messages.set(message.id, message);

		return message;
	};

	private _sendMessagesToAi = async () => {
		const messageHistory = this._prepareMessagesForAi(this.messages);
		const messageFromAi = this._addNewMessage("", "assistant");

		const aiFinalAnswer = await this._aiStore.sendMessage(
			messageHistory,
			this.workspace.model,
			messageFromAi.setContent,
		);

		// check for update title of this chat
		if (aiFinalAnswer && this._messages.size >= 2 && !this.name) {
			this._updateChatTitle();
		}
	};

	public stopStreaming = () => {
		this._aiStore.abortRequest();
	};
}
