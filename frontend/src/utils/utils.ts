import { runInAction } from "mobx";

export function delayPromise<T>(
	promise: Promise<T>,
	minDelay = 1000,
): Promise<T> {
	const delayPromise = new Promise<void>((resolve) => {
		setTimeout(() => resolve(), minDelay);
	});

	return Promise.all([promise, delayPromise]).then(([result]) => result);
}

export const resolvePromise = <T>(dto: {
	promise: () => Promise<T>;
	resolve?: (result: T) => void;
	reject?: (error: Error) => void;
	finally?: () => void;
}): Promise<T> => {
	const prom = dto.promise();

	prom
		.then((result) => {
			runInAction(() => {
				dto?.resolve?.(result);
			});
		})
		.catch((error) => {
			runInAction(() => {
				dto?.reject?.(error);
			});
		})
		.finally(() => {
			runInAction(() => {
				dto?.finally?.();
			});
		});

	return prom;
};
