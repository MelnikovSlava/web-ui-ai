import type { Workspace, Chat, Message, MessageBase } from "./types";

export class IndexedDb {
  private db: IDBDatabase | null = null;
  private readonly dbName = "ChatApp";
  private readonly dbVersion = 3;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        const workspaceStore = db.createObjectStore("workspaces", {
          keyPath: "id",
          autoIncrement: true,
        });

        const chatStore = db.createObjectStore("chats", {
          keyPath: "id",
          autoIncrement: true,
        });

        chatStore.createIndex("workspaceId", "workspaceId", { unique: false });
        chatStore.createIndex("default", "default", { unique: false });

        const messageStore = db.createObjectStore("messages", {
          keyPath: "id",
          autoIncrement: true,
        });

        messageStore.createIndex("chatId", "chatId", { unique: false });
      };
    });
  }

  private getObjectStore(
    storeName: string,
    mode: IDBTransactionMode
  ): { store: IDBObjectStore; transaction: IDBTransaction } {
    if (!this.db) {
      throw new Error("Database not initialized");
    }
    const transaction = this.db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    return { store, transaction };
  }

  async createWorkspace(name: string, model: string): Promise<Workspace> {
    const { store, transaction } = this.getObjectStore(
      "workspaces",
      "readwrite"
    );
    return new Promise((resolve, reject) => {
      const request = store.add({ name, model });
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => {
        const id = request.result as number;
        const newWorkspace: Workspace = { id, name, model };
        resolve(newWorkspace);
      };
    });
  }

  async getWorkspaces(): Promise<Workspace[]> {
    const { store, transaction } = this.getObjectStore(
      "workspaces",
      "readonly"
    );
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve(request.result);
    });
  }

  async createChat(
    workspaceId: number,
    name = '',
    isDefault = false
  ): Promise<Chat> {
    const { store, transaction } = this.getObjectStore("chats", "readwrite");
    return new Promise((resolve, reject) => {
      const timestamp = new Date().getTime();
      const request = store.add({
        workspaceId,
        name,
        default: isDefault,
        timestamp,
      });
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => {
        const id = request.result as number;
        const newChat: Chat = {
          id,
          workspaceId,
          name,
          default: isDefault,
          timestamp,
        };
        resolve(newChat);
      };
    });
  }

  async getChats(workspaceId: number): Promise<Chat[]> {
    const { store, transaction } = this.getObjectStore("chats", "readonly");
    return new Promise((resolve, reject) => {
      const index = store.index("workspaceId");
      const request = index.getAll(workspaceId);
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve(request.result);
    });
  }

  async getDefaultChat(workspaceId: number): Promise<Chat | null> {
    const { store, transaction } = this.getObjectStore("chats", "readonly");
    return new Promise((resolve, reject) => {
      const index = store.index("default");
      const request = index.openCursor(IDBKeyRange.only(1));

      transaction.onerror = () => reject(transaction.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>)
          .result;
        if (cursor) {
          const chat = cursor.value as Chat;
          if (chat.workspaceId === workspaceId) {
            resolve(chat);
          } else {
            cursor.continue();
          }
        } else {
          resolve(null);
        }
      };
    });
  }

  async getMessages(chatId: number): Promise<Message[]> {
    const { store, transaction } = this.getObjectStore("messages", "readonly");
    return new Promise((resolve, reject) => {
      const index = store.index("chatId");
      const request = index.getAll(chatId);
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve(request.result);
    });
  }

  async addMessage(message: Partial<Message>): Promise<Message> {
    const { store, transaction } = this.getObjectStore("messages", "readwrite");
    return new Promise((resolve, reject) => {
      const timestamp = new Date().getTime();
      const request = store.add({timestamp, ...message });
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => {
        const id = request.result as number;
        const newMessage: Message = { timestamp, id, ...message } as Message;
        resolve(newMessage);
      };
    });
  }

  async deleteMessage(messageId: number): Promise<void> {
  const { store, transaction } = this.getObjectStore("messages", "readwrite");
  return new Promise((resolve, reject) => {
    const request = store.delete(messageId);
    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
}

  async updateChatName(id: number, newName: string): Promise<void> {
    const { store, transaction } = this.getObjectStore("chats", "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => {
        const chat = request.result;
        if (chat) {
          chat.name = newName;
          store.put(chat);
        } else {
          reject(new Error("Chat not found"));
        }
      };
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
    });
  }

async updateMessageContent(messageId: number, newContent: string): Promise<void> {
  const { store, transaction } = this.getObjectStore("messages", "readwrite");
  return new Promise((resolve, reject) => {
    const request = store.get(messageId);
    request.onsuccess = () => {
      const message = request.result as Message;
      if (message) {
        message.content = newContent;
        store.put(message);
      } else {
        reject(new Error("Message not found"));
      }
    };
    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
}

  async updateWorkspace(
    workspaceId: number,
    newName: string,
    newModel: string
  ): Promise<void> {
    const { store, transaction } = this.getObjectStore(
      "workspaces",
      "readwrite"
    );
    return new Promise((resolve, reject) => {
      const request = store.get(workspaceId);
      request.onsuccess = () => {
        const workspace = request.result;
        if (workspace) {
          workspace.name = newName;
          workspace.model = newModel;
          store.put(workspace);
        } else {
          reject(new Error("Workspace not found"));
        }
      };
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
    });
  }

  async deleteChat(chatId: number): Promise<void> {
    const { store: chatStore, transaction: chatTransaction } =
      this.getObjectStore("chats", "readwrite");
    const { store: messageStore, transaction: messageTransaction } =
      this.getObjectStore("messages", "readwrite");

    return new Promise((resolve, reject) => {
      chatStore.delete(chatId);

      const messageIndex = messageStore.index("chatId");
      const deleteMessagesRequest = messageIndex.openCursor(
        IDBKeyRange.only(chatId)
      );

      deleteMessagesRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>)
          .result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      chatTransaction.onerror = () => reject(chatTransaction.error);
      messageTransaction.onerror = () => reject(messageTransaction.error);

      Promise.all([
        new Promise<void>((res) => {
          chatTransaction.oncomplete = () => res();
        }),
        new Promise<void>((res) => {
          messageTransaction.oncomplete = () => res();
        }),
      ])
        .then(() => resolve())
        .catch(reject);
    });
  }

  async clearChat(chatId: number): Promise<void> {
    const { store, transaction } = this.getObjectStore("messages", "readwrite");
    return new Promise((resolve, reject) => {
      const index = store.index("chatId");
      const request = index.openCursor(IDBKeyRange.only(chatId));

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>)
          .result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
    });
  }

  async deleteWorkspace(workspaceId: number): Promise<void> {
    const { store: workspaceStore, transaction: workspaceTransaction } =
      this.getObjectStore("workspaces", "readwrite");
    const { store: chatStore, transaction: chatTransaction } =
      this.getObjectStore("chats", "readwrite");

    return new Promise((resolve, reject) => {
      workspaceStore.delete(workspaceId);

      const chatIndex = chatStore.index("workspaceId");
      const getChatRequest = chatIndex.getAll(workspaceId);

      getChatRequest.onsuccess = () => {
        const chats = getChatRequest.result as Chat[];

        for (const chat of chats) {
          this.deleteChat(chat.id).catch(reject);
        }
      };

      workspaceTransaction.onerror = () => reject(workspaceTransaction.error);
      chatTransaction.onerror = () => reject(chatTransaction.error);

      Promise.all([
        new Promise<void>((res) => {
          workspaceTransaction.oncomplete = () => res();
        }),
        new Promise<void>((res) => {
          chatTransaction.oncomplete = () => res();
        }),
      ])
        .then(() => resolve())
        .catch(reject);
    });
  }
}
