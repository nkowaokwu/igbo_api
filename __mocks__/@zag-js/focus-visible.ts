/* jsdom exposes HTMLElement.prototype.focus as getter-only, which breaks the
 * real trackFocusVisible's monkey-patching during Chakra checkbox mount */
export const trackFocusVisible = () => () => {};
export const trackInteractionModality = () => () => {};
export const setInteractionModality = () => {};
export const getInteractionModality = () => null;
