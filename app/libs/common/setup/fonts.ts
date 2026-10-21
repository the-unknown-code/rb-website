/**
 * @description Configuration for the `@nuxt/fonts` module.
 *
 * This configuration defines the default font weights, font families,
 * and optional asset settings used by the application.
 *
 * **Note:** Local font files must be placed in the `public/fonts/` directory
 * so they can be served as static assets by Nuxt.
 *
 * @author Andrea Giuffrida
 */

import { platform } from './platform';

export interface IFonts {
	options: {
		fluidMinWidth: number;
		fluidBaseWidth: number;
		fluidMaxWidth: number;
	};
	assets?: {
		prefix?: string;
	};
	defaults?: {
		weights?: number[];
	};
	families: {
		name: string;
		provider?: string;
		src?: string;
		weight?: string;
	}[];
}

export const fonts: IFonts = {
	options: {
		fluidMinWidth: platform.desktopBreakpoint,
		fluidBaseWidth: 1440,
		fluidMaxWidth: 1920,
	},
	families: [
		{
			name: 'Baskerville-Regular',
			provider: 'local',
			src: '/fonts/Baskerville-Regular.woff2',
		},
		{
			name: 'Baskerville-Italic',
			provider: 'local',
			src: '/fonts/Baskerville-Italic.woff2',
		},
		{
			name: 'BrandonGrotesque-Regular',
			provider: 'local',
			src: '/fonts/BrandonGrotesque-Regular.woff2',
		},
		{
			name: 'BrandonGrotesque-Light',
			provider: 'local',
			src: '/fonts/BrandonGrotesque-Light.woff2',
		},
	],
};
