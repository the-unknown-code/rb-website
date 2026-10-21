import { platform, type IPlatform } from './setup/platform';
import { colors, themes, type IColors, type IThemes } from './setup/colors';
import { grid, type IGrid } from './setup/grid';
import { fonts, type IFonts } from './setup/fonts';
import { three, type IThree } from './setup/three';
import { storyblok, type IStoryblok } from './setup/storyblok';
import { marker, type IMarker } from './setup/marker';
import { gtm, type IGtm } from './setup/gtm';
import { createScssFunctions } from './utils/functions';

export {
	platform,
	colors,
	themes,
	grid,
	fonts,
	three,
	storyblok,
	marker,
	gtm,

	type IPlatform,
	type IColors,
	type IThemes,
	type IGrid,
	type IFonts,
	type IThree,
	type IStoryblok,
	type IMarker,
	type IGtm,

	createScssFunctions,
};
