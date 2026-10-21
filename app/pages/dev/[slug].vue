<template>
	<main class="tier-gallery">
		<h1 class="tier-gallery--title title">
			{{ $route.params.slug }}
		</h1>
		<p
			v-if="!entries.length"
			class="par"
		>
			No components found for this tier.
		</p>
		<ul
			v-else
			class="tier-gallery__list"
		>
			<li
				v-for="entry in entries"
				:key="entry.name"
				class="tier-gallery__list--item"
			>
				<p>
					{{ entry.name }}
				</p>
				<div class="tier-gallery__preview">
					<component :is="entry.component" />
				</div>
			</li>
		</ul>
	</main>
</template>

<script setup lang="ts">
import type { TDevTier } from '~/types/common';

const $route = useRoute();
const slug = computed(() => String($route.params.slug ?? '').toLowerCase());
const entries = computed(() => useTierComponentRegistry(slug.value as TDevTier));

useSeo({
	title: slug.value,
	description: '',
	keywords: '',
});
</script>

<style lang="scss" scoped>
.tier-gallery {
	display: flex;
	padding: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 32px;
	background: var(--theme-bg);
	color: var(--theme-fg);

	h1.title, p.par {
		font-family: monospace;
	}

	h1 {
		&.title {

			text-transform: uppercase;
			font-size: 12px;
			font-weight: bold;
		}
	}

	&__list {
		list-style: none;
		margin: 0;
		padding: 0;
		width: 100%;
		max-width: 1440px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacer-64);
	}
}
</style>
