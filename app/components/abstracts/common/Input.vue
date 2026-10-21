<template>
	<div :class="['common-input', { light }]">
		<input
			:type="type"
			:placeholder="placeholder"
		>
		<common-arrow v-if="type !== 'search'" />
		<common-search v-else />
	</div>
</template>

<script setup lang="ts">
interface IProps {
	placeholder: string;
	type?: string;
	light?: boolean;
}

withDefaults(defineProps<IProps>(), {
	type: 'text',
	light: false,
});
</script>

<style lang="scss" scoped>
.common-input {
	position: relative;
	width: 100%;

	font-family: 'BrandonGrotesque-Regular';
	border: 1px solid var(--black-30);

	&.light {
		border: 1px solid var(--white-30);

		input {
			&::placeholder {
				color: var(--white);
			}
		}
	}

	input {
		position: relative;
		width: 100%;
		text-align: left;
		padding: 8px 44px 8px 12px;

		&::placeholder {
			color: var(--black);
			font-size: 14px;
			opacity: .8;
		}
	}

	.common-arrow, .common-search {
		position: absolute;
		right: 8px;
		top: 50%;
		transform: translateY(-50%);
	}
}
</style>
