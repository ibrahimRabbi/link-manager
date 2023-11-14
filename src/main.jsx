import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import store from './Redux/store';
import './index.less';
import { MixpanelProvider } from 'react-mixpanel-browser';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './Store/Auth-Context.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// define global for the vite.js
import process from 'process/browser';
window.process = process;
window.global = window;

//// Sentry error tracing setup
import * as Sentry from '@sentry/react';
import { BrowserTracing, Replay } from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const ENVIRONMENT = import.meta.env.VITE_NODE_ENV;

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [new BrowserTracing(), new Replay()],
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  normalizeDepth: 10,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 1.0,
  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,
  environment: ENVIRONMENT,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MixpanelProvider>
      <BrowserRouter>
        <AuthContextProvider>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </Provider>
        </AuthContextProvider>
      </BrowserRouter>
    </MixpanelProvider>
  </React.StrictMode>,
);
