import { blurReveal } from '~/directives/BlurReveal';
import { contentReveal } from '~/directives/ContentReveal';
import { letterReveal } from '~/directives/LetterReveal';

export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.directive('letter-reveal', letterReveal);
	nuxtApp.vueApp.directive('content-reveal', contentReveal);
	nuxtApp.vueApp.directive('blur-reveal', blurReveal);
});
