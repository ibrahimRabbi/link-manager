import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LinkDetails from './Components/LinkDetails/LinkDetails';
import NewLink from './Components/NewLink/NewLink';
import NotFound from './Pages/404';
import Home from './Pages/Home';
import './Styles/GlobalStyle.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/new-link' element={<NewLink />} />
        <Route path='/link-details' element={<LinkDetails />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}
export default App;
