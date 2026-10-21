<template>
	<div
		id="three"
		ref="$three"
		:class="{ fixed: config.three.fixed }"
	/>
</template>

<script setup lang="ts">
import GLApplication from '~/libs/three';
import useAppStore from '~/store/useAppStore';

const { public: { config } } = useRuntimeConfig();
const $store = useAppStore();
const $three = ref<HTMLElement>();
const $gl = GLApplication.getInstance();
const scope = effectScope();

const initialize = async () => {
	$three.value!.append($gl.domElement);
	await $gl.preload();

	$gl.setActiveScene('test');
	$gl.start();

	useResize(resizeHandler);
	$store.three.ready = true;
};

const resizeHandler = () => {
	$gl.resize();
};

scope.run(() => {
	watchImmediate(() => $store.site.isLowPowerMode, (isLowPowerMode: boolean) => {
		$gl.lowPowerMode = isLowPowerMode;
	});
});

tryOnBeforeUnmount(() => {
	$gl.dispose();
});

tryOnMounted(() => {
	initialize();
});
</script>

<style lang="scss">
#three {
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: var(--z-base);

	&.fixed {
		position: fixed;
	}

	canvas {
		position: absolute;
		width: 100%;
		height: 100%;
	}
}
</style>
