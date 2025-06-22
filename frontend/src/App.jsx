import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import ExplorePage from './ExplorePage';
import CategoryPage from './CategoryPage';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/categories/:gender" element={<CategoryPage />} />
            </Routes>
        </Router>
    );
}
export default App;