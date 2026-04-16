import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettier,
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        Image: 'readonly',
        AudioContext: 'readonly',
        SpeechSynthesisUtterance: 'readonly',
        HTMLElement: 'readonly',
        Event: 'readonly',
        AbortController: 'readonly',
        crypto: 'readonly',
        performance: 'readonly',
        structuredClone: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        matchMedia: 'readonly',
        ResizeObserver: 'readonly',
        IntersectionObserver: 'readonly',
        Notification: 'readonly',
        Promise: 'readonly',
        Map: 'readonly',
        Set: 'readonly',
        atob: 'readonly',
        btoa: 'readonly',
        queueMicrotask: 'readonly',
        caches: 'readonly',
        importScripts: 'readonly',
        confirm: 'readonly',
        Headers: 'readonly',
        MouseEvent: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        self: 'readonly'
      }
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off', // Deutsche Umlaute in JSX sind gewollt
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Quality
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-debugger': 'warn',
      'no-duplicate-case': 'error',
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-extra-boolean-cast': 'warn',
      'no-irregular-whitespace': 'warn',
      'no-constant-condition': ['warn', { checkLoops: false }],
      'no-self-assign': 'warn',
      'no-unreachable': 'warn',

      // Relaxed for migration — tighten later
      'no-prototype-builtins': 'off',
      'no-case-declarations': 'off',
      'no-useless-escape': 'warn'
    }
  },
  {
    ignores: ['dist/', 'dev-dist/', 'node_modules/', 'server/', 'scripts/', '*.config.js', '*.config.mjs']
  }
];
