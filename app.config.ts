/*
░██████╗████████╗██╗░░░██╗██████╗░██╗░█████╗░  ███████╗██████╗░███████╗██╗░██████╗░██╗░░██╗████████╗
██╔════╝╚══██╔══╝██║░░░██║██╔══██╗██║██╔══██╗  ██╔════╝██╔══██╗██╔════╝██║██╔════╝░██║░░██║╚══██╔══╝
╚█████╗░░░░██║░░░██║░░░██║██║░░██║██║██║░░██║  █████╗░░██████╔╝█████╗░░██║██║░░██╗░███████║░░░██║░░░
░╚═══██╗░░░██║░░░██║░░░██║██║░░██║██║██║░░██║  ██╔══╝░░██╔══██╗██╔══╝░░██║██║░░╚██╗██╔══██║░░░██║░░░
██████╔╝░░░██║░░░╚██████╔╝██████╔╝██║╚█████╔╝  ██║░░░░░██║░░██║███████╗██║╚██████╔╝██║░░██║░░░██║░░░
╚═════╝░░░░╚═╝░░░░╚═════╝░╚═════╝░╚═╝░╚════╝░  ╚═╝░░░░░╚═╝░░╚═╝╚══════╝╚═╝░╚═════╝░╚═╝░░╚═╝░░░╚═╝░░░

Wrapper starter — app-config + tokens at repo root only
@author: Studio Freight
*/

import {
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
	type IStoryblok,
	type IMarker,
	type IGtm,
	type IThree,
} from './app/libs/common';

export interface IAppConfig {
	version: number;
	title: string;
	ssr: boolean;
	platform: IPlatform;
	colors: IColors;
	themes: IThemes;
	grid: IGrid;
	fonts: IFonts;
	three: IThree;
	storyblok: IStoryblok;
	marker: IMarker;
	gtm: IGtm;
}

export const config: IAppConfig = {
	version: 1.0,
	title: 'René Boivin',
	ssr: true,
	platform,
	colors,
	themes,
	grid,
	fonts,
	three,
	storyblok,
	marker,
	gtm,
};
