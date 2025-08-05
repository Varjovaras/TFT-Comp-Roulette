export type Item = {
	name: string;
	color: string;
	teamCode?: string;
	image?: string;
	[key: string]: any;
};

export const RARITY_COLORS = {
	Consumer: '#b0c3d9',
	Industrial: '#5e98d9',
	'Mil-spec': '#4b69ff',
	Restricted: '#8847ff',
	Classified: '#d32ce6',
	Covert: '#eb4b4b',
	'Rare Special Item': '#e4ae39'
} as const;

export interface RoulettePresetItemConfig<T extends string> {
	name: T;
	weight: number;
}

export interface RoulettePreset<T extends string = string> {
	name: string;
	items: RoulettePresetItemConfig<T>[];
}
