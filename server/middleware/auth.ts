export default defineEventHandler(event => {
	// Disable auth in development
	if (process.env.NODE_ENV !== 'production') {
		return;
	}

	const password = useRuntimeConfig().sitePassword;
	if (!password) {
		return;
	}

	const { pathname, searchParams } = getRequestURL(event);

	// Allow Storyblok Visual Editor requests
	const isStoryblokPreview
		= searchParams.has('_storyblok')
			|| searchParams.has('_storyblok_tk[space_id]')
			|| searchParams.has('_storyblok_tk[token]')
			|| searchParams.has('_storyblok_tk[timestamp]');

	if (isStoryblokPreview) {
		return;
	}

	if (
		pathname === '/auth'
		|| pathname === '/api/auth'
		|| pathname.startsWith('/_nuxt')
		|| pathname.startsWith('/favicon')
	) {
		return;
	}

	if (getCookie(event, 'site-auth') === password) {
		return;
	}

	return sendRedirect(event, '/auth');
});
