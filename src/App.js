import './App.css';
import './header.css';
import './main.css';
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom';
import MainPage from './pages/mainPage'
import Cart from './pages/cart'
import Item from './pages/item'
import Admin from './pages/admin'
import CatalogPage from './pages/catalogPage'


function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route element={<Admin />} path="/admin" />
          <Route element={<MainPage />} path="/" />
          <Route element={<CatalogPage />} path="/catalog" />
          <Route element={<Cart />} path="/cart/" />
          <Route element={<Item />} path="/item" />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
