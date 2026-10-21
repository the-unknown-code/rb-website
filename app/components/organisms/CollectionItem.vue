<script setup lang="ts">
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { IMediaProps } from '~/libs/common/setup/media';

gsap.registerPlugin(ScrollTrigger);

interface IContent {
	eyebrow?: string;
	title?: string;
	subtitle?: string;
	description?: string;
	cta?: {
		label: string;
		href: string;
	};
}

interface IProps {
	reverse: boolean;
	media: IMediaProps;
	content: IContent;
}

const props = withDefaults(defineProps<IProps>(), {

});

const element = ref<HTMLElement | null>(null);
let context: gsap.Context | undefined;
let mediaQueries: gsap.MatchMedia | undefined;
let resizeObserver: ResizeObserver | undefined;
let refreshFrame: number | undefined;

const refreshScrollTrigger = () => {
	if (refreshFrame) cancelAnimationFrame(refreshFrame);
	refreshFrame = requestAnimationFrame(() => {
		ScrollTrigger.refresh();
		ScrollTrigger.update();
	});
};

onMounted(() => {
	if (!element.value)
		return;

	context = gsap.context(() => {
		const [mediaElement, contentElement] = Array.from(element.value?.children ?? []);
		if (!mediaElement || !contentElement)
			return;

		const createTimeline = (mediaFrom: gsap.TweenVars, contentFrom: gsap.TweenVars) => gsap.timeline({
			scrollTrigger: {
				trigger: element.value,
				start: 'top 90%',
				end: 'clamp(center 55%)',
				scrub: true,
				invalidateOnRefresh: true,
			},
		})
			.fromTo(mediaElement, mediaFrom, { xPercent: 0, y: 0, ease: 'none' }, 0)
			.fromTo(contentElement, contentFrom, { xPercent: 0, y: 0, ease: 'none' }, 0);

		mediaQueries = gsap.matchMedia();
		mediaQueries.add('(min-width: 960px)', () => {
			const direction = props.reverse ? 1 : -1;
			return createTimeline({ xPercent: direction * 100 }, { xPercent: direction * -100 });
		});
		mediaQueries.add('(max-width: 959px)', () => createTimeline({ y: 120 }, { y: 120 }));
	}, element.value);

	resizeObserver = new ResizeObserver(refreshScrollTrigger);
	resizeObserver.observe(element.value);
	nextTick(refreshScrollTrigger);
});

onBeforeUnmount(() => {
	if (refreshFrame) cancelAnimationFrame(refreshFrame);
	resizeObserver?.disconnect();
	mediaQueries?.revert();
	context?.revert();
});
</script>

<template>
	<div
		ref="element"
		:class="['o-collection-item', { reversed: reverse }]"
	>
		<div
			:class="['o-collection-item__media', { contain: media.contain }]"
		>
			<common-media
				v-bind="media"
				:cover="!media.contain"
				:parallax="!media.contain"
			/>
		</div>
		<div
			class="o-collection-item__content"
		>
			<h2
				v-if="content.title"
				v-letter-reveal="{ stagger: 0.01, delay: 0.5 }"
			>
				{{ content.title }}
			</h2>
			<h3
				v-if="content.eyebrow"
				v-letter-reveal="{ stagger: 0.01, delay: 0.5 }"
				class="big"
			>
				{{ content.eyebrow }}
			</h3>
			<h3
				v-if="content.subtitle"
				v-letter-reveal="{ stagger: 0.01, delay: 0.5 }"
			>
				{{ content.subtitle }}
			</h3>
			<p
				v-if="content.description"
				v-content-reveal="{ y: 0, opacity: 0, delay: 1, duration: 3 }"
				class="description"
			>
				{{ content.description }}
			</p>
			<common-button
				v-if="content.cta"
				:href="content.cta.href"
				:label="content.cta.label"
				dark
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.o-collection-item {
	position: relative;
	display: flex;
	flex-direction: column;

	&.reversed {
		@include desktop {
			flex-direction: row-reverse;
		}
	}

	@include desktop {
		flex-direction: row;
	}

	> div {
		display: flex;

		@include desktop {
			width: 50%;
			flex: 0 0 50%;
		}
	}

	&__media {
		aspect-ratio: 147 / 178;

		&.contain {
			aspect-ratio: auto;
		}
	}

	&__content {
		width: 100%;
		height: auto;
		max-width: 640px;
		flex-direction: column;

		justify-content: flex-start;
		align-items: flex-start;
		gap: 12px;

		padding: 12px 0;

		@include desktop {
			align-self: center;
			padding: 0 clamp(64px, 8vw, 124px);
		}

		p {
			text-wrap: balance;
			margin-top: 24px;
		}

		.common-button {
			margin-top: 12px;
		}
	}
}
</style>
