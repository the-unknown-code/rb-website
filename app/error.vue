<template>
	<nuxt-layout class="theme-dark">
		<div>
			<p>error 404</p>
			<button @click="goHome">
				Go home
			</button>
		</div>
	</nuxt-layout>
</template>

<script lang="ts" setup>
const goHome = () => clearError({ redirect: '/' });
</script>

<style lang="scss">
</style>
