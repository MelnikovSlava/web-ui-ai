import { makeAutoObservable } from "mobx";
import type { IndexedDb } from "./indexed-db";
import type { Chat, Workspace } from "./types";
import { ChatStore } from "./chat.store";
import { RootStore } from "./root.store";
import { INIT_CHAT_TITLE } from "../utils/constants";

export class WorkspaceStore {
  private _db: IndexedDb;
  private _root: RootStore;

  public workspace: Workspace;
  public chats: Map<Chat["id"], ChatStore>;

  constructor(workspace: Workspace, db: IndexedDb, root: RootStore) {
    this.workspace = workspace;
    this._root = root;
    this._db = db;

    this.chats = new Map();

    this._init();

    makeAutoObservable(this);
  }

  public get name() {
    return this.workspace.name;
  }

  public get id() {
    return this.workspace.id;
  }

  public get model() {
    return this.workspace.model;
  }

  public get defaultChat() {
    return [...this.chats.values()].find((c) => c.isDefault);
  }

  private _init = async () => {
    const allChats = await this._db.getChats(this.workspace.id);

    allChats.forEach(this._addChatToStore);
  };

  private _addChatToStore = async (chat: Chat) => {
    const newChat = new ChatStore(chat, this.model, this._db, this._root);
    await newChat.init();
    this.chats.set(chat.id, newChat);
  };

  public createNewChat = async () => {
    const workspaceId = this.workspace.id;
    const chat = await this._db.createChat(workspaceId, '');

    await this._addChatToStore(chat);

    this._root.selectChat(chat.id);
  };

  public updateWorkspace = async (data: { title?: string, model?: string }) => {
    const { title = this.workspace.name, model = this.workspace.model } = data;

    await this._db.updateWorkspace(this.workspace.id, title, model);

    this.workspace.name = title;
    this.workspace.model = model;

    this._init();
  };
}
