import React from 'react'
import LayoutAdmin from '../../layout/LayoutAdmin'
import { Outlet } from 'react-router-dom'

const Index = () => {
  return (
    <LayoutAdmin>
      <Outlet />
    </LayoutAdmin>
  )
}

export default Index