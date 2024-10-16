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

export type Key = {
  label: string;
  usage: number; // Number of credits used
  limit: number | null; // Credit limit for the key, or null if unlimited
  is_free_tier: boolean; // Whether the user has paid for credits before
  rate_limit: {
    requests: number; // Number of requests allowed...
    interval: string; // in this interval, e.g. "10s"
  };
};

export type Model = {
  id: string;
  name: string;
  description: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  context_length: number;
  top_provider: string;
};
