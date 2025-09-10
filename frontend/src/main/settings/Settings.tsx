import { Button } from "@mui/material";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { MainLayout } from "../../layouts/MainLayout";
import { PageBottom } from "../../layouts/containers/PageBottom";
import { PageContainer } from "../../layouts/containers/PageContainer";
import { useRootStore } from "../../store/root.store";
import { InputToken } from "./InputToken";
import { SelectTheme } from "./SelectTheme";
import { TabModels } from "./TabModels";
import { TitleModelSelect } from "./TitleModelSelect";

export const Settings = observer(() => {
	const store = useRootStore();

	return (
		<MainLayout className={clsx("items-start")}>
			<PageContainer>
				<h1 className={clsx("text-[28px] font-bold", "mb-6")}>Settings</h1>

				<div className={clsx("space-y-6")}>
					{/* Common Settings */}
					<div className={clsx("space-y-6")}>
						<InputToken />
						<TitleModelSelect />
					</div>

					{/* Appearance Settings */}
					<div className={clsx("space-y-4")}>
						<div className={clsx("grid grid-cols-1 md:grid-cols-2 gap-6")}>
							<SelectTheme />
						</div>
					</div>
				</div>
			</PageContainer>
		</MainLayout>
	);
});
