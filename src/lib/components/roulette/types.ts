export type Item = {
	name: string;
	color: string;
	teamCode?: string;
	image?: string;
	[key: string]: string | number | boolean | null | undefined;
};

export const RARITY_COLORS = {
	S: '#FFD700',
	A: '#4b69ff',
	B: '#8847ff',
	C: '#b0c3d9',
	D: '#eb4b4b'
} as const;

export interface RoulettePresetItemConfig<T extends string> {
	name: T;
	weight: number;
}

export interface RoulettePreset<T extends string = string> {
	name: string;
	items: RoulettePresetItemConfig<T>[];
}
