import type { Item } from './types';
import { RARITY_COLORS } from './types';

export function generateRouletteItems(items: Item[], duration: number): Item[] {
	if (!items || items.length === 0) {
		return [];
	}

	const totalItems = Math.max(100, Math.floor(duration * 10)); // Ensure enough items for smooth spin
	const generatedItems: Item[] = [];

	for (let i = 0; i < totalItems; i++) {
		const randomItem = items[Math.floor(Math.random() * items.length)];
		generatedItems.push({ ...randomItem, id: `${randomItem.name}-${i}` });
	}

	return generatedItems;
}

export function selectWeightedRandomItem(items: Item[]): Item | null {
	if (!items || items.length === 0) {
		return null;
	}

	let totalWeight = 0;
	for (const item of items) {
		const weight = typeof item.weight === 'number' ? item.weight : Number(item.weight) || 0;
		totalWeight += weight;
	}
	let randomNum = Math.random() * totalWeight;

	for (const item of items) {
		const weight = typeof item.weight === 'number' ? item.weight : Number(item.weight) || 0;
		if (randomNum < weight) {
			return item;
		}
		randomNum -= weight;
	}

	// Fallback in case of floating point inaccuracies, return a random item
	return items[Math.floor(Math.random() * items.length)];
}

export function getItemColor(item: Item): string {
	// Prefer item.color from scraped data, fallback to RARITY_COLORS by tier
	const tier = typeof item.tier === 'string' ? item.tier : '';
	if (typeof item.color === 'string' && item.color) return item.color;
	switch (tier) {
		case 'S':
			return RARITY_COLORS.S;
		case 'A':
			return RARITY_COLORS.A;
		case 'B':
			return RARITY_COLORS.B;
		case 'C':
			return RARITY_COLORS.C;
		case 'D':
			return RARITY_COLORS.D;
		default:
			return '#b0c3d9';
	}
}
