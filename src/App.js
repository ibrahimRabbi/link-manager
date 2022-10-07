import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EditLink from './Components/EditLink/EditLink';
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
        <Route path='/edit-link/:id' element={<EditLink />} />
        <Route path='/details/:id' element={<LinkDetails />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}
export default App;
