/**
 * @description
 * Provides a registry of Vue components grouped by development tier
 * (atoms, molecules, organisms, ecosystems, and sections).
 *
 * Components are discovered at build time using `import.meta.glob`, supporting
 * both of the following directory structures:
 *
 * - components/atoms/Button/index.vue
 * - components/atoms/Test.vue
 *
 * The registry is initialized once when the module is loaded, allowing fast
 * lookups without repeatedly scanning the filesystem.
 *
 * @author Dallen Hoyal
 */

import type { Component } from 'vue';
import type { TDevTier } from '~/types/common';

export interface TierComponentEntry {
	name: string;
	component: Component;
}

const TIER_FOLDER_MAP = {
	atoms: 'atoms',
	molecules: 'molecules',
	organisms: 'organisms',
	ecosystems: 'ecosystems',
	blocks: 'sections',
} satisfies Record<TDevTier, string>;

const modules = {
	...import.meta.glob<{ default: Component }>(
		'~/components/{atoms,molecules,organisms,ecosystems,sections}/*/index.vue',
		{
			eager: true,
		},
	),
	...import.meta.glob<{ default: Component }>(
		'~/components/{atoms,molecules,organisms,ecosystems,sections}/*.vue',
		{
			eager: true,
		},
	),
};

function getComponentName(path: string): string | null {
	const folderMatch = /\/([^/]+)\/index\.vue$/.exec(path);

	if (folderMatch?.[1]) {
		return folderMatch[1];
	}

	const fileMatch = /\/([^/]+)\.vue$/.exec(path);

	if (fileMatch?.[1]) {
		return fileMatch[1];
	}

	return null;
}

const registries = Object.fromEntries(
	(Object.keys(TIER_FOLDER_MAP) as TDevTier[]).map(tier => {
		const folder = TIER_FOLDER_MAP[tier];

		const entries: TierComponentEntry[] = Object.entries(modules)
			.filter(([path]) => path.includes(`/components/${folder}/`))
			.flatMap(([path, module]) => {
				const name = getComponentName(path);

				if (!name) {
					return [];
				}

				return [
					{
						name,
						component: module.default,
					},
				];
			})
			.sort((a, b) => a.name.localeCompare(b.name));

		return [tier, entries];
	}),
) as Record<TDevTier, TierComponentEntry[]>;

export function useTierComponentRegistry(
	tier: TDevTier,
): TierComponentEntry[] {
	return registries[tier];
}
