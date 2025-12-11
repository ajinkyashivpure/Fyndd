import {BrowserRouter as Router, Routes, Route, Navigate, useLocation} from 'react-router-dom';
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
import FriendCartSystem from './pages/ProfilePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SearchFriendsPage from './pages/SeachFriendsPage.jsx';
import FriendsListPage from './pages/FriendsListPage.jsx';
import PendingRequestsPage from './pages/PendingRequestsPage.jsx';
import FriendsCartsPage from './pages/FriendsCartsPage.jsx';
import BetaPrivacy from './pages/BetaPrivacy.jsx';
import BetaTerms from './pages/BetaTerms.jsx';
import LandingPage from "./pages/LandingPage.jsx";
import {AnimatePresence} from "framer-motion";
import {motion} from "framer-motion";


function AnimatedRoutes() {
  const location = useLocation();

  return (
      // AnimatePresence watches for route changes
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
              path="/"
              element={
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                >
                  <LandingPage />
                </motion.div>
              }
          />

          <Route
              path="/home"
              element={
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                >
                  <HomePage />
                </motion.div>
              }
          />

          {/* other routes */}
          <Route path="/explore/:type" element={<ExplorePage />} />
          <Route path="/products/:id" element={<ProductsPage />} />
          <Route path="/login" element={<LoginPage />} /> <Route path="/search" element={<SearchPage />} /> <Route path="/signup" element={<SignupPage />} /> <Route path="/forgot-password" element={<ForgotPasswordPage />} /> <Route path="/verify-otp" element={<VerifyOtpPage />} /> <Route path="/verify-reset-otp" element={<VerifyResetOtpPage />} /> <Route path="/reset-password" element={<ResetPasswordPage />} /> <Route path="/cart" element={<Cart />} /> <Route path="/profile" element={<ProfilePage />} /> <Route path="/profile/search-friends" element={<SearchFriendsPage />} /> <Route path="/profile/friends-list" element={<FriendsListPage />} /> <Route path="/profile/friend-requests" element={<PendingRequestsPage />} /> <Route path="/profile/friends-carts" element={<FriendsCartsPage />} /> <Route path="/terms" element={<BetaTerms />} /> <Route path="/privacy" element={<BetaPrivacy />} />
          {/* ... rest of your routes */}

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
  );
}

function App() {
  return (
      <Router>
        <AnimatedRoutes />
      </Router>
  );
}

export default App;