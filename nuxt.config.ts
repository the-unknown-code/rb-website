import glsl from 'vite-plugin-glsl';

import { config } from './app.config';
import { createScssFunctions } from './app/libs/common';
import { toKebabCase } from './app/libs/common/utils/functions';

const gtmEnabled = process.env.NODE_ENV === 'production' && process.env.NUXT_PUBLIC_GTM_ID;

export default defineNuxtConfig({
	modules: [
		'@nuxtjs/device',
		'@nuxt/image',
		'@nuxtjs/sitemap',
		'@nuxtjs/robots',
		'@vueuse/nuxt',
		'@pinia/nuxt',
		'@nuxt/eslint',
		[
			'@storyblok/nuxt',
			{
				accessToken: process.env.NODE_ENV === 'production' && !config.storyblok.forceDraft ? process.env.STORYBLOK_PUBLIC_KEY : process.env.STORYBLOK_PREVIEW_KEY,
				apiOptions: {
					region: process.env.STORYBLOK_REGION,
				},
			},
		],
		'@nuxt/fonts'],

	$development: {
		app: {
			head: {
				title: `${toKebabCase(config.title)}-#dev`,
				htmlAttrs: { lang: 'en' },
				meta: [
					{
						name: 'apple-mobile-web-app-status-bar-style',
						content: 'black-translucent',
					},
				],
			},
			rootAttrs: {
				id: `${toKebabCase(config.title)}-dev`,
			},
		},
	},

	$production: {
		app: {
			head: {
				title: `${toKebabCase(config.title)}`,
				htmlAttrs: { lang: 'en' },
				meta: [
					{
						name: 'apple-mobile-web-app-status-bar-style',
						content: 'black-translucent',
					},
				],
				...(config.marker.projectId
					? {
							script: [
								{
									innerHTML: config.marker.script.replace(
										'__MARKER_ID_PROJECT__',
										config.marker.projectId,
									),
									type: 'text/javascript',
								},
							],
						}
					: {}),
				...(gtmEnabled
					? {
							__dangerouslyDisableSanitizers: ['script', 'noscript'],
							script: [
								{
									key: 'gtm',
									type: 'text/javascript',
									innerHTML: config.gtm.script.replace(
										'__GTM_ID__',
										process.env.NUXT_PUBLIC_GTM_ID as string,
									),
								},
							],
							noscript: [
								{
									key: 'gtm-noscript',
									innerHTML: config.gtm.noScript.replace(
										'__GTM_ID__',
										process.env.NUXT_PUBLIC_GTM_ID as string,
									),
								},
							],
						}
					: {}),
			},
			rootAttrs: {
				id: `${toKebabCase(config.title)}`,
			},
		},
	},
	ssr: config.ssr,

	components: {
		dirs: [
			{ path: '~/components/abstracts/common', extensions: ['vue'], prefix: 'common', pathPrefix: false },
			{ path: '~/components/abstracts/core', extensions: ['vue'], prefix: 'core', pathPrefix: false },
			{ path: '~/components/abstracts/system', extensions: ['vue'], prefix: 'system', pathPrefix: false },
			{ path: '~/components/atoms', extensions: ['vue'], prefix: 'a', pathPrefix: false },
			{ path: '~/components/molecules', extensions: ['vue'], prefix: 'm', pathPrefix: false },
			{ path: '~/components/organisms', extensions: ['vue'], prefix: 'o', pathPrefix: false, ignore: ['footer.vue', 'header.vue'] },
			{ path: '~/components/ecosystems', extensions: ['vue'], prefix: 'e', pathPrefix: false },
			{ path: '~/components/utils', extensions: ['vue'], prefix: 'u', pathPrefix: false },
			{ path: '~/components/providers', extensions: ['vue'], prefix: 'provider', pathPrefix: false },
			{ path: '~/components/sections', extensions: ['vue'], prefix: 's', pathPrefix: false },
			{ path: '~/components/storyblok', extensions: ['vue'], prefix: 'storyblok', pathPrefix: false },
			{ path: '~/components/storyblok/common', extensions: ['vue'], prefix: 'sb', pathPrefix: false },
		],
	},
	devtools: { enabled: false },
	css: ['@/assets/main.scss'],

	runtimeConfig: {
		sitePassword: process.env.SITE_PASSWORD || '',
		public: {
			config,
			forceConsole: process.env.SITE_FORCE_CONSOLE,
		},
	},

	routeRules: {
		'/auth': { ssr: false, robots: false },
		'/dev/*': { robots: false },
	},

	compatibilityDate: '2025-07-15',

	nitro: {
		compressPublicAssets: {
			brotli: true,
			gzip: true,
		},

	},

	vite: {
		plugins: [
			glsl(),
		],

		optimizeDeps: {
			include: [
				'@storyblok/vue',
				'gsap',
				'mitt',
				'tempus',
			],
		},

		build: {
			minify: 'esbuild',
			cssMinify: true,
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes('node_modules')) {
							return 'vendor';
						}
					},
				},
			},
		},

		esbuild: {
			legalComments: 'none',
			drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
		},

		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "@/assets/utils/mixins.scss" as *;  @use "/assets/utils/functions.scss" as *;',
					functions: createScssFunctions(config),
				},
			},
		},

	},

	eslint: {
		checker: true,
		config: {
			stylistic: {
				indent: 'tab',
				semi: true,
			},
		},
	},

	fonts: {
		...config.fonts,
	},

	sitemap: {
		zeroRuntime: true,
	},
});
