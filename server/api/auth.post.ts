export default defineEventHandler(async event => {
	const { password } = await readBody(event);
	const sitePassword = useRuntimeConfig().sitePassword;

	if (password !== sitePassword) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Wrong password',
		});
	}

	setCookie(event, 'site-auth', sitePassword, {
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * 30, // 30 days
		path: '/',
	});

	return { success: true };
});
