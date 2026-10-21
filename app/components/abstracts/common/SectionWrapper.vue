<template>
	<section
		class="common-section-wrapper"
		:style="{ '--section-background': backgroundVar }"
	>
		<slot />
	</section>
</template>

<script setup lang="ts">
interface IProps {
	background?: string;
}

const props = withDefaults(defineProps<IProps>(), {
	background: '--white',
});

const backgroundVar = computed(() =>
	props.background && props.background.startsWith('--')
		? `var(${props.background})`
		: props.background,
);
</script>

<style lang="scss" scoped>
.common-section-wrapper {
	position: relative;
	isolation: isolate;
	padding: 48px 0;
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		width: 100vw;
		height: 100%;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--section-background);
		z-index: -1;
	}

	@include desktop {
		padding: 96px 0;
	}

	> * {
		z-index: 1;
	}
}
</style>
