const sharedCaches = new Map<string, ReturnType<typeof createSharedComposable>>();

export const useCache = <T>(
	key: string,
	factory: () => T,
): T => {
	if (!sharedCaches.has(key)) {
		sharedCaches.set(
			key,
			createSharedComposable(factory),
		);
	}

	return (sharedCaches.get(key) as () => T)();
};

export const clearCache = (key?: string) => {
	if (key) {
		sharedCaches.delete(key);
	}
	else {
		sharedCaches.clear();
	}
};
