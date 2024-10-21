class Api {
	private _dev: boolean;
	private _baseUrl: string;
	private _prefix: string;

	constructor() {
		this._dev = process.env.NODE_ENV === "development";
		this._baseUrl = "";
		this._prefix = "/api";

		if (this._dev) {
			this._baseUrl = "http://localhost:4000";
		}
	}

	private _fetch = <T>(...args: Parameters<typeof fetch>) => {
		if (typeof args[0] === "string") {
			args[0] = this._buildPath(args[0]);
		}

		return new Promise<T>((res, rej) => {
			fetch(...args)
				.then((result) => res(result.json()))
				.catch(rej);
		});
	};

	private _buildPath = (path: string) => {
		return this._baseUrl + this._prefix + path;
	};

	public registerUser = (params: {
		username: string;
		password: string;
		key: string;
	}) => {
		return this._fetch<{ token: string }>("/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(params),
		});
	};

	// public initClient = () => {
	//   return initClient(c, {
	//     baseUrl: `${this._baseUrl}/api`,
	//     baseHeaders: {},
	//     api: async (args: ApiFetcherArgs & { useMock?: string }) => {
	//       const token = LsBase.get('token');

	//       // public access
	//       if (token) {
	//         args.headers.authorization = `Bearer ${token}`;

	//         if (this._mockServer.isRunning()) {
	//           this._mockServer.shutdown();
	//         }
	//       } else if (!this._mockServer.isRunning()) {
	//         this._mockServer.init();
	//       }

	//       // const promise = fetch(args.path, {
	//       //   method: args.method,
	//       //   headers: args.headers,
	//       //   body: args.body,
	//       // });

	//       const promise = logFetch({ args, promise: tsRestFetchApi });
	//       const delayed = minTime(promise, this._dev ? 0 : 0);

	//       return delayed();
	//     },
	//   });
	// };
}

export const api = new Api();
