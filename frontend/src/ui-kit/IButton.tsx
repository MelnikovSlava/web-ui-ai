import { Button, type ButtonProps } from "@mui/joy";

type IButtonProps = ButtonProps;

export const IButton = (props: IButtonProps) => {
	const { title, ...rest } = props;
	return (
		<Button color="primary" size="md" variant="solid" {...rest}>
			{title}
		</Button>
	);
};
