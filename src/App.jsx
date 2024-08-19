import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Navbar from './components/Navbar/Navbar'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import VideoPlayer from './components/VideoPlayer/VideoPlayer'
import Main from './pages/Main/Main'
import Subscription from './pages/Subscription/Subscription'
import Sidebar from './components/Sidebar/Sidebar'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import UploadVideo from './pages/UploadVideo/UploadVideo'

function App() {
  return (
    <>
      <ToastContainer theme='dark' position='top-center' autoClose={3000} stacked draggable />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/subscriptions' element={<Main />} />
          <Route path='/playlist' element={<Main />} />
          <Route path='/channel/:channelId' element={<Main />} />
          <Route path='/channel/you' element={<Main />} />
          <Route path='/history' element={<Main />} />
          <Route path="/playlists" element={<Main />} />
          <Route path='/playlist/:playlistId' element={<Main />} />
          <Route path='/likedVideos' element={<Main />} />
          <Route path='/results' element={<Main />} />
          <Route path='/upload/video' element={<UploadVideo />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/watch/:videoId' element={<VideoPlayer />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
