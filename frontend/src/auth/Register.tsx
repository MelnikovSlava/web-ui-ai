import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { usePromise } from "../hooks/usePromise";
import { routes } from "../router";
import { useShowErrorNotification } from "../ui-kit/snackbar/snackbar-manager";
import { AuthStoreData } from "./auth.store";
import { type AuthFormData, authSchema } from "./schema";

export const Register = () => {
	const authStore = AuthStoreData.hook();
	const showError = useShowErrorNotification();

	const navigate = useNavigate();

	const form = useForm<AuthFormData>({
		resolver: zodResolver(authSchema),
	});

	const registerPromise = usePromise({
		func: authStore.registrationAction,
		resolve: () => {
			navigate(routes.root);
		},
		showError: false,
		reject: (error: any) => {
			showError(error?.message);
		},
	});

	const onSubmit = async (data: AuthFormData) => {
		await registerPromise.promise(data);
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<Typography variant="h6">Create a new account</Typography>
			<Box display="flex" flexDirection="column" gap={2}>
				<TextField
					id="register-username"
					label="Username"
					placeholder="Enter your username"
					variant="outlined"
					disabled={registerPromise.loading}
					{...form.register("username")}
					error={!!form.formState.errors.username}
					helperText={form.formState.errors.username?.message}
				/>
				<TextField
					id="register-password"
					label="Password"
					type="password"
					placeholder="Enter your password"
					variant="outlined"
					disabled={registerPromise.loading}
					{...form.register("password")}
					error={!!form.formState.errors.password}
					helperText={form.formState.errors.password?.message}
				/>
				<LoadingButton
					disabled={registerPromise.loading}
					loading={registerPromise.loading}
					type="submit"
					variant="contained"
					color="primary"
				>
					Register
				</LoadingButton>
			</Box>
		</form>
	);
};
