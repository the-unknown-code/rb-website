/**
 * Color palette base for SCSS tokens and utilities.
 * Only **base** colors belong here.
 *
 * Alpha variants and other shade utilities
 * are generated automatically by generateShades().
 *
 * @author Andrea Giuffrida
 */

import { generateShades } from '../utils/colors';

export interface IColors {
	[key: string]: string;
}

export interface ITheme {
	bg: string;
	fg: string;
	contrast: string;
}

export interface IThemes {
	[key: string]: ITheme;
}

const baseColors: IColors = {
	white: '#fefefe',
	black: '#080808',
	brown: '#706b5f',
	red: '#241219',
};

const colors = generateShades(baseColors);

const themes: IThemes = {
	light: {
		bg: colors.white!,
		fg: colors.black!,
		contrast: colors.white!,
	},
	dark: {
		bg: colors.black!,
		fg: colors.white!,
		contrast: colors.black!,
	},
};

export { colors, themes };
