import { makeAutoObservable } from "mobx";
import { getStoreContext } from "../hooks/useCreateStore";
import { DEFAULT_MODEL } from "../utils/constants";
import { generateNewId } from "../utils/utils";
import { ChatStore } from "./chat.store";
import type { MessageStore } from "./message.store";
import type { RootStore } from "./root.store";
import type { Chat, Message, Workspace } from "./types";

export class WorkspaceStore implements Workspace {
	private _chats: Map<Chat["id"], ChatStore>;

	public id: number;
	public name: string;
	public model: string;

	public root: RootStore;

	constructor(rootStore: RootStore) {
		this.id = generateNewId(rootStore.allWorkspaces);
		this.name = "";
		this.model = DEFAULT_MODEL;

		this._chats = new Map();

		this.root = rootStore;

		makeAutoObservable(this);
	}

	public get chats() {
		return [...this._chats.values()];
	}

	public serialize = () => {};

	public deserialize = (
		workspace: Workspace,
		chats: Chat[],
		messages: Message[],
	) => {
		this.id = workspace.id;
		this.name = workspace.name;
		this.model = workspace.model;

		chats
			.filter((chat) => chat.workspaceId === this.id)
			.forEach((chat) => {
				const store = new ChatStore(this);
				store.deserialize(chat, messages);

				this._chats.set(store.id, store);
			});
	};

	public getChat = (chatId: number) => {
		const chat = this._chats.get(chatId);

		if (!chat) {
			throw new Error("Chat not found");
		}

		return chat;
	};

	public createNewChat = () => {
		const store = new ChatStore(this);

		this._chats.set(store.id, store);

		return store;
	};

	public forkChat = (message: MessageStore) => {
		const donorChat = this.getChat(message.chatId);
		const newChat = this.createNewChat();

		donorChat.messages
			.filter((msg) => msg.id <= message.id)
			.forEach((msg) => newChat.pushMessage(msg.content, msg.role));

		return newChat;
	};

	public deleteChat = (chatId: number) => {
		this._chats.delete(chatId);
	};

	public updateWorkspace = (data: { name?: string; model?: string }) => {
		if (data.name !== undefined) {
			this.name = data.name;
		}

		if (data.model !== undefined) {
			this.model = data.model;
		}
	};
}

export const WorkspaceStoreData = getStoreContext<WorkspaceStore>();
