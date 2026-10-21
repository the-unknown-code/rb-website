export interface ISbMeta {
	_uid?: string;
	component: string;
	name?: string;
	anchor?: string;
}

export interface ISbBlok extends ISbMeta {
	[key: string]: unknown;
}
