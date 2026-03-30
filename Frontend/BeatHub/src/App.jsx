import { Routes, Route } from 'react-router-dom'
import Home from './pages/home.jsx'
import Catalog from './pages/catalog.jsx'
import ArtistDetail from './pages/artistDetail.jsx'
import AlbumDetail from './pages/albumDetail.jsx'
import TrackDetail from './pages/trackDetail.jsx'
import LoginPage from './pages/LoginPage.jsx'
import AuthRoute from './components/router/AuthRoute.jsx'
import RegisterPage from './pages/registerPage.jsx'
import UserProfile from './pages/UserProfile.jsx'

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/artist/:id" element={<ArtistDetail />} />
            <Route path="/album/:id" element={<AlbumDetail />} />
            <Route path='/track/:id' element={<TrackDetail />} />
            <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
            <Route path="/user/:username" element={<UserProfile />} />
        </Routes>
    )
}