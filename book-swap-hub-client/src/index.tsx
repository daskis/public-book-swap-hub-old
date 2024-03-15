import React from 'react';
import ReactDOM from 'react-dom/client';
import "./styles/global.scss"
import "./index.scss"
import App from './App';
import {Provider} from "react-redux";
import store from "./store";
import {BrowserRouter} from "react-router-dom";
import "./styles/global.scss";
import {ThemeProvider} from "./utils/ThemeProvider";
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
      <BrowserRouter>
          <ThemeProvider>
              <App />
          </ThemeProvider>
      </BrowserRouter>
  </Provider>
);
