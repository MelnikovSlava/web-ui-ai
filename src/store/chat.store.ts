import { makeAutoObservable, runInAction } from "mobx";
import type { IndexedDb } from "./indexed-db";
import type { Chat, Message, MessageBase } from "./types";
import type { RootStore } from "./global.store";
import { AiStore } from "./ai.store";

export class ChatStore {
	private _db: IndexedDb;
	private _root: RootStore;
	private _messages: Map<Message["id"], Message>;

	public chat: Chat;
	public model: string;
	public input: string;
	public currentStreamedMessage: Message;

	constructor(data: Chat, model: string, db: IndexedDb, root: RootStore) {
		this.chat = data;
		this._root = root;
		this.model = model;
		this._db = db;
		this._messages = new Map();
		this.input = "";
		this.currentStreamedMessage = {
			id: -1,
			timestamp: 0,
			chatId: this.chat.id,
			content: "",
			role: "assistant",
		};

		makeAutoObservable(this);
	}

	public get messages() {
		return Array.from(this._messages.values());
	}

	public get createdTimestamp() {
		return this.chat.timestamp;
	}

	public get isDefault() {
		return this.chat.default;
	}

	private get _aiStore() {
		return this._root.aiStore;
	}

	public get isStreaming() {
		return this._aiStore.isStreaming;
	}

	public async init() {
		const messages = await this._db.getMessages(this.chat.id);
		this._messages = new Map(messages.map((m) => [m.id, m]));
	}

	public setInput = (input: string) => {
		this.input = input;
	};

	private async _updateChatTitle() {
		const ai = new AiStore(this._root);

		const firstTwoMessages = this.messages.slice(0, 2);
		const messagesForAi = this._prepareMessagesForAi(firstTwoMessages);

		messagesForAi.push({
			content:
				"Write a short name for the chat. From 2 to 4 words. The title must be in the same language as the chat conversation. Choose the appropriate emoji for the title of this chat. Answer, like json object, example: {title: 'Title', emoji: 'emoji'}",
			role: "user",
		});

		const response = await ai.sendMessage(messagesForAi);

		if (response) {
			const jsonRegex = /\{.*\}/s;
			const match = response.match(jsonRegex);

			if (match) {
  const jsonString = match[0];
  const parsedObject = JSON.parse(jsonString);

				const title = `${parsedObject.emoji} ${parsedObject.title}`;

			await this._db.updateChatName(this.chat.id, title);

			runInAction(() => {
				this.chat.name = title;
			});
} else {
  console.error('Объект JSON не найден');
}
		}
	}

	public async deleteMessage(msg: Message) {
		if (msg.id === -1) {
			this.currentStreamedMessage.content = "";
		} else {
			runInAction(() => {
				this._messages.delete(msg.id);
			});

			await this._db.deleteMessage(msg.id);
		}
	}

	public onEditMessage = async (messageId: number, newContent: string) => {
		const editedMessage = this._messages.get(messageId);

		if (!editedMessage) {
			console.error("Message not found");
			return;
		}

		// Update the message content in the local store
		runInAction(() => {
			editedMessage.content = newContent;
			this._messages.set(messageId, editedMessage);
		});

		// Update the message content in the database
		await this._db.updateMessageContent(messageId, newContent);

		// Get all messages after the edited message
		const messagesToDelete = this.messages.filter(
			(msg) => msg.timestamp > editedMessage.timestamp,
		);

		// Delete messages after the edited one
		for (const msg of messagesToDelete) {
			await this.deleteMessage(msg);
		}

		this._sendMessagesToAi();
	};

	public clearMessages = () => {
		runInAction(() => {
			this._messages.clear();
			this.currentStreamedMessage.content = "";
		});
	};

	public forkChat = async (messageId: number) => {
		const newChat = await this._db.createChat(
			this.chat.workspaceId
		);
		const messagesToCopy = this.messages.filter((msg) => msg.id <= messageId);

		for (const message of messagesToCopy) {
			await this._db.addMessage({
				chatId: newChat.id,
				content: message.content,
				timestamp: message.timestamp,
				role: message.role,
			});
		}

		const newChatStore = new ChatStore(
			newChat,
			this.model,
			this._db,
			this._root,
		);

		await newChatStore.init();

		const workspace = this._root.workspaces.get(this.chat.workspaceId);
		workspace?.chats.set(newChat.id, newChatStore);

		if (this._needToUpdateTitle(newChatStore)) {
			newChatStore._updateChatTitle();
		}

		this._root.selectChat(newChat.id);
	};

	public inputMessage = async (content: string) => {
		const userMessage: MessageBase = {
			chatId: this.chat.id,
			role: "user",
			content,
		};

		const addedMessage = await this._db.addMessage(userMessage);

		runInAction(() => {
			this._messages.set(addedMessage.id, addedMessage);
			this.input = "";
		});

		await this._sendMessagesToAi();
	};

	private _prepareMessagesForAi = (messages: Message[]) => {
		const messagesForAi = messages
			.sort((a, b) => a.timestamp - b.timestamp)
			.map((msg) => ({ role: msg.role, content: msg.content }));

		return messagesForAi;
	};

	private _needToUpdateTitle = (chat: ChatStore) => {
		return chat.messages.length >= 2 && !chat.chat.name && !chat.chat.default;
	}

	private _sendMessagesToAi = async () => {
		const messagesForAi = this._prepareMessagesForAi(this.messages);

		const aiResponse = await this._aiStore.sendMessage(
			messagesForAi,
			this.model,
			(partial: string) => {
				runInAction(() => {
					this.currentStreamedMessage.content = partial;
				});
			},
		);

		if (aiResponse) {
			const aiMessage: MessageBase = {
				chatId: this.chat.id,
				role: "assistant",
				content: aiResponse,
			};

			const addedAiMessage = await this._db.addMessage(aiMessage);

			runInAction(() => {
				this._messages.set(addedAiMessage.id, addedAiMessage);
				this.currentStreamedMessage.content = "";

				if (this._needToUpdateTitle(this)) {
					this._updateChatTitle();
				}
			});
		}
	};

	public stopStreaming = () => {
		this._aiStore.abortRequest();
	};
}
