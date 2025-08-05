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

	const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
	let randomNum = Math.random() * totalWeight;

	for (const item of items) {
		if (randomNum < item.weight) {
			return item;
		}
		randomNum -= item.weight;
	}

	// Fallback in case of floating point inaccuracies, return a random item
	return items[Math.floor(Math.random() * items.length)];
}

export function getItemColor(item: Item): string {
	return RARITY_COLORS[item.rarity] || '#b0c3d9'; // Default to Consumer color
}
