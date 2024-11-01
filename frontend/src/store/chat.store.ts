import { makeAutoObservable, runInAction } from "mobx";
import { api } from "../api/api";
import { resolvePromise } from "../utils/utils";
import { AiStore } from "./ai.store";
import { MessageStore } from "./message.store";
import type { Chat, Message } from "./types";
import type { WorkspaceStore } from "./workspace.store";

export class ChatStore {
	private _aiStore: AiStore;

	public data: Chat;
	public workspace: WorkspaceStore;
	public messageStores: Map<MessageStore["data"]["id"], MessageStore>;

	constructor(data: Chat, workspaceStore: WorkspaceStore) {
		this._aiStore = new AiStore();
		this.messageStores = new Map();
		this.data = data;
		this.workspace = workspaceStore;

		makeAutoObservable(this);
	}

	public get messages() {
		return Array.from(this.messageStores.values());
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
					this.data.name = title;

					resolvePromise({
						promise: () => api.updateChatName(this.data.id, title),
						resolve: () => {},
						reject: () => {
							console.error("Chat not updated");
						},
					});
				});
			} else {
				console.error("Объект JSON не найден");
			}
		}
	}

	public deleteMessages = async (messageIds: number[]) => {
		return resolvePromise({
			promise: () => api.deleteMessages(messageIds),
			resolve: () => {
				for (const messageId of messageIds) {
					this.messageStores.delete(messageId);
				}
			},
		});
	};

	public onEditMessage = async (messageId: number, newContent: string) => {
		const editedMessage = this.messageStores.get(messageId);

		if (!editedMessage) {
			console.error("Message not found");
			return;
		}

		// Get all messages after the edited message
		const messagesToDeleteIds = this.messages
			.filter((msg) => msg.data.id > messageId)
			.map((m) => m.data.id);

		if (messagesToDeleteIds.length > 0) {
			await this.deleteMessages(messagesToDeleteIds);
		}

		await resolvePromise({
			promise: () => api.updateMessage(messageId, newContent),
			resolve: () => {
				editedMessage.setContent(newContent);
			},
			reject: () => {
				console.error("Message not updated");
			},
		});

		this._sendMessagesToAi();
	};

	public deserialize = (chat: Chat, messages: Message[]) => {
		this.data = chat;

		messages
			.filter((m) => m.chatId === chat.id)
			.forEach((message) => {
				this._addNewMessage(message);
			});
	};

	public inputMessage = async (content: string) => {
		return resolvePromise({
			promise: () =>
				api.addMessage({
					chatId: this.data.id,
					content,
					role: "user",
				}),
			resolve: ({ data }) => {
				this._addNewMessage(data);
				this._sendMessagesToAi();
			},
		});
	};

	private _prepareMessagesForAi = (msgStores: MessageStore[]) => {
		const messagesForAi = msgStores
			.sort((a, b) => a.data.id - b.data.id)
			.map((msg) => ({ role: msg.data.role, content: msg.data.content }));

		return messagesForAi;
	};

	private _addNewMessage = (msg: Message) => {
		const messageStore = new MessageStore(msg, this);
		this.messageStores.set(messageStore.data.id, messageStore);

		return messageStore;
	};

	private _sendMessagesToAi = async () => {
		const messageHistory = this._prepareMessagesForAi(this.messages);

		const msg: Message = {
			id: 10000000000000000,
			content: "",
			role: "assistant",
			chatId: this.data.id,
			timestamp: Date.now(),
		};

		const messageFromAi = this._addNewMessage(msg);

		await this._aiStore.sendMessage(
			messageHistory,
			this.workspace.data.model,
			messageFromAi.setContent,
		);

		await resolvePromise({
			promise: () =>
				api.addMessage({
					chatId: this.data.id,
					content: messageFromAi.data.content,
					role: "assistant",
				}),
			resolve: ({ data }) => {
				this.messageStores.delete(messageFromAi.data.id);
				this._addNewMessage(data);
				// this._replaceDataForMessage(messageFromAi, data);
				// messageFromAi.data.id = data.id;
				// messageFromAi.data.timestamp = data.timestamp;
			},
		});

		if (this._needUpdateChatTitle()) {
			this._updateChatTitle();
		}
	};

	private _needUpdateChatTitle = () => {
		const emptyNameOfChat = this.data.name === "";
		const enoughMessages = this.messageStores.size >= 2;

		return emptyNameOfChat && enoughMessages;
	};

	private _replaceDataForMessage = (
		msgStore: MessageStore,
		updatedMsg: Message,
	) => {
		msgStore.data.id = updatedMsg.id;
		msgStore.data.timestamp = updatedMsg.timestamp;
	};

	public stopStreaming = () => {
		this._aiStore.abortRequest();
	};
}
