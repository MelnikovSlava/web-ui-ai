export class IndexedDb {
	private db: IDBDatabase | null = null;
	private readonly dbName = "ChatApp";
	private readonly dbVersion = 1;

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
				db.createObjectStore("dataStore", { keyPath: "date" });
			};
		});
	}

	private getObjectStore(
		storeName: string,
		mode: IDBTransactionMode,
	): { store: IDBObjectStore; transaction: IDBTransaction } {
		if (!this.db) {
			throw new Error("Database not initialized");
		}
		const transaction = this.db.transaction(storeName, mode);
		const store = transaction.objectStore(storeName);
		return { store, transaction };
	}

	async addData(date: number, data: string): Promise<void> {
		const { store, transaction } = this.getObjectStore(
			"dataStore",
			"readwrite",
		);
		return new Promise((resolve, reject) => {
			const request = store.put({ date, data });
			transaction.onerror = () => reject(transaction.error);
			transaction.oncomplete = () => resolve();
		});
	}

	async getData(date: number): Promise<string | null> {
		const { store, transaction } = this.getObjectStore("dataStore", "readonly");
		return new Promise((resolve, reject) => {
			const request = store.get(date);
			transaction.onerror = () => reject(transaction.error);
			request.onsuccess = () =>
				resolve(request.result ? request.result.data : null);
		});
	}
}
