import './App.css';
import './header.css';
import './main.css';
import { Routes, Route, HashRouter } from 'react-router-dom';
import MainPage from './pages/mainPage'
import Cart from './pages/cart'
import Item from './pages/item'
import ItemInAdmin from './pages/_item'
import About from './pages/about'
import Admin from './pages/admin'
import New from './pages/new'
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
          <Route element={<ItemInAdmin />} path="/item-change" />
          <Route element={<MainPage />} path="/*" />
          <Route element={<About />} path="/about" />
          <Route element={<New />} path="/new" />


        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
