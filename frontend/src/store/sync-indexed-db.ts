import { reaction } from "mobx";
import { IndexedDb } from "./indexed-db";
import type { RootStore } from "./root.store";

export class SyncIndexedDb {
	private _indexedDb: IndexedDb;

	constructor(rootStore: RootStore) {
		this._indexedDb = new IndexedDb();
		this._indexedDb.init();

		reaction(
			() => [
				rootStore.allWorkspaces,
				rootStore.allChats,
				rootStore.allMessages,
			],
			async () => {
				const start = performance.now();
				const data = JSON.stringify(rootStore.serialize());
				await this._indexedDb.addData(Math.floor(Date.now() / 1000), data);
				const end = performance.now();
				const timeTaken = end - start;
				console.log(`Время выполнения: ${timeTaken} миллисекунд`);
				// console.log("Workspaces, Chats, or Messages have changed!");
			},
		);
	}
}
