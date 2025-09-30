import LayoutAuthor from '../../layout/LayoutAuthor'
import React from 'react'
import { Outlet } from 'react-router-dom';

const Index = () => {
  return (
    <LayoutAuthor>
        <Outlet />
    </LayoutAuthor>
  )
}

export default Index