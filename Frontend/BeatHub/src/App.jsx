import { Routes, Route } from 'react-router-dom'
import Home from './pages/home.jsx'
import Catalog from './pages/catalog.jsx'
import ArtistDetail from './pages/artistDetail.jsx'
import AlbumDetail from './pages/albumDetail.jsx'
import TrackDetail from './pages/trackDetail.jsx'
import LoginPage from './pages/loginPage.jsx'
import AuthRoute from './components/router/AuthRoute.jsx'
import RegisterPage from './pages/registerPage.jsx'
import UserProfile from './pages/UserProfile.jsx'
import FeedPage from './components/cards/FeedView.jsx'
import PrivacyPolicy from './pages/Privacy.jsx';
import TermsOfService from './pages/TermsOfService.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx'
import ScrollToTop from './components/router/ScrollToTop.jsx'

export default function App() {
    return (
<>
        <ScrollToTop />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/artist/:id" element={<ArtistDetail />} />
            <Route path="/album/:id" element={<AlbumDetail />} />
            <Route path='/track/:id' element={<TrackDetail />} />
            <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
            <Route path="/user/:username" element={<UserProfile />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
</>
    )
}