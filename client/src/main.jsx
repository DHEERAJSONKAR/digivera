import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GoogleAuthProvider from './components/auth/GoogleAuthProvider.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleAuthProvider>
      <App />
    </GoogleAuthProvider>
  </React.StrictMode>,
);
