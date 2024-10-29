import { createContext, useContext, useRef } from "react";

export const useCreateStore = <T>(s: T): T => {
	const store = useRef<T>(s);

	return store.current;
};

export const getStoreContext = <T>() => {
	const context = createContext<T>(null as any);
	const hook = () => useContext(context);

	return {
		context,
		hook,
	};
};
