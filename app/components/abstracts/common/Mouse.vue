<template>
	<div
		v-for="(ball, index) in balls"
		:key="index"
		:class="[
			'common-mouse',
			{
				pressed: pressed,
			},
		]"
		:style="{
			left: `${ball.x}px`,
			top: `${ball.y}px`,
			width: `${getSize(index)}px`,
			height: `${getSize(index)}px`,
			opacity: getOpacity(index),
		}"
	/>
</template>

<script setup lang="ts">
const { x, y } = useMouse();

const pressed = ref(false);

const BALL_COUNT = 6;
const LERP = 0.55;

const MAX_SIZE = 16;
const MIN_SIZE = 4;

const MAX_OPACITY = 1;
const MIN_OPACITY = 0.15;

const balls = reactive(
	Array.from({ length: BALL_COUNT }, () => ({
		x: 0,
		y: 0,
	})),
);

const lerp = (from: number, to: number, amount: number) =>
	from + (to - from) * amount;

const getProgress = (index: number) =>
	index / (BALL_COUNT - 1);

const getSize = (index: number) =>
	lerp(MAX_SIZE, MIN_SIZE, getProgress(index));

const getOpacity = (index: number) =>
	lerp(MAX_OPACITY, MIN_OPACITY, getProgress(index));

let rafId: number;

const animate = () => {
	// Lead follows mouse directly
	balls[0]!.x = x.value;
	balls[0]!.y = y.value;

	// Each ball follows the previous ball
	for (let i = 1; i < balls.length; i++) {
		const ball = balls[i]!;
		const leader = balls[i - 1]!;

		ball.x = lerp(ball.x, leader.x, LERP);
		ball.y = lerp(ball.y, leader.y, LERP);
	}

	rafId = requestAnimationFrame(animate);
};

const onMouseDown = () => {
	pressed.value = true;
};

const onMouseUp = () => {
	pressed.value = false;
};

tryOnMounted(() => {
	for (const ball of balls) {
		ball.x = x.value;
		ball.y = y.value;
	}

	window.addEventListener('mousedown', onMouseDown);
	window.addEventListener('mouseup', onMouseUp);

	rafId = requestAnimationFrame(animate);
});

tryOnBeforeUnmount(() => {
	window.removeEventListener('mousedown', onMouseDown);
	window.removeEventListener('mouseup', onMouseUp);

	cancelAnimationFrame(rafId);
});
</script>

<style lang="scss" scoped>
.common-mouse {
	position: fixed;
	background: black;
	border-radius: 50%;
	transform: translate(-50%, -50%);
	pointer-events: none;
	z-index: var(--z-system);

	&.pressed {
		transform: translate(-50%, -50%) scale(.8);
		filter: invert(1);
		mix-blend-mode: difference;
	}
}
</style>
