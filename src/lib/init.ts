/**
 * Initializes a component on the client side.
 * Handles both initial page load and view transitions.
 * Returns cleanup on astro:before-swap to prevent memory leaks.
 */
export function createInitializer(initFn: () => void | (() => void)): void {
  let cleanup: void | (() => void);

  const setup = () => {
    if (typeof cleanup === 'function') cleanup();
    cleanup = initFn();
  };

  // Run on view transition swap
  document.addEventListener('astro:after-swap', setup);

  // Run now if document is already ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setup();
  } else {
    document.addEventListener('DOMContentLoaded', setup, { once: true });
  }
}

/**
 * Initialize once only (for one-time global setup)
 */
export function initOnce(initFn: () => void): void {
  if (document.readyState !== 'loading') {
    initFn();
  } else {
    document.addEventListener('DOMContentLoaded', initFn, { once: true });
  }
}
