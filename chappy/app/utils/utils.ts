"use client";

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

export function generateRundomId(count = 10, isNum = false) {
	if (isNum) {
		let num = Math.random();

		num *= new Date().getTime();
		num *= Math.random();

		return num.toFixed(count);
	}

	let text = "";
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < count; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

export const generateNewId = (arr: { id: number }[]) => {
	const ids = arr.map((item) => item.id);

	if (ids.length === 0) {
		return 0;
	}

	const id = Math.max(...ids) + 1;

	return id;
};

export const getTimestamp = () => {
	return new Date().getTime();
};
