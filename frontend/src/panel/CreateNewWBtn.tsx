import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router";
import { usePromise } from "../hooks/usePromise";
import { routes } from "../router";
import { useRootStore } from "../store/root.store";
import type { VitalProps } from "../utils/types";

type CreateNewWBtnProps = {} & VitalProps;

export const CreateNewWBtn = (props: CreateNewWBtnProps) => {
	const navigate = useNavigate();
	const rootStore = useRootStore();

	const onCreateWorkspace = usePromise({
		func: rootStore.createWorkspaceAction,
		resolve: (response) => {
			navigate(routes.workspace(response?.data.id));
		},
	});

	return (
		<LoadingButton
			onClick={() => {
				onCreateWorkspace.promise();
			}}
			// startDecorator={<IoIosAdd size={22} />}
			// className={clsx("", props.className)}
			loading={onCreateWorkspace.loading}
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
		</LoadingButton>
	);
};
