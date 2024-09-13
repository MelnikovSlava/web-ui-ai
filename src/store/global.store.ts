import { makeAutoObservable } from "mobx";
import { IndexedDb } from "./indexed-db";
import type { Workspace } from "./types";
import { WorkspaceStore } from "./workspace.store";
import { AiStore } from "./ai.store";
import { INIT_WORKSPACE_TITLE, DEFAULT_CHAT_TITLE } from "../utils/constants";
import { SettingsStore } from "./settings.store";

type View = "chat" | "workspace" | "settings";

export class RootStore {
  private _db = new IndexedDb();

  public workspaces: Map<Workspace["id"], WorkspaceStore>;

  public aiStore: AiStore;
  public settingsStore: SettingsStore;

  public view: View;
  public openWorkspaceId: number;
  public openChatId: number;

  constructor() {
    this.aiStore = new AiStore(this);
    this.settingsStore = new SettingsStore(this);
    this.workspaces = new Map();
    this.view = "chat";
    this.openWorkspaceId = 0;
    this.openChatId = 0;

    this._init();

    makeAutoObservable(this);
  }

  public get currentWorkspaceStore() {
    return this.workspaces.get(this.openWorkspaceId);
  }

  public get getChatsOfCurrentWorkspace() {
    return this.currentWorkspaceStore?.chats;
  }

  public get currentChatStore() {
    return this.currentWorkspaceStore?.chats.get(this.openChatId);
  }

  private _init = async () => {
    this._db = new IndexedDb();
    await this._db.init();
    await this._updateWorkspace();
  };

  private _updateWorkspace = async () => {
    const allWorkspaces = await this._db.getWorkspaces();

    allWorkspaces.forEach(this._addWorkspace);
  };

  private _addWorkspace = async (w: Workspace) => {
    this.workspaces.set(w.id, new WorkspaceStore(w, this._db, this));
  };

  public createNewWorkspace = async () => {
    const workspace = await this._db.createWorkspace(INIT_WORKSPACE_TITLE, "");

    const chat = await this._db.createChat(workspace.id, '', true);

    this._addWorkspace(workspace);
    this.selectWorkspace(workspace.id);
  };

  public setView(view: View) {
    this.view = view;
  }

  public selectChat(chatId: number) {
    this.view = "chat";
    this.openChatId = chatId;
  }

  public selectWorkspace(workspaceId: number) {
    this.openWorkspaceId = workspaceId;

    const chats = this.currentWorkspaceStore?.chats;

    if (chats) {
      const arr = [...chats.values()];
      const defultChat = arr.find((chat) => chat.chat.default);

      if (defultChat) {
        this.selectChat(defultChat.chat.id);
      }
    }
  }

  public setOpenWorkspaceSettings(workspaceId: number) {
    this.setView("workspace");
    this.openWorkspaceId = workspaceId;
  }

  public deleteChat = async (chatId: number) => {
    await this._db.deleteChat(chatId);
    this.currentWorkspaceStore?.chats.delete(chatId);

    if (this.openChatId === chatId) {
      const defaultChat = this.currentWorkspaceStore?.defaultChat;

      if (defaultChat) {
        this.selectChat(defaultChat.chat.id);
      } else {
        throw new Error("No default chat");
      }
    }
  };

  public clearChat = async (chatId: number) => {
    await this._db.clearChat(chatId);
    this.currentChatStore?.clearMessages();
  };

  public deleteWorkspace = async (workspaceId: number) => {
    await this._db.deleteWorkspace(workspaceId);
    this.workspaces.delete(workspaceId);

    if (this.openWorkspaceId === workspaceId) {
      if (this.workspaces.size > 0) {
        const allWorkspaces = [...this.workspaces.values()];
        this.selectWorkspace(allWorkspaces[0].id);
      } else {
        throw new Error("No workspace");
      }
    }
  };
}

export const store = new RootStore();
export const useGlobalStore = () => store;
