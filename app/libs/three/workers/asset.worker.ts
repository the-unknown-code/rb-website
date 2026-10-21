/// <reference lib="webworker" />

import type {
	IImagePayload,
	IWorkerRequest,
	IWorkerResponse,
} from './messages';

self.onmessage = async (
	event: MessageEvent<IWorkerRequest>,
) => {
	const { id, type, payload } = event.data;

	try {
		switch (type) {
			case 'image':
				await loadImage(id, payload as IImagePayload);
				break;

			default:
				postMessage({
					id,
					success: false,
					error: `Unknown job "${type}"`,
				} satisfies IWorkerResponse);
		}
	}
	catch (error) {
		postMessage({
			id,
			success: false,
			error: error instanceof Error
				? error.message
				: 'Unknown worker error',
		} satisfies IWorkerResponse);
	}
};

async function loadImage(
	id: string,
	payload: IImagePayload,
) {
	const response = await fetch(payload.url);

	if (!response.ok) {
		throw new Error(`Unable to fetch "${payload.url}"`);
	}

	const blob = await response.blob();
	const bitmap = await createImageBitmap(blob, { imageOrientation: 'flipY' });

	postMessage(
		{
			id,
			success: true,
			payload: bitmap,
		} satisfies IWorkerResponse<ImageBitmap>,
		[bitmap],
	);
}
