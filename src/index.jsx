import React from 'react';
import ReactDOM from 'react-dom';
import { MixpanelProvider } from 'react-mixpanel-browser';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.scss';
import store from './Redux/store.jsx';
import reportWebVitals from './reportWebVitals';
import { AuthContextProvider } from './Store/Auth-Context.jsx';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/react';

const SENTRY_DSN = `${process.env.REACT_APP_SENTRY_DSN}`;

Sentry.init({
  // eslint-disable-next-line max-len
  dsn: SENTRY_DSN,
  integrations: [new BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  normalizeDepth: 10,
});

ReactDOM.render(
  <React.StrictMode>
    <MixpanelProvider>
      <AuthContextProvider>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </AuthContextProvider>
    </MixpanelProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
