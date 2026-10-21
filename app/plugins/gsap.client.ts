import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Tempus from 'tempus';
import { SplitText } from 'gsap/SplitText';

/**
 * Configures GSAP to use Tempus as its animation ticker.
 *
 * This plugin disables GSAP's internal ticker and synchronizes all GSAP
 * animations with Tempus, providing a single requestAnimationFrame loop
 * for improved timing consistency and animation orchestration.
 *
 * @author Andrea Giuffrida
 */

gsap.registerPlugin(SplitText);

export default defineNuxtPlugin(() => {
	gsap.registerPlugin(ScrollTrigger);
	ScrollTrigger.config({
		autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
		ignoreMobileResize: false,
	});

	gsap.defaults({
		ease: 'none',
		duration: 1,
	});

	// register plugins in here
	gsap.ticker.lagSmoothing(0);
	gsap.ticker.remove(gsap.updateRoot);

	Tempus.add(({ time }) => {
		gsap.updateRoot(time * 0.001);
	}, {
		priority: 0,
	});
});
