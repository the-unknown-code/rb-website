<template>
	<common-section-wrapper
		:class="[
			's-collection',
			{
				's-collection--brown': blok.background === '--brown',
				's-collection--red': blok.background === '--red',
			},
		]"
		:background="blok.background"
	>
		<div class="layout-grid">
			<m-header-title
				v-if="blok.title || blok.eyebrow"
				:title="blok.title"
				:eyebrow="blok.eyebrow"
			/>
		</div>
		<div class="s-collection__list layout-grid">
			<o-collection-item
				v-for="(item, i) in blok.items"
				:key="item.content.title"
				:reverse="blok.reverse ? i % 2 === 0 : i % 2 === 1"
				:media="item.media"
				:content="item.content"
			/>
		</div>
	</common-section-wrapper>
</template>

<script setup lang="ts">
import type { IMediaProps } from '~/libs/common/setup/media';

interface CollectionBlok {
	title?: string;
	eyebrow?: string;
	background?: string;
	reverse?: boolean;
	items: Array<{
		media: IMediaProps;
		content: {
			eyebrow?: string;
			title?: string;
			subtitle?: string;
			description?: string;
			cta?: { href: string; label: string };
		};
	}>;
}

interface Props {
	blok: CollectionBlok;
}

withDefaults(defineProps<Props>(), {});
</script>

<style lang="scss" scoped>
.s-collection {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 24px;

	&--brown, &--red {
		color: var(--white);
	}

	&__list {
		row-gap: 24px;

		@include desktop {
			row-gap: 0;
			margin-top: 32px;
		}
	}

	.m-header-title {
		grid-column: -1 / 1;

		@include desktop {
			grid-column: 3 / span 8;
		}
	}

	.o-collection-item {
		position: relative;
		grid-column: -1 / 1;

		@include desktop {
			grid-column: 2 / span 10;
		}
	}

}
</style>
