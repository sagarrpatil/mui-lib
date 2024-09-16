import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './assets/css/App.css';
// import * as serviceWorker from "serviceWorker";

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
// serviceWorker.register();
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/service-worker.js")
//       .then((registration) => {
//         console.log("Service Worker registered: ", registration);
//       })
//       .catch((error) => {
//         console.error("Service Worker registration failed: ", error);
//       });
//   });
// }
