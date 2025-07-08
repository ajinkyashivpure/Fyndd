import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import VerifyOtpPage from './pages/VerifyOtpPage.jsx';
import VerifyResetOtpPage from './pages/VerifyResetOtpPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import Cart from './pages/Cart.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore/:type" element={<ExplorePage />} />
                 <Route path="/products/:id" element={<ProductsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/verify-otp" element={<VerifyOtpPage />} />
                <Route path="/verify-reset-otp" element={<VerifyResetOtpPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                 <Route path="/cart" element={<Cart />} />

                {/* Catch-all route - must be last */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}
export default App;