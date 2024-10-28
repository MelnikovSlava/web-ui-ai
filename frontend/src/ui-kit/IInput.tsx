import { FormControl, FormLabel, Input, type InputProps } from "@mui/joy";
import type { VitalProps } from "../utils/types";

type IInputProps = {
	label?: string;
} & VitalProps &
	InputProps;

export const IInput = (props: IInputProps) => {
	const { label, ...rest } = props;

	return (
		<FormControl>
			<FormLabel sx={{ color: "inherit" }}>{props.label}</FormLabel>
			<Input {...rest} />
		</FormControl>
	);
};
