import React, { Children } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Layout = ({children, forceScrolledStyle = false}) => {
  return (
    <div className="min-h-screen  text-foreground">
      <Navbar forceScrolledStyle={forceScrolledStyle} />
        {children}
      <Footer />
    </div>
  )
}

export default Layout