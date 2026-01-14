import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { StateInitializer } from "./components/StateInitializer";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import "./index.css";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <StateInitializer>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </Layout>
        </StateInitializer>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
