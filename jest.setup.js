// Jest setup file for polyfills and global configurations
const ResizeObserver = require('resize-observer-polyfill');

// Set up ResizeObserver polyfill
global.ResizeObserver = ResizeObserver;
globalThis.ResizeObserver = ResizeObserver;

// Mock window.matchMedia for better test compatibility
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
