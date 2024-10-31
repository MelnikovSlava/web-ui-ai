import type { AxiosInstance } from "axios";

export function setupAxiosLogging(
	axiosInstance: AxiosInstance,
	isUseMock = false,
) {
	axiosInstance.interceptors.request.use(
		(config) => {
			return config;
		},
		(error) => {
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

			console.groupCollapsed(...str);
			console.log("HOST: ", window.location.origin);
			console.log("HANDLER: ", error.config.url);
			console.log("METHOD: ", error.config.method.toUpperCase());
			console.log("ERROR: ", error);
			console.groupEnd();

			return Promise.reject(error);
		},
	);
	axiosInstance.interceptors.response.use(
		(response) => {
			const method = response.config.method?.toUpperCase();
			const url = response.config.url;
			const host = window.location.origin;

			let str = [
				`%c ${method} `,
				"background-color: green; color: white",
				`${url}`,
			];

			if (isUseMock) {
				str = [
					`%c MOCK %c %c ${method} %c ${url}`,
					"border: 1px solid yellow; color: white;",
					"",
					"background-color: green; color: white",
					"",
				];
			}

			console.groupCollapsed(...str);
			console.log("HOST: ", host);
			console.log("HANDLER: ", url);
			console.log("METHOD: ", method);

			if (response.config.headers !== undefined) {
				console.log("PARAMS: ", response.config.headers);
			}

			if (response.data !== undefined) {
				console.log("RESPONSE DATA: ", response.data);
			}

			console.log(`RESPONSE STATUS: ${response.status}`);
			console.groupEnd();

			return response;
		},
		(error) => {
			const method = error.config.method?.toUpperCase();
			const url = error.config.url;
			const host = window.location.origin;

			let str = [
				`%c ${method} `,
				"background-color: red; color: white",
				`${url}`,
			];

			if (isUseMock) {
				str = [
					`%c MOCK %c %c ${method} %c ${url}`,
					"border: 1px solid yellow; color: white;",
					"",
					"background-color: red; color: white",
					"",
				];
			}

			console.groupCollapsed(...str);
			console.log("HOST: ", host);
			console.log("HANDLER: ", url);
			console.log("METHOD: ", method);

			if (error.response) {
				console.log("RESPONSE DATA: ", error.response.data);
			}

			console.log("ERROR: ", error);
			console.groupEnd();

			return Promise.reject(error);
		},
	);
}
