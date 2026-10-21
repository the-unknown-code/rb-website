/**
 * -----------------------------------------------------------------------------
 * SCSS Utility Functions
 * -----------------------------------------------------------------------------
 *
 * Converts JavaScript values into Sass values and exposes helper functions
 * that can be consumed from within Sass.
 *
 * @author Andrea Giuffrida
 */

import * as sass from 'sass';
import type { CustomFunction } from 'sass';
import { OrderedMap } from 'immutable';
import type { IAppConfig } from '../../../../app.config';

const isQuoted = (str: string): boolean => {
	return /^['"].*['"]$/.test(str);
};

export const toKebabCase = (str?: string | null) => {
	if (!str) return '';

	return str
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/\s+/g, '-')
		.toLowerCase();
};

/**
 * Converts a JavaScript value into its Sass equivalent.
 *
 * @param value - The value to convert.
 * @returns A Sass value.
 */
export function toSass(value: unknown): sass.Value {
	if (value instanceof sass.Value) {
		return value;
	}

	if (value == null) {
		return sass.sassNull;
	}

	if (typeof value === 'boolean') {
		return value ? sass.sassTrue : sass.sassFalse;
	}

	if (typeof value === 'number') {
		return new sass.SassNumber(value);
	}

	if (typeof value === 'string') {
		return new sass.SassString(value, {
			quotes: isQuoted(value),
		});
	}

	if (Array.isArray(value)) {
		const list = value.map(toSass);

		return new sass.SassList(list);
	}

	if (typeof value === 'object') {
		const map = OrderedMap(value as Record<string, unknown>).mapEntries(([key, val]) => [
			new sass.SassString(String(key), { quotes: true }),
			toSass(val),
		]);

		return new sass.SassMap(map);
	}

	return sass.sassNull;
}

/**
 * Creates custom Sass functions for accessing the configuration object.
 *
 * Available in Sass:
 *
 * ```scss
 * get('colors.primary');
 * getColors();
 * getThemes();
 * ```
 *
 * @param config - Configuration object exposed to Sass.
 * @returns Sass custom functions.
 */
export const createScssFunctions = (
	config: IAppConfig,
): Record<string, CustomFunction<'async'>> => ({
	'get($keys)': async (args: unknown[]) => {
		const path = (args[0] as sass.SassString)
			.assertString('keys')
			.text
			.split('.');

		let result: unknown = config;

		for (const key of path) {
			if (
				typeof result !== 'object'
				|| result === null
				|| !(key in result)
			) {
				return sass.sassNull;
			}

			result = (result as Record<string, unknown>)[key];
		}

		return toSass(result);
	},

	'getColors()': async () => toSass(config.colors),
	'getThemes()': () => toSass(config.themes),
});
