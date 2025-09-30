import React from 'react'
import Layout from '../layout/Layout'
import Home from './Home'
import About from './About'
import News from './News'
import { Link } from 'react-router-dom'
import '../index.css';

function Index() {
  return (
    <Layout>
        <Home />
        <About />
        <News />
        
    </Layout>
  )
}

export default Index