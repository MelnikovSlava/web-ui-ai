import type { AxiosInstance } from "axios";

export function setupAxiosLogging(
	axiosInstance: AxiosInstance,
	isUseMock = false,
) {
	function template(result: any, status: "success" | "error") {
		const method = (result.config.method || "unknown").toUpperCase();
		const url = result.config.url || "unknown";
		const sts = result.status;
		const reqData = result.config.data;
		const resData = result.data;
		const headers = result.config.headers;
		const host = window.location.origin;

		const color = status === "success" ? "green" : "red";

		let str = [
			`%c ${method} `,
			`background-color: ${color}; color: white`,
			`${url}`,
		];

		if (isUseMock) {
			str = [
				`%c MOCK %c %c ${method} %c ${url}`,
				"border: 1px solid yellow; color: white;",
				"",
				`background-color: ${color}; color: white`,
				"",
			];
		}

		console.groupCollapsed(...str);
		console.log("STATUS: ", sts);
		console.log("HOST: ", host);
		console.log("HANDLER: ", url);
		console.log("METHOD: ", method);

		if (headers) {
			console.log("PARAMS: ", headers);
		}

		if (resData) {
			console.log("RESPONSE DATA: ", resData);
		}

		if (reqData) {
			console.log("REQUEST DATA: ", JSON.parse(reqData));
		}

		if (status === "error") {
			console.log("ERROR: ", result);
		}

		console.groupEnd();
	}

	axiosInstance.interceptors.request.use(
		(config) => {
			return config;
		},
		(error) => {
			template(error, "error");
			return Promise.reject(error);
		},
	);
	axiosInstance.interceptors.response.use(
		(response) => {
			template(response, "success");
			return response;
		},
		(error) => {
			template(error, "error");
			return Promise.reject(error);
		},
	);
}
