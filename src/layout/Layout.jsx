import React from 'react'
import NavBar from './NavBar'
import Footer from './footer/Footer'

function Layout({children}) {
  return (
    <div className='layout min-h-screen flex flex-col '>
        <NavBar/>
        <main className='layout-content flex-1 flex w-full pt-16'>
            {children}
        </main>
        <Footer/>
       
    </div>
     
  )
}

export default Layout