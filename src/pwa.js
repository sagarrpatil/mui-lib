// Registers the service worker and tells the UI when a new version is waiting.
// Listen with: window.addEventListener('pwa-update-available', (e) => e.detail)
const CHECK_EVERY_MS = 30 * 60 * 1000;

const announce = (registration) =>
  window.dispatchEvent(
    new CustomEvent('pwa-update-available', { detail: registration }),
  );

export function registerPWA() {
  if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator))
    return;

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        `${process.env.PUBLIC_URL}/service-worker.js`,
      );

      // A worker may already be waiting from an earlier visit
      if (registration.waiting && navigator.serviceWorker.controller)
        announce(registration);

      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          // "installed" + an existing controller = update, not first install
          if (
            worker.state === 'installed' &&
            navigator.serviceWorker.controller
          )
            announce(registration);
        });
      });

      // Installed PWAs can stay open for days: check for new deploys
      const check = () => registration.update().catch(() => {});
      setInterval(check, CHECK_EVERY_MS);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check();
      });
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  });

  // Reload once the new worker takes control
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });
}

export function applyUpdate(registration) {
  if (registration && registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  } else {
    window.location.reload();
  }
}
