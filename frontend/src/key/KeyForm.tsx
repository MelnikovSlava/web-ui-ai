import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { routes } from "../router";
import { useRootStore } from "../store/root.store";
import { type KeyFormData, keySchema } from "./schema";

export const KeyForm = () => {
	const rootStore = useRootStore();
	const navigate = useNavigate();

	const form = useForm<KeyFormData>({
		resolver: zodResolver(keySchema),
	});

	const onSubmit = (data: KeyFormData) => {
		rootStore.settingsStore.setKey(data.key);
		navigate(routes.root);
	};

	return (
		<Box maxWidth="400px" className={clsx("m-auto")}>
			<Card className={clsx("p-4")}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<Typography variant="h6">Openrouter key</Typography>
					<Box display="flex" flexDirection="column" gap={2}>
						<TextField
							id="username"
							label="Key"
							placeholder="Enter your key"
							variant="outlined"
							{...form.register("key")}
							error={!!form.formState.errors.key}
							helperText={form.formState.errors.key?.message}
						/>
						<Button type="submit" variant="contained" color="primary">
							Apply
						</Button>
					</Box>
				</form>
			</Card>
		</Box>
	);
};
