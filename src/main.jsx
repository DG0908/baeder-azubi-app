import React from 'react'
import ReactDOM from 'react-dom/client'
import BaederApp from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { AppProvider } from './context/AppContext.jsx'
import './index.css'

// Prevent white-screen after deploy when a stale tab requests an old chunk.
// Vite emits `vite:preloadError` for failed dynamic imports.
const VITE_RELOAD_GUARD_KEY = '__vite_preload_reloaded__';
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  if (sessionStorage.getItem(VITE_RELOAD_GUARD_KEY)) return;
  sessionStorage.setItem(VITE_RELOAD_GUARD_KEY, '1');
  window.location.reload();
});
window.addEventListener('load', () => sessionStorage.removeItem(VITE_RELOAD_GUARD_KEY));

// LocalStorage wrapper to match window.storage API
window.storage = {
  set: async (key, value, global = false) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return null;
    }
  },

  get: async (key, global = false) => {
    try {
      const value = localStorage.getItem(key);
      if (value === null) return null;
      return { value };
    } catch (e) {
      console.error('Storage get error:', e);
      return null;
    }
  },

  delete: async (key, global = false) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Storage delete error:', e);
      return false;
    }
  },

  list: async (prefix = '', global = false) => {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key);
        }
      }
      return { keys };
    } catch (e) {
      console.error('Storage list error:', e);
      return { keys: [] };
    }
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppProvider>
        <BaederApp />
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>,
)
