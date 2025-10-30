import React from 'react'
import { NavLink } from 'react-router';
import { SiYoutube, SiFacebook, SiInstagram } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-white text-black  bottom-0 left-0 rigth-0 w-full">
        <div className="flex justify-end pr-8 pt-2 text-sm">
        <NavLink to="/politica-de-privacidad" className="hover:underline">
          Política de privacidad
        </NavLink>
      </div>

      {/* Main content container for alignment */}
      <div className="container mx-auto px-5 py-4 flex flex-col md:flex-row justify-between items-start md:items-end">
        {/* Left Section: Contact Information */}
        <div className="flex flex-col mb-4 md:mb-0 text-sm">
          <h3 className="font-bold text-lg mb-2">Vicerrectoría Académica</h3>
          <p className="font-semibold text-base mb-2">Dirección de Nuevas Tecnologías y Educación Virtual - DINTEV</p>

          <p className="flex items-center mt-1">
            <span className="mr-2">📧</span>
            <a href="mailto:dintev@univalle.edu.co" className="hover:underline">dintev@univalle.edu.co</a>
          </p>
          <p className="flex items-center mt-1">
            <span className="mr-2">📞</span>
            + (602) 3212100 extensiones: 2640 – 2683
          </p>
          <p className="flex items-center mt-1">
            <span className="mr-2">✉️</span>
            <a href="mailto:campusvirtual@correounivalle.edu.co" className="hover:underline">campusvirtual@correounivalle.edu.co</a>
          </p>
          <p className="flex items-center mt-1">
            <span className="mr-2">📍</span>
            Edificio 210 Oficina 2004 / Campus Meléndez
          </p>
        </div>

        {/* Right Section: Social Media Icons */}
        <div className="flex space-x-4 mb-4 md:mb-0 text-2xl">
          <a 
            href="https://www.youtube.com/user/univallecol" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-gray-300"
          >
            <span className="sr-only">YouTube</span>
            <SiYoutube /> {/* Use the component here */}
          </a>
          <a 
            href="https://www.facebook.com/universidadunivalle" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-gray-300"
          >
            <span className="sr-only">Facebook</span>
            <SiFacebook /> {/* Use the component here */}
          </a>
          <a 
            href="https://www.instagram.com/univalleoficial/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-gray-300"
          >
            <span className="sr-only">Instagram</span>
            <SiInstagram /> {/* Use the component here */}
          </a>
        </div>
      </div>


    </footer>
  )
}

export default Footer