<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { CaseItem } from './types';
  import { generateRouletteItems, selectWeightedRandomItem } from './utils';
  import RouletteDisplay from './RouletteDisplay/RouletteDisplay.svelte';
  import { browser } from '$app/environment'; // Import browser

  export let items: CaseItem[] = [];
  export let onItemWon: (item: CaseItem) => void = () => {};
  export let spinDuration: number = 8;
  export let itemWidth: number = 140;
  export let itemsInView: number = 5;
  export let customClassName: string = '';
  export let disabled: boolean = false;

  let itemWidthSignal = itemWidth;
  let itemsInViewSignal = itemsInView;
  let internalSpinDuration = spinDuration;

  const itemMarginHorizontal = 4;
  $: actualItemSpace = itemWidthSignal + itemMarginHorizontal * 2;

  let isSpinning = false;
  let rouletteItems: CaseItem[] = []; // Initialize as empty on server
  let spinOffset = 0;
  let winningItem: CaseItem | null = null;
  let trackRef: HTMLDivElement;

  $: itemsToSpin = items;
  $: currentSpinDuration = internalSpinDuration;

  onMount(() => {
    const updateDimensions = () => {
      if (window.innerWidth <= 480) {
        itemWidthSignal = 100;
        itemsInViewSignal = 3;
      } else if (window.innerWidth <= 768) {
        itemWidthSignal = 120;
        itemsInViewSignal = 4;
      } else {
        itemWidthSignal = itemWidth;
        itemsInViewSignal = itemsInView;
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Set initial CSS properties on mount
    if (trackRef) {
      trackRef.style.setProperty('--spin-duration', `${currentSpinDuration}s`);
      trackRef.style.setProperty('--item-width', `${itemWidthSignal}px`);
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
  // This will run on initial mount (when `browser` is true) and whenever `itemsToSpin` changes
  $: if (browser && itemsToSpin) {
    rouletteItems = generateRouletteItems(itemsToSpin, currentSpinDuration, itemsInViewSignal);
  }

  // This reactive block will only run in the browser after trackRef is bound
  $: if (trackRef && typeof window !== 'undefined') {
    trackRef.style.setProperty('--spin-duration', `${currentSpinDuration}s`);
    trackRef.style.setProperty('--item-width', `${itemWidthSignal}px`);
    trackRef.style.setProperty('--item-margin-horizontal', `${itemMarginHorizontal}px`);
    trackRef.style.setProperty('--actual-item-space', `${actualItemSpace}px`);
  }

  const handleSpin = (): void => {
    if (isSpinning || !itemsToSpin.length || !trackRef) return;

    const winnerFromPool = selectWeightedRandomItem(itemsToSpin);

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
      id: `winner-${winnerIndex}-${Date.now()}`,
    };
    newItems[winnerIndex] = actualWinnerInArray;

    const viewportVisualWidth = itemsInViewSignal * actualItemSpace;
    const indicatorPositionInViewport = viewportVisualWidth / 2;
    const winnerItemCenterInTrack =
      winnerIndex * actualItemSpace + actualItemSpace / 2;
    const targetOffset = winnerItemCenterInTrack - indicatorPositionInViewport;
    const randomJitter = (Math.random() - 0.5) * (actualItemSpace * 0.3);
    const finalOffset = targetOffset + randomJitter;

    rouletteItems = newItems;
    isSpinning = true;
    winningItem = actualWinnerInArray;

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

  $: isSpinButtonDisabled = isSpinning || disabled || itemsToSpin.length === 0;
</script>

<div class="w-full max-w-3xl mx-auto relative bg-gray-700 rounded-lg p-5 shadow-lg overflow-hidden {customClassName}">
  <RouletteDisplay
    {isSpinning}
    {spinOffset}
    {rouletteItems}
    itemWidth={itemWidthSignal}
    bind:trackRef
    onSpinClick={handleSpin}
    {isSpinButtonDisabled}
  />
</div>
