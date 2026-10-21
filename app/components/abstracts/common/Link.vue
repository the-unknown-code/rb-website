<template>
	<a
		v-if="linkType !== 'internal'"
		:class="['common-link']"
		:href="href"
		:aria-label="label"
		:target="linkType === 'external' ? '_blank' : undefined"
	>
		<slot />
	</a>
	<nuxt-link
		v-else
		:to="href"
		:class="['common-link']"
		custom
		prefetch-on="visibility"
	>
		<a
			:href="href"
			:aria-label="label"
			@click.prevent="onNavigationClick"
		>
			<slot />
		</a>
	</nuxt-link>
</template>

<script setup lang="ts">
import type { TLinkType } from '~/types/common';

interface Props {
	href: string;
	label?: string;
}

const props = withDefaults(defineProps<Props>(), {
	label: '',
});

const linkType = computed<TLinkType>(() => {
	const value = props.href?.trim();

	if (!value) {
		return 'unknown';
	}

	if (value.startsWith('#')) {
		return 'anchor';
	}

	if (value.startsWith('mailto:')) {
		return 'mailto';
	}

	if (value.startsWith('tel:')) {
		return 'tel';
	}

	// Absolute URL (http, https, ftp, etc.)
	if (/^[a-z][a-z\d+\-.]*:\/\//i.test(value) || value.startsWith('//')) {
		return 'external';
	}

	return 'internal';
});

const onNavigationClick = async (e: Event) => {
	e.preventDefault();
	e.stopPropagation();

	const { isTransition, transitionStart } = useTransition();
	if (!isTransition.value) {
		await transitionStart();
	}

	await navigateTo(props.href);
};
</script>

<style lang="scss" scoped>
.common-link {
	position: relative;
	display: block;
}
</style>
