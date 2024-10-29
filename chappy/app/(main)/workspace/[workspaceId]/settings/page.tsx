"use client";
import CheckWorkspaceExist from "../CheckWorkspaceExist";
import { WorkspaceSettings } from "./WorkspaceSettings";

export default function WorkspaceSettingsPage() {
	return (
		<CheckWorkspaceExist>
			<WorkspaceSettings />
		</CheckWorkspaceExist>
	);
}
