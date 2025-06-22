import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import ExplorePage from './ExplorePage';
import CategoryPage from './CategoryPage';
import AestheticsPage from "./AestheticsPage.jsx";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/categories/:gender" element={<CategoryPage />} />
                <Route path="/aesthetics" element={<AestheticsPage />} />
            </Routes>
        </Router>
    );
}
export default App;