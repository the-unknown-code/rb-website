type StoryLinkType = 'url' | 'asset' | 'email' | 'story';

interface IStory {
	url?: string;
}

interface ILink {
	linktype?: StoryLinkType;
	url?: string;
	email?: string;
	cached_url?: string;
	story?: IStory | null;
	anchor?: string;
}

export function resolveLink(link: ILink | string | undefined | null): string | undefined {
	if (!link) return;
	if (typeof link === 'string') return link === 'home' || link === '/home' ? '/' : link;

	let finalLink: string | undefined;

	if (!link.linktype) {
		const asString = link as unknown as string; // fallback, should be rare
		return `${asString.charAt(0) === '/' ? '' : '/'}${asString}`;
	}

	if (link.linktype === 'url' || link.linktype === 'asset') {
		finalLink = link.url || '';
	}
	else if (link.linktype === 'email') {
		finalLink = `mailto:${link.email || ''}`;
	}
	else if (link.linktype === 'story') {
		const storyURL
			= (link.story && typeof link.story.url === 'string' && link.story.url.length
				? link.story.url
				: link.cached_url) || '';
		finalLink
			= storyURL === 'home' || storyURL === '/home'
				? '/'
				: `${storyURL.charAt(0) === '/' ? '' : '/'}${storyURL}`;
	}

	if (link.anchor) {
		finalLink = (finalLink || '') + `#${link.anchor}`;
	}

	return finalLink;
}
