import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initDatabase, initAdminUser } from './services/appwrite';

// Initialize Appwrite and then render the app
const initializeApp = async () => {
  try {
    // Initialize database
    await initDatabase();
    
    // Create admin user if not exists
    await initAdminUser();
  } catch (error) {
    console.error('App initialization failed:', error);
  }
};

// Start initialization but don't wait for it to render app
initializeApp();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);