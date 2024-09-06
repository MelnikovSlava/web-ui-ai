export interface Workspace {
  id: number;
  name: string;
  model: string;
}

export interface Chat {
  id: number;
  workspaceId: number;
  name: string;
  default: boolean;
  timestamp: number;
}

export type MessageBase = {
  chatId: number;
  content: string;
  role: "user" | "assistant";
};

export type Message = MessageBase & {
  id: number;
  timestamp: number;
};
