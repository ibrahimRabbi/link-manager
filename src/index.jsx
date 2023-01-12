import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {AuthContextProvider} from './Store/Auth-Context.jsx';
import {Provider} from 'react-redux';
import store from './Redux/store.jsx';
import {BrowserRouter} from 'react-router-dom';
import {NavigationBarContextProvider} from './Store/NavigationBar-Context.jsx';

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <Provider store={store}>
        <NavigationBarContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </NavigationBarContextProvider>
      </Provider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
