import type {
	IWorkerRequest,
	IWorkerResponse,
} from './messages';

export default class WorkerPool {
	readonly #worker: Worker;

	readonly #pending = new Map<
		string,
		{
			resolve: (value: unknown) => void;
			reject: (reason?: unknown) => void;
		}
	>();

	constructor() {
		this.#worker = new Worker(
			new URL('./asset.worker.ts', import.meta.url),
			{
				type: 'module',
			},
		);

		this.#worker.onmessage = (
			event: MessageEvent<IWorkerResponse>,
		) => {
			const request = this.#pending.get(event.data.id);

			if (!request) return;

			this.#pending.delete(event.data.id);

			if (event.data.success) {
				request.resolve(event.data.payload);
			}
			else {
				request.reject(
					new Error(event.data.error),
				);
			}
		};
	}

	execute<T>(
		type: string,
		payload: unknown,
	): Promise<T> {
		const id = crypto.randomUUID();

		return new Promise((resolve, reject) => {
			this.#pending.set(id, {
				resolve: (value: unknown) => resolve(value as T),
				reject,
			});

			this.#worker.postMessage({
				id,
				type,
				payload,
			} satisfies IWorkerRequest);
		});
	}

	dispose() {
		this.#worker.terminate();
		this.#pending.clear();
	}
}
