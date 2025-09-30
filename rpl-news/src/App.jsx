import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import React from 'react'
import About from './pages/About'
import News from './pages/News'
import AllNews from './pages/AllNews'
import NewsDetail from './pages/NewsDetail'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import Index from './pages/Index'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
          <Index />
          }
        />
        <Route path="/news/all" element={<AllNews />} />
        <Route path="/news/:id" element={<NewsDetail />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
