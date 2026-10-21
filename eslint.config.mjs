import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
	rules: {
		'vue/multi-word-component-names': 'off',
		'vue/no-v-html': 'off',

		'@stylistic/semi': ['error', 'always'],
		'@stylistic/arrow-parens': ['error', 'as-needed'],

		'@typescript-eslint/no-explicit-any': 'warn',

		'@typescript-eslint/ban-ts-comment': [
			'warn',
			{
				'ts-expect-error': 'allow-with-description',
			},
		],
	},
});
