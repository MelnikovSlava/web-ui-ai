import React, { FC } from "react";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { Chat } from "./message-list/Chat";
import { WorkspaceSettings } from "./workspace-settings/WorkspaceSettings";
import { useGlobalStore } from "../store/global.store";
import { Settings } from "./settings/Settings";

export const Main = observer(() => {
	const store = useGlobalStore();

	if (store.view === "chat") {
		return <Chat />;
	}

	if (store.view === "workspace") {
		return <WorkspaceSettings />;
	}

	if (store.view === "settings") {
		return <Settings />;
	}
});
