/**
 * Generates alpha shade variants from a map of hexadecimal colors.
 *
 * For each input color, the original value is preserved and additional
 * shades are generated at 5% opacity increments (0–95%).
 *
 * Example:
 * ```ts
 * generateShades({
 *   primary: '#3b82f6',
 * })
 * ```
 *
 * Produces:
 * ```ts
 * {
 *   primary: '#3b82f6',
 *   'primary-0':  'rgb(59 130 246 / 0%)',
 *   'primary-5':  'rgb(59 130 246 / 5%)',
 *   ...
 *   'primary-95': 'rgb(59 130 246 / 95%)',
 * }
 * ```
 *
 * Invalid hex values are ignored and only their original value is preserved.
 *
 * @author Andrea Giuffrida
 */

type RGB = Readonly<{
	r: number;
	g: number;
	b: number;
}>;

/**
 * Converts a 6-digit hexadecimal color to its RGB components.
 *
 * @param hex - Color in `#RRGGBB` or `RRGGBB` format.
 * @returns RGB values or `null` if the input is invalid.
 */
const hexToRgb = (hex: string): RGB | null => {
	const normalized = hex.startsWith('#') ? hex.slice(1) : hex;

	if (!/^[\da-fA-F]{6}$/.test(normalized))
		return null;

	return {
		r: Number.parseInt(normalized.slice(0, 2), 16),
		g: Number.parseInt(normalized.slice(2, 4), 16),
		b: Number.parseInt(normalized.slice(4, 6), 16),
	};
};

/**
 * Generates alpha shades for each color.
 *
 * @param colors - Record of color names and hexadecimal values.
 * @returns Original colors plus generated alpha shade variants.
 */
export const generateShades = (
	colors: Readonly<Record<string, string>>,
): Record<string, string> => {
	const shades: Record<string, string> = {};

	for (const [name, hex] of Object.entries(colors)) {
		shades[name] = hex;

		const rgb = hexToRgb(hex);
		if (!rgb)
			continue;

		const { r, g, b } = rgb;

		for (let opacity = 0; opacity < 100; opacity += 5) {
			shades[`${name}-${opacity}`] = `rgb(${r} ${g} ${b} / ${opacity}%)`;
		}
	}

	return shades;
};
