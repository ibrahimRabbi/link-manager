import React from 'react';
import ReactDOM from 'react-dom';
import { MixpanelProvider } from 'react-mixpanel-browser';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// import './index.scss';
import './index.less';
import store from './Redux/store.jsx';
import reportWebVitals from './reportWebVitals';
import { AuthContextProvider } from './Store/Auth-Context.jsx';
// import * as Sentry from '@sentry/react';
// import { BrowserTracing, Replay } from '@sentry/react';

// const SENTRY_DSN = `${process.env.REACT_APP_SENTRY_DSN}`;
// const ENVIRONMENT = `${process.env.NODE_ENV}`;

// Sentry.init({
//   // eslint-disable-next-line max-len
//   dsn: SENTRY_DSN,
//   integrations: [new BrowserTracing(), new Replay()],

//   // We recommend adjusting this value in production, or using tracesSampler
//   // for finer control
//   tracesSampleRate: 1.0,
//   normalizeDepth: 10,

//   // This sets the sample rate to be 10%. You may want this to be 100% while
//   // in development and sample at a lower rate in production
//   replaysSessionSampleRate: 1.0,
//   // If the entire session is not sampled, use the below sample rate to sample
//   // sessions when an error occurs.
//   replaysOnErrorSampleRate: 1.0,
//   environment: ENVIRONMENT,
// });

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
