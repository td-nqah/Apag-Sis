// ==========================================================================
// APAG SIS | Hệ thống cố vấn thông minh - React Entry Point
// ==========================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

// Import all existing CSS design tokens and layouts (1:1 preservation, zero regression)
import '../css/variables.css';
import '../css/global.css';
import '../css/minimal.css';
import '../css/sidebar.css';
import '../css/dashboard.css';
import '../css/student.css';
import '../css/advisor.css';
import '../css/admin.css';
import '../css/login.css';
import '../css/ai.css';
import '../css/responsive.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
