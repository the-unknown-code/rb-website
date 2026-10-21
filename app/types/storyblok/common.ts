export interface ISbAsset {
	id?: number;
	alt?: string | null;
	name?: string;
	focus?: string | null;
	title?: string | null;
	source?: string | null;
	filename: string;
	copyright?: string | null;
	fieldtype?: 'asset';
	meta_data?: Record<string, unknown>;
	is_external_url?: boolean;
}
