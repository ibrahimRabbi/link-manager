import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.scss';
import store from './Redux/store.jsx';
import reportWebVitals from './reportWebVitals';
import { AuthContextProvider } from './Store/Auth-Context.jsx';
import { NavigationBarContextProvider } from './Store/NavigationBar-Context.jsx';

ReactDOM.render(
  <AuthContextProvider>
    <Provider store={store}>
      <NavigationBarContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NavigationBarContextProvider>
    </Provider>
  </AuthContextProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
