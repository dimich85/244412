// This script is injected into every page loaded in the Safari BrowserView.
// It runs before the page's own scripts.
const { ipcRenderer } = require('electron');

console.log('[FP-Injector] Injected. Requesting profile...');

// Immediately invoke a function to get the profile and apply it.
(async () => {
  try {
    const profile = await ipcRenderer.invoke('get-current-profile');
    console.log('[FP-Injector] Profile received:', profile.name);

    // Spoof platform
    Object.defineProperty(navigator, 'platform', {
      get: () => profile.platform,
      configurable: true
    });

    // Spoof vendor
    Object.defineProperty(navigator, 'vendor', {
      get: () => profile.vendor,
      configurable: true
    });

    // Spoof screen dimensions
    Object.defineProperty(screen, 'width', {
      get: () => profile.screen.width,
      configurable: true
    });
    Object.defineProperty(screen, 'height', {
      get: () => profile.screen.height,
      configurable: true
    });
    Object.defineProperty(screen, 'availWidth', {
        get: () => profile.screen.width,
        configurable: true
    });
    Object.defineProperty(screen, 'availHeight', {
        get: () => profile.screen.height - 40, // Simulate browser UI
        configurable: true
    });


    console.log(`[FP-Injector] Spoofed: platform=${navigator.platform}, vendor=${navigator.vendor}, screen=${screen.width}x${screen.height}`);

  } catch (error) {
    console.error('[FP-Injector] Failed to get or apply profile:', error);
  }
})();