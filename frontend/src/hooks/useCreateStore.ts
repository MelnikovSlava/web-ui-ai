import { createContext, useContext, useRef } from "react";

export const useCreateStore = <T>(s: T): T => {
	const store = useRef<T>(s);

	return store.current;
};

export const getStoreContext = <T>() => {
	const context = createContext<T>(null);
	const hook = () => useContext(context);

	return {
		context,
		hook,
	};
};
