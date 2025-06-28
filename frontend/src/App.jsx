import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import AestheticsPage from "./pages/AestheticsPage.jsx";
import ProductsPage from './pages/ProductsPage.jsx';
import SearchPage from './pages/SearchPage.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore/:type" element={<ExplorePage />} />
                <Route path="/categories/:gender" element={<CategoryPage />} />
                <Route path="/aesthetics" element={<AestheticsPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/search" element={<SearchPage />} />
                {/* Catch-all route - must be last */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}
export default App;