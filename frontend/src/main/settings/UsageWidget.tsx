import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../store/root.store";
import type { VitalProps } from "../../utils/types";
import { Card, CardContent, Typography, LinearProgress, Box } from "@mui/material";
import { DollarSign } from "lucide-react";

type UsageWidgetProps = {} & VitalProps;

export const UsageWidget = observer((props: UsageWidgetProps) => {
	const store = useRootStore();
	const credits = store.openrouterStore.creditsRemaining;
	const usage = credits?.usage || 0;
	const limit = credits?.limit || 100; // Default limit if not available
	const usagePercentage = limit ? (usage / limit) * 100 : 0;

	return (
		<Card className={clsx("w-full", props.className)} sx={{ backgroundColor: "var(--bg-secondary)" }}>
			<CardContent>
				<Box className={clsx("flex items-center mb-3")}>
					<DollarSign size={20} className="text-[var(--primary)] mr-2" />
					<Typography variant="h6" component="h3" sx={{ color: "var(--text-primary)", fontWeight: 600 }}>
						Usage & Credits
					</Typography>
				</Box>

				<Box className={clsx("space-y-3")}>
					<Box>
						<Typography variant="body2" sx={{ color: "var(--text-secondary)", marginBottom: "4px" }}>
							Current Usage
						</Typography>
						<Typography variant="h5" sx={{ color: "var(--text-primary)", fontWeight: 600 }}>
							${usage.toFixed(2)}
						</Typography>
					</Box>

					{limit !== null && (
						<Box>
							<Typography variant="body2" sx={{ color: "var(--text-secondary)", marginBottom: "4px" }}>
								Progress
							</Typography>
							<LinearProgress
								variant="determinate"
								value={Math.min(usagePercentage, 100)}
								sx={{
									height: 8,
									borderRadius: 4,
									backgroundColor: "var(--bg-tertiary)",
									"& .MuiLinearProgress-bar": {
										backgroundColor: usagePercentage > 80 ? "var(--error)" : "var(--primary)",
										borderRadius: 4,
									},
								}}
							/>
							<Typography variant="caption" sx={{ color: "var(--text-secondary)", marginTop: "4px" }}>
								{Math.min(usagePercentage, 100).toFixed(1)}% of ${limit.toFixed(2)} limit
							</Typography>
						</Box>
					)}

					{limit === null && (
						<Box>
							<Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
								Unlimited credits available
							</Typography>
						</Box>
					)}

					{usagePercentage > 80 && limit !== null && (
						<Box className={clsx("bg-[var(--error-bg)] p-2 rounded-md")}>
							<Typography variant="caption" sx={{ color: "var(--error)" }}>
								⚠️ You've used most of your credits. Consider adding more funds.
							</Typography>
						</Box>
					)}
				</Box>
			</CardContent>
		</Card>
	);
});
