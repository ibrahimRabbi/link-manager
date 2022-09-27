import { Route, Routes } from "react-router-dom";
import './Styles/GlobalStyle.css';
import NotFound from "./Pages/404";
import Home from "./Pages/Home";
import NewLink from "./Components/NewLink/NewLink";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/new-link' element={<NewLink />} />

        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
