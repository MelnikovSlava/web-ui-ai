import type { AxiosResponse } from "axios";

/* eslint-disable no-console */
export function logAxios(
	promise: Promise<AxiosResponse<any>>,
	isUseMock = false,
	isCollapse = true,
) {
	const wrapper = () => {
		promise
			.then((response) => {
				const str = isUseMock
					? [
							`%c MOCK %c %c ${response.request.method.toUpperCase()} %c ${response.request.url}`,
							"border: 1px solid yellow; color: white;",
							"",
							"background-color: green; color: white",
							"",
						]
					: [
							`%c ${response.request.method.toUpperCase()} `,
							"background-color: green; color: white",
							`${response.request.url}`,
						];

				if (isCollapse) {
					console.groupCollapsed(...str);
				} else {
					console.group(...str);
				}

				console.log("HOST: ", window.location.origin);
				console.log("HANDLER: ", response.request.url);

				if (response.config.headers !== undefined) {
					console.log("PARAMS: ", response.config.headers);
				}

				console.log("METHOD: ", response.request.method.toUpperCase());

				if (response.data !== undefined) {
					console.log("RESPONSE DATA: ", response.data);
				}

				console.log(`RESPONSE STATUS: ${response.status}`);
				console.groupEnd();
			})
			.catch((error) => {
				const str = isUseMock
					? [
							`%c MOCK %c %c ${error.config.method.toUpperCase()} %c ${error.config.url}`,
							"border: 1px solid yellow; color: white;",
							"",
							"background-color: red; color: white",
							"",
						]
					: [
							`%c ${error.config.method.toUpperCase()} `,
							"background-color: red; color: white",
							`${error.config.url}`,
						];

				if (isCollapse) {
					console.groupCollapsed(...str);
				} else {
					console.group(...str);
				}

				console.log("HOST: ", window.location.origin);
				console.log("HANDLER: ", error.config.url);
				console.log("METHOD: ", error.config.method.toUpperCase());

				if (error.response) {
					console.log("RESPONSE DATA: ", error.response.data);
				}

				console.log("ERROR: ", error);
				console.groupEnd();
			});
	};

	return wrapper;
}
