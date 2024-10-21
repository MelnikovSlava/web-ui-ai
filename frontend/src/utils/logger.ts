/* eslint-disable no-console */
export function logFetch(
	promise: ApiFunction,
	isUseMock: boolean,
	isCollapse: boolean,
) {
	console.clear();

	const wrapper: ApiFunction = (method, url, data, options) => {
		const result = promise(method, url, data, options);

		result
			.then((response) => {
				const str = isUseMock
					? [
							`%c MOCK %c %c ${method.toUpperCase()} %c ${url}`,
							"border: 1px solid yellow; color: white;",
							"",
							"background-color: green; color: white",
							"",
						]
					: [
							`%c ${method.toUpperCase()} `,
							"background-color: green; color: white",
							`${url}`,
						];

				if (isCollapse) {
					console.groupCollapsed(...str);
				} else {
					console.group(...str);
				}

				console.log("HOST: ", window.location.origin);
				console.log("HANDLER: ", url);

				if (options?.headers !== undefined) {
					console.log("PARAMS: ", options.headers);
				}

				console.log("METHOD: ", method.toUpperCase());

				if (!options?.useAutorization) {
					console.log("NOT AUTHORIZE");
				}

				if (data !== undefined) {
					console.log("SENDING REQUEST OBJECT: ", data);
				}

				console.log(`RESPONSE STATUS: ${response.status}`);
				console.log("RESPONSE DATA: ", response.data);
				console.groupEnd();
			})
			.catch((error) => {
				const str = isUseMock
					? [
							`%c MOCK %c %c ${method.toUpperCase()} %c ${url}`,
							"border: 1px solid yellow; color: white;",
							"",
							"background-color: red; color: white",
							"",
						]
					: [
							`%c ${method.toUpperCase()} `,
							"background-color: red; color: white",
							`${url}`,
						];

				if (isCollapse) {
					console.groupCollapsed(...str);
				} else {
					console.group(...str);
				}

				console.log("HOST: ", window.location.origin);
				console.log("HANDLER: ", url);
				console.log("METHOD: ", method.toUpperCase());

				if (data !== undefined) {
					console.log("SENDING REQUEST OBJECT: ", data);
				}

				if (data in error) {
					console.log("RESPONSE DATA: ", error.data);
				}

				console.log("ERROR: ", error);
				console.groupEnd();
			});

		return result;
	};

	return wrapper;
}
