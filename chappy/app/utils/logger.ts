// import type { AxiosResponse } from "axios";
// import { url } from "inspector";

// /* eslint-disable no-console */
// export function logFetch(
// 	promise: Promise<AxiosResponse<any>>,
// 	isUseMock = false,
// 	isCollapse = true,
// ) {
// 	const wrapper = () => {
// 		promise
// 			.then((response) => {
// 				const str = isUseMock
// 					? [
// 							`%c MOCK %c %c ${response.request.method.toUpperCase()} %c ${response.request.url}`,
// 							"border: 1px solid yellow; color: white;",
// 							"",
// 							"background-color: green; color: white",
// 							"",
// 						]
// 					: [
// 							`%c ${response.request.method.toUpperCase()} `,
// 							"background-color: green; color: white",
// 							`${response.request.url}`,
// 						];

// 				if (isCollapse) {
// 					console.groupCollapsed(...str);
// 				} else {
// 					console.group(...str);
// 				}

// 				console.log("HOST: ", window.location.origin);
// 				console.log("HANDLER: ", response.request.url);

// 				if (response.request.options?.headers !== undefined) {
// 					console.log("PARAMS: ", response.request.options.headers);
// 				}

// 				console.log("METHOD: ", response.request.method.toUpperCase());

// 				if (!response.request.options?.useAutorization) {
// 					console.log("NOT AUTHORIZE");
// 				}

// 				if (response.request.data !== undefined) {
// 					console.log("SENDING REQUEST OBJECT: ", response.request.data);
// 				}

// 				console.log(`RESPONSE STATUS: ${response.status}`);
// 				console.log("RESPONSE DATA: ", response.data);
// 				console.groupEnd();
// 			})
// 			.catch((error) => {
// 				const str = isUseMock
// 					? [
// 							`%c MOCK %c %c ${method.toUpperCase()} %c ${url}`,
// 							"border: 1px solid yellow; color: white;",
// 							"",
// 							"background-color: red; color: white",
// 							"",
// 						]
// 					: [
// 							`%c ${method.toUpperCase()} `,
// 							"background-color: red; color: white",
// 							`${url}`,
// 						];

// 				if (isCollapse) {
// 					console.groupCollapsed(...str);
// 				} else {
// 					console.group(...str);
// 				}

// 				console.log("HOST: ", window.location.origin);
// 				console.log("HANDLER: ", url);
// 				console.log("METHOD: ", method.toUpperCase());

// 				if (data !== undefined) {
// 					console.log("SENDING REQUEST OBJECT: ", data);
// 				}

// 				if (error.response) {
// 					console.log("RESPONSE DATA: ", error.response.data);
// 				}

// 				console.log("ERROR: ", error);
// 				console.groupEnd();
// 			});

// 		return result;
// 	};

// 	return wrapper;
// }
