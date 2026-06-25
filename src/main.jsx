import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

// Redirect legacy GitHub Pages project URL (/Pinnacle-Finance/...) to domain root
const legacyPrefix = '/Pinnacle-Finance';
if (window.location.pathname.startsWith(legacyPrefix)) {
  const path = window.location.pathname.slice(legacyPrefix.length) || '/';
  window.history.replaceState(null, '', path + window.location.search + window.location.hash);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
