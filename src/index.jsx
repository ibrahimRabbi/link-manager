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
