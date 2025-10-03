import React from 'react'
import NavBar from './NavBar'

function Layout({children}) {
  return (
    <div className='layout'>
        <NavBar/>
        <main className='layout-content '>
            {children}
        </main>



    </div>
  )
}

export default Layout