import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from './pages/Main';
import NoPage from './pages/NoPage';
import Products from './pages/Products.jsx';
import Product from './pages/Product.jsx';
import { store } from './app/store';
import { Provider } from 'react-redux';
import Prefetch from './features/cart/Prefetch.jsx';
import PersistCart from './features/cart/PersistCart.jsx';


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
          <Routes>
            <Route element={<PersistCart/>}>
              {/* Persists data for every child page under Prefetch*/}
              <Route element={<Prefetch/>}> 
                <Route path="/product" element={<Products />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/" element={<Main />} />
                <Route index element={<Main />} />
              </Route>
            </Route>
        
            
            {/* Fallback route for unmatched paths */}
            <Route path="*" element={<NoPage />} />
   
          </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
