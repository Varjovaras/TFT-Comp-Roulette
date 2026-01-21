<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Item } from './types';
	import { generateRouletteItems, selectWeightedRandomItem } from './utils';
	import RouletteDisplay from './RouletteDisplay/RouletteDisplay.svelte';
	import { browser } from '$app/environment';

	export let items: Item[] = [];
	export let onItemWon: (item: Item) => void = () => {};
	export let customClassName: string = '';
	export let disabled: boolean = false;

	const SPIN_DURATION = 8;
	const DEFAULT_ITEM_WIDTH = 140;
	const DEFAULT_ITEMS_IN_VIEW = 5;

	let itemWidth = DEFAULT_ITEM_WIDTH;
	let itemsInView = DEFAULT_ITEMS_IN_VIEW;

	const itemMarginHorizontal = 4;
	$: actualItemSpace = itemWidth + itemMarginHorizontal * 2;

	let isSpinning = false;
	let rouletteItems: Item[] = [];
	let spinOffset = 0;
	let trackRef: HTMLDivElement;

	function updateDimensions() {
		if (window.innerWidth <= 480) {
			itemWidth = 100;
			itemsInView = 3;
		} else if (window.innerWidth <= 768) {
			itemWidth = 120;
			itemsInView = 4;
		} else {
			itemWidth = DEFAULT_ITEM_WIDTH;
			itemsInView = DEFAULT_ITEMS_IN_VIEW;
		}
	}

	onMount(() => {
		updateDimensions();
		window.addEventListener('resize', updateDimensions);

		// Set initial CSS properties on mount
		if (trackRef) {
			trackRef.style.setProperty('--spin-duration', `${SPIN_DURATION}s`);
			trackRef.style.setProperty('--item-width', `${itemWidth}px`);
			trackRef.style.setProperty('--item-margin-horizontal', `${itemMarginHorizontal}px`);
			trackRef.style.setProperty('--actual-item-space', `${actualItemSpace}px`);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', updateDimensions);
		}
	});

	// Reactive block to generate/re-generate roulette items only on client
	// This will run on initial mount (when `browser` is true) and whenever `items` changes
	$: if (browser && items) {
		rouletteItems = generateRouletteItems(items, SPIN_DURATION);
	}

	// This reactive block will only run in the browser after trackRef is bound
	$: if (trackRef && typeof window !== 'undefined') {
		trackRef.style.setProperty('--spin-duration', `${SPIN_DURATION}s`);
		trackRef.style.setProperty('--item-width', `${itemWidth}px`);
		trackRef.style.setProperty('--item-margin-horizontal', `${itemMarginHorizontal}px`);
		trackRef.style.setProperty('--actual-item-space', `${actualItemSpace}px`);
	}

	const handleSpin = (): void => {
		if (isSpinning || !items.length || !trackRef) return;

		const winnerFromPool = selectWeightedRandomItem(items);

		if (!winnerFromPool) {
			console.error('Could not determine a winner from the pool.');
			return;
		}

		const currentVisualItems = rouletteItems;
		const winnerIndex =
			Math.floor(currentVisualItems.length * 0.7) +
			Math.floor(Math.random() * Math.floor(currentVisualItems.length * 0.2));

		const newItems = [...currentVisualItems];
		const actualWinnerInArray = {
			...winnerFromPool,
			id: `winner-${winnerIndex}-${Date.now()}`
		};
		newItems[winnerIndex] = actualWinnerInArray;

		const viewportVisualWidth = itemsInView * actualItemSpace;
		const indicatorPositionInViewport = viewportVisualWidth / 2;
		const winnerItemCenterInTrack = winnerIndex * actualItemSpace + actualItemSpace / 2;
		const targetOffset = winnerItemCenterInTrack - indicatorPositionInViewport;
		const randomJitter = (Math.random() - 0.5) * (actualItemSpace * 0.3);
		const finalOffset = targetOffset + randomJitter;

		rouletteItems = newItems;
		isSpinning = true;

		if (trackRef) {
			trackRef.style.transition = 'none';
			trackRef.style.left = '0px';
			void trackRef.offsetWidth;
			trackRef.style.transition = '';

			const handleTransitionEnd = (event: TransitionEvent) => {
				if (event.propertyName === 'left' && trackRef) {
					trackRef.removeEventListener('transitionend', handleTransitionEnd);
					isSpinning = false;
					if (onItemWon) {
						onItemWon(actualWinnerInArray);
					}
				}
			};
			trackRef.addEventListener('transitionend', handleTransitionEnd);

			setTimeout(() => {
				if (trackRef) {
					spinOffset = finalOffset;
				}
			}, 50);
		}
	};

	$: isSpinButtonDisabled = isSpinning || disabled || items.length === 0;
</script>

<div
	class="glass-panel mx-auto w-full max-w-4xl overflow-hidden rounded-3xl p-10 ring-1 ring-white/10 {customClassName}"
>
	<RouletteDisplay
		{isSpinning}
		{spinOffset}
		{rouletteItems}
		{itemWidth}
		bind:trackRef
		onSpinClick={handleSpin}
		{isSpinButtonDisabled}
	/>
</div>
