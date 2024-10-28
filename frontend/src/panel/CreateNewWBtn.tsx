import { Button } from "@mui/joy";
import clsx from "clsx";
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from "react-router";
import { routes } from "../router";
import { useRootStore } from "../store/root.store";
import type { VitalProps } from "../utils/types";

type CreateNewWBtnProps = {} & VitalProps;

export const CreateNewWBtn = (props: CreateNewWBtnProps) => {
	const navigate = useNavigate();
	const rootStore = useRootStore();

	return (
		<Button
			onClick={() => {
				const store = rootStore.createNewWorkspace();

				navigate(routes.workspace(store.id));
			}}
			startDecorator={<IoIosAdd size={22} />}
			className={clsx("", props.className)}
			size="md"
			variant="outlined"
			sx={{
				background: "none",
				color: "inherit",
				height: "46px",
				borderColor: "white",
				opacity: "60%",
				width: "100%",

				"&:hover": {
					background: "none",
					color: "inherit",
					opacity: "100%",
				},
			}}
		>
			Create new space
		</Button>
	);
};
