/**
 * @description Utility for rendering Storyblok Rich Text content into sanitized HTML.
 * Supports configurable allowed HTML tags and uses DOMPurify to prevent XSS.
 *
 * @author Andrea Giuffrida
 *
 */

import { renderRichText, type SbRichTextInput } from '@storyblok/richtext';
import DOMPurify from 'isomorphic-dompurify';

export const renderHTML = (doc: SbRichTextInput, allowedTags: string[] = ['p', 'a', 'b', 'u', 'i', 'ul', 'ol', 'li', 'br']) => {
	if (!doc) return '';
	const html = renderRichText(doc);
	const sanitized = DOMPurify.sanitize(html, { ALLOWED_TAGS: allowedTags });
	return sanitized;
};
