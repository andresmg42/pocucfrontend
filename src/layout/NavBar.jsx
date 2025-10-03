import React from 'react'
import { useState } from 'react';
import { NavLink } from 'react-router';
import useAuthStore from '../stores/use-auth-store';
import { useNavigate } from 'react-router';

function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const {userLogged,logout} = useAuthStore();
    const navigate=useNavigate();

  const handleLogout = ()=>{
    logout()
    navigate('/login')
  }

  return (
    <div className="bg-zinc-700 text-white font-bold py-4 fixed top-0 left-0 w-full  shadow">
    <nav className="container mx-auto flex justify-between items-center h-10 pr-5 pl-5">
      
      <div className="h-16 flex items-center ml-5">
        <NavLink to="/">
        
        <img src="/logo/logoUV_Oficial_Rojo.svg" alt="logo" className='w-full h-12'/>

       
        
        
        </NavLink>
      </div>

      
      <div className="block md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      
      <ul
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:flex md:space-x-6 absolute md:relative bg-black/50 md:bg-transparent w-full md:w-auto left-0 md:left-auto top-16 md:top-0 p-4 md:p-0 z-10`}
      >
        <li>
          <NavLink
            to="/"
            exact
            className="hover:text-[#797777] block md:inline-block py-2 md:py-0"
            activeClassName="text-blue-500"
          >
            Encuestas
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/quiz"
            className="hover:text-[#797777] block md:inline-block py-2 md:py-0"
            activeClassName="text-blue-500"
          >
            Estadisticas
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className="hover:text-[#797777] block md:inline-block py-2 md:py-0 "
            activeClassName="text-blue-500"
          >
            Sobre nosotros
          </NavLink>
        </li>
        {!userLogged && 
        <li>
          <NavLink
            to="/login"
            className="hover:text-[#797777] block md:inline-block py-2 md:py-0"
            activeClassName="text-blue-500"
          >
            Iniciar Sesión
          </NavLink>
        </li>
        }
        {userLogged && (
          <li>
            <button
              onClick={handleLogout}
              className="hover:text-[#797777] block md:inline-block py-2 md:py-0"
            >
              Cerrar Sesión
            </button>
          </li>
        )}
       
      </ul>
    </nav>
  </div>
  )
}

export default NavBar