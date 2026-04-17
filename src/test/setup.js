import '@testing-library/jest-dom/vitest';

// Stub browser APIs not available in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false
  })
});

// Stub IntersectionObserver
class IntersectionObserverStub {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = IntersectionObserverStub;

// Stub scrollTo
window.scrollTo = () => {};

// Stub Audio
window.Audio = class {
  play() { return Promise.resolve(); }
  pause() {}
  load() {}
};

// Stub Notification API
window.Notification = { permission: 'default', requestPermission: () => Promise.resolve('default') };
