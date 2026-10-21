<script setup lang="ts">
import { resolveLink } from '~/libs/storyblok/link';

interface IProps {
	label: string;
	href: string;
	dark?: boolean;
}

withDefaults(defineProps<IProps>(), {
	dark: false,
});
</script>

<template>
	<button
		:name="label"
		:class="['common-button', { dark }]"
	>
		<common-link :href="resolveLink(href) as string">
			<span class="cta">{{ label }}</span>
			<span
				class="cta"
				aria-hidden="true"
			>{{ label }}</span>
		</common-link>
	</button>
</template>

<style lang="scss" scoped>
.common-button {
	position: relative;
	white-space: nowrap;
	display: inline-block;
	padding-bottom: 4px;
	overflow: hidden;

	cursor: pointer;

	&.dark {
		> :deep(.common-link) {
			&::after,
			&::before {
				border-bottom: 0.5px solid var(--black-50);
			}
		}
	}

	> :deep(.common-link) {
		position: relative;
		display: inline-block;
		padding-bottom: 4px;
		text-decoration: none;

		&::after,
		&::before {
			content: '';
			position: absolute;
			width: 0%;
			left: 0;
			bottom: -2px;

			opacity: 0;
			border: 0.5px solid var(--white-50);
			transition:
				width 0.65s var(--ease-in-out-circ),
				opacity 0.35s var(--ease-in-out-circ);
			z-index: 1;
		}

		&::before {
			width: 100%;
			opacity: 0.5;
		}
	}

	span {
		position: relative;
		display: block;
		z-index: 0;

		transition:
			transform 0.65s var(--ease-in-out-circ),
			opacity 0.55s var(--ease-in-out-circ);

		&:nth-child(2) {
			position: absolute;
			left: 0;
			top: 1px;

			opacity: 0;
			transform: translateY(calc(100% + 5px));
		}
	}

	@include hover {
		> :deep(.common-link) {
			&::after {
				opacity: 1;
				width: 100%;
			}
		}

		span {
			&:nth-child(1) {
				opacity: 0;
				transform: translateY(calc(-100% - 5px));
			}

			&:nth-child(2) {
				opacity: 1;
				transform: translateY(0);
			}
		}
	}
}
</style>
