import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { useRootStore } from "../../store/root.store";
import type { VitalProps } from "../../utils/types";
import {
  FormControl,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@mui/material";
import numerify from 'numerify';
import { Star } from "lucide-react";
import { usePromise } from "../../hooks/usePromise";
import { MainLayout } from "../../layouts/MainLayout";
import { PageContainer } from "../../layouts/containers/PageContainer";

type ModelsProps = {} & VitalProps;

export const Models = observer((props: ModelsProps) => {
	const store = useRootStore();

	const [value, setValue] = useState<string>("");

	const onAdd = usePromise({
		func: store.addModelAction,
	});

	const onRemove = usePromise({
		func: store.deleteModelAction,
	});

	const models = store.openrouterStore.models.filter((model) =>
		model.name.toLowerCase().includes(value.toLowerCase()),
	);

	const round = (num: number) => {
		return parseFloat(num.toFixed(2));
	}

	const getText = (text: string, value: string | number) => {
		return `${text}: ${value}$`
	}

	const sorted = useMemo(() => {
		return models.sort((a, b) => {
			return store.inCollection(a.id) ? -1 : store.inCollection(b.id) ? 1 : 0;
		});
	}, [models, store.models.length]);

	return (
		<MainLayout className={clsx("items-start")}>
			<PageContainer className={clsx('pb-4')}>
				<h1 className={clsx("text-[28px] font-bold", "mb-5")}>Models</h1>

					<FormControl sx={{ mb: 2 }} className={clsx('self-start')}>
						<TextField
							value={value}
							onChange={(e) => {
								setValue(e.target.value);
							}}
							placeholder="Search models..."
						/>
					</FormControl>

					<TableContainer 
						sx={{ 
							height: '100%',
							borderRadius: '8px',
							border: '1px solid',
							borderColor: 'var(--main-border)'
						}}
					>
						<Table stickyHeader size="small">
							<TableHead>
								<TableRow>
									<TableCell sx={{ minWidth: '60px' }}>
										<Star className="w-4 h-4 mx-auto" />
									</TableCell>
									<TableCell sx={{ pr: 3, pl: 1, py: 1.5, minWidth: '400px' }}>
										Name
									</TableCell>
									<TableCell sx={{ pr: 3, pl: 1, py: 1.5, minWidth: '180px' }}>
										Price
									</TableCell>
									<TableCell sx={{ pr: 3, pl: 1, py: 1.5, minWidth: '100px' }}>
										Context
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{sorted.map((model) => {
									const pricePrompt = round(parseFloat(model.pricing.prompt) * 1000000);
									const priceCompletion = round(parseFloat(model.pricing.completion) * 1000000);
									const context = numerify(model.context_length, '0 a');
									const inCollection = store.inCollection(model.id);

									const isFree = pricePrompt === 0 && priceCompletion === 0;

									return <TableRow
										key={model.id}
										sx={{
											borderBottom: '1px solid',
											borderColor: 'var(--main-border)',
											'&:hover': { backgroundColor: 'grey.800' }
										}}
									>
										<TableCell 
											sx={{ cursor: 'pointer', minWidth: '60px'}} 
											onClick={() => {
												if (inCollection) {
													onRemove.promise(model.id)
												} else {
													onAdd.promise(model.id)
												}
											}}
										>
											<Star className={clsx('w-4 h-4 mx-auto', inCollection && "text-[#FFD700]")} fill={inCollection ? "#FFD700": undefined} />
										</TableCell>
										<TableCell sx={{ pr: 3, pl: 1, py: 2, fontWeight: 'medium', whiteSpace: 'nowrap', minWidth: '300px' }}>
											<span className={clsx("flex flex-col")}>
												<span>{model.name}</span>
												<span className={clsx("text-xs opacity-50")}>{model.id}</span>
											</span>
										</TableCell>
										<TableCell sx={{ pr: 3, pl: 1, py: 2, minWidth: '150px' }}>
											{isFree ? <span className={clsx('text-green-700', "")}>Free</span>: 
											<span className={clsx("flex flex-col", "text-xs opacity-50")}>
												<span>{getText('Prompt', pricePrompt)}</span>
												<span>{getText('Completion', priceCompletion)}</span>
											</span>}
										</TableCell>
										<TableCell sx={{ pr: 3, pl: 1, py: 2, minWidth: '100px' }}>{context}</TableCell>
									</TableRow>
								})}
							</TableBody>
						</Table>
					</TableContainer>
			</PageContainer>
		</MainLayout>
	);
});
