<template>
	<p v-if="error">
		{{ error }}
	</p>
</template>

<script setup lang="ts">
const error = ref('');

onMounted(async () => {
	const password = window.prompt('Enter password');

	if (!password) {
		return;
	}

	try {
		await $fetch('/api/auth', {
			method: 'POST',
			body: { password },
		});

		await navigateTo('/');
	}
	catch {
		error.value = 'Wrong password';
	}
});
</script>
