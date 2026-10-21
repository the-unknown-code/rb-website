<template>
	<div class="m-header-title">
		<p
			v-if="eyebrow"
			class="p-small eyebrow"
		>
			{{ eyebrow }}
		</p>
		<component
			:is="as"
			v-if="title"
			class="m-header-title__main"
		>
			<span v-letter-reveal="{ blur: true }">{{ title }}</span>
		</component>
		<p
			v-if="description"
			class="m-header-title__secondary p-big"
		>
			<span v-letter-reveal="{ stagger: .01 }">{{ description }}</span>
		</p>
	</div>
</template>

<script setup lang="ts">
interface IProps {
	title?: string;
	eyebrow?: string;
	description?: string;
	as?: 'h1' | 'h2' | 'h3';
}

withDefaults(defineProps<IProps>(), {
	as: 'h1',
});
</script>

<style lang="scss" scoped>
.m-header-title {
	position: relative;
	text-align: center;

	display: flex;
	flex-direction: column;
	gap: 12px;

	.eyebrow {
		margin-bottom: 32px;
	}

	.p-big {
		text-wrap: balance;
	}
}
</style>
