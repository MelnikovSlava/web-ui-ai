import { remove } from "lodash-es";
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
	public messageStores: MessageStore[];

	constructor(data: Chat, workspaceStore: WorkspaceStore) {
		this._aiStore = new AiStore();
		this.messageStores = [];
		this.data = data;
		this.workspace = workspaceStore;

		makeAutoObservable(this);
	}

	public get messages() {
		return this.messageStores.map((m) => m.data);
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
					remove(this.messageStores, (m) => m.data.id === messageId);
				}
			},
		});
	};

	public onEditMessage = async (messageId: number, newContent: string) => {
		const editedMessage = this.messageStores.find(
			(m) => m.data.id === messageId,
		);

		if (!editedMessage) {
			console.error("Message not found");
			return;
		}

		// Get all messages after the edited message
		const messagesToDeleteIds = this.messages
			.filter((msg) => msg.id > messageId)
			.map((m) => m.id);

		// Delete messages after the edited one
		await this.deleteMessages(messagesToDeleteIds);
		await resolvePromise({
			promise: () => api.updateMessage(messageId, newContent),
			resolve: () => {
				// Update the message content in the local store
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
				const messageStore = new MessageStore(message, this);
				this.messageStores.push(messageStore);
			});
	};

	public inputMessage = async (content: string) => {
		const msgStore = this._addNewMessage(content, "user");

		return resolvePromise({
			promise: () =>
				api.addMessage({
					chatId: this.data.id,
					content,
					role: "user",
				}),
			resolve: ({ data }) => {
				this._replaceDataForMessage(msgStore, data);
				this._sendMessagesToAi();
			},
			reject: () => {
				remove(this.messageStores, (m) => m.data.id === msgStore.data.id);
			},
		});
	};

	private _prepareMessagesForAi = (messages: Message[]) => {
		const messagesForAi = messages
			.sort((a, b) => a.timestamp - b.timestamp)
			.map((msg) => ({ role: msg.role, content: msg.content }));

		return messagesForAi;
	};

	private _addNewMessage = (content: string, role: Message["role"]) => {
		const msg: Message = {
			id: -1,
			content,
			role,
			chatId: this.data.id,
			timestamp: Date.now(),
		};

		const messageStore = new MessageStore(msg, this);
		this.messageStores.push(messageStore);

		return messageStore;
	};

	private _sendMessagesToAi = async () => {
		const messageHistory = this._prepareMessagesForAi(this.messages);
		const messageFromAi = this._addNewMessage("", "assistant");

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
				this._replaceDataForMessage(messageFromAi, data);
			},
		});

		// check for update title of this chat
		const emptyNameOfChat = this.data.name === "";
		const enoughMessages = this.messageStores.length >= 2;

		if (emptyNameOfChat && enoughMessages) {
			this._updateChatTitle();
		}
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
