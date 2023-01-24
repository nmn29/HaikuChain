import React from 'react';
import ReactDOM from 'react-dom/client';
import './stylesheets/index.css';
import './stylesheets/reset.css';
import Router from './Router.js'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router />
);