import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	username: text("username").notNull().unique(),
	password: text("password").notNull(),
});

export const workspacesTable = sqliteTable("workspaces", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	model: text("model").notNull(),
	userId: integer("userId")
		.references(() => usersTable.id, { onDelete: "cascade" })
		.notNull(),
});

export const chatsTable = sqliteTable("chats", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	workspaceId: integer("workspaceId")
		.references(() => workspacesTable.id, { onDelete: "cascade" })
		.notNull(),
	name: text("name").notNull(),
	timestamp: integer("timestamp").notNull(),
});

export const messagesTable = sqliteTable("messages", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	chatId: integer("chatId")
		.references(() => chatsTable.id, { onDelete: "cascade" })
		.notNull(),
	content: text("content").notNull(),
	role: text("role").notNull(),
	timestamp: integer("timestamp").notNull(),
});

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type Workspace = typeof workspacesTable.$inferSelect;
export type NewWorkspace = typeof workspacesTable.$inferInsert;
export type Chat = typeof chatsTable.$inferSelect;
export type NewChat = typeof chatsTable.$inferInsert;
export type Message = typeof messagesTable.$inferSelect;
export type NewMessage = typeof messagesTable.$inferInsert;
