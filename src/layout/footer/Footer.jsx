import React from 'react'
import { NavLink } from 'react-router';
import { SiYoutube, SiFacebook, SiInstagram } from "react-icons/si";

const Footer = () => {
  return (
    <footer className=" text-black bg-black/2  bottom-0 left-0 right-0 w-full">
        <div className="flex justify-end pr-8 pt-2 text-sm">
        <NavLink to="/politica-de-privacidad" className="hover:underline text-xs md:text-sm">
          Política de privacidad
        </NavLink>
      </div>

      {/* Main content container for alignment */}
      <div className=" mx-auto px-5 py-4  flex  flex-col md:flex-row justify-start items-start md:items-end">
        {/* Left Section: Contact Information */}
        <div className="flex flex-col mb-4 md:mb-0 text-sm">
          <h3 className="font-bold text-sm md:text-lg mb-2">Vicerrectoría de Bienestar Universitario</h3>
          <p className="font-semibold text-xs md:text-base mb-2">Política Institucional Universidad Saludable</p>
          <p className="font-semibold text-xs md:text-base mb-2">Linea de Conocimiento saberes y prácticas en promoción de la salud </p>
          <p className="font-semibold text-xs md:text-base mb-2">Prioridades: Salud Ambiental y Salud Social</p>
          <p className="flex items-center mt-1">
            <span className="mr-2">📧</span>
            <a href="mailto:dintev@univalle.edu.co" className="hover:underline text-xs md:text-base break-all">programa.universidadsaludable@correounivalle.edu.co</a>
          </p>
          <p className="flex items-center mt-1">
            <span className="mr-2 text-xs md:text-base">📍</span>
            Edificio D7, Tercer piso,Campus Meléndez
          </p>
        </div>

        {/* Right Section: Social Media Icons */}
        <div className="flex   gap-5 ml-auto  mb-4 md:mb-0 text-4xl">
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