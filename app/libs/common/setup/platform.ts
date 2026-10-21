/**
 * Responsive platform configuration.
 *
 * Defines the viewport breakpoints used throughout the application for
 * responsive layouts, media queries, and device-specific behaviors.
 *
 * @author Andrea Giuffrida
 */

export interface IPlatform {
	desktopBreakpoint: number;
	mobileLandscapeMinWidth: number;
	tabletLandacapeMinWidth: number;
}

export const platform: IPlatform = {
	desktopBreakpoint: 960,
	mobileLandscapeMinWidth: 500,
	tabletLandacapeMinWidth: 768,
};
