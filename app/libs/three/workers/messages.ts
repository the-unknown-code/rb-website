export interface IWorkerRequest<T = unknown> {
	id: string;
	type: string;
	payload: T;
}

export interface IWorkerResponse<T = unknown> {
	id: string;
	success: boolean;
	payload?: T;
	error?: string;
}

export interface IImagePayload {
	url: string;
}
