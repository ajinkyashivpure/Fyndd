import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import AestheticsPage from "./pages/AestheticsPage.jsx";
import ProductsPage from './pages/ProductsPage.jsx';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/categories/:gender" element={<CategoryPage />} />
                <Route path="/aesthetics" element={<AestheticsPage />} />
                <Route path="/:gender/:category" element={<ProductsPage />} />
            </Routes>
        </Router>
    );
}
export default App;
