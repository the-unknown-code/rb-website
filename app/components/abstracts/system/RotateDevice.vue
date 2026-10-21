<template>
	<div :class="['system-rotate-device']">
		<p>Rotate Content</p>
	</div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.system-rotate-device {
	position: fixed;
	inset: 0;
	background-color: var(--black);
	color: var(--white);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: var(--z-system);
}
</style>
