import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Home from './pages/home.jsx'
import Catalog from './pages/catalog.jsx'
import ArtistDetail from './pages/artistDetail.jsx'
import AlbumDetail from './pages/albumDetail.jsx'
import TrackDetail from './pages/trackDetail.jsx'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/catalog" element={<Catalog/>} />
        <Route path="/artist/:id" element={<ArtistDetail />} />
        <Route path="/album/:id" element={<AlbumDetail/>}/>
        <Route path='/track/:id' element={<TrackDetail/>} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />);