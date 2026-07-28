import React from "react";
import { NavLink } from "react-router";
import { SiYoutube, SiFacebook, SiInstagram, SiX } from "react-icons/si";
import { HiGlobeAlt, HiPhone, HiMail, HiOfficeBuilding } from "react-icons/hi";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-white text-black w-full">
      {/* Top row: privacy policy link */}
      <div className="flex justify-end px-6 pt-1.5">
        <NavLink
          to="/politica-de-privacidad"
          className="hover:underline text-xs"
        >
          {t("footer.privacyPolicies")}
        </NavLink>
      </div>

      {/* Main content container */}
      <div className="px-6 pt-1 pb-3 flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
        {/* Left Section: Institutional + contact info */}
        <div className="flex flex-col text-sm leading-tight">
          <h3 className="font-bold md:text-lg leading-tight mb-0.5">
            {t("footer.wellBeingVR")}
          </h3>
          <p className="font-bold text-xs md:text-sm mb-1.5">
            {t("footer.institutionalPolicie")}
          </p>

          <p className="flex items-center gap-2 leading-tight">
            <HiGlobeAlt className="shrink-0 text-red-700" size={14} />
            <a
              href="http://dintev.univalle.edu.co"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-xs"
            >
              https://vicebienestar.univalle.edu.co/proyecto-universidad-saludable
            </a>
          </p>

          <p className="flex items-center gap-2 leading-tight">
            <HiPhone className="shrink-0 text-red-700" size={14} />
            <span className="text-xs">+57 602 3212100</span>
          </p>

          <p className="flex items-center gap-2 leading-tight">
            <HiMail className="shrink-0 text-red-700" size={14} />
            <a
              href="mailto:campusvirtual@correounivalle.edu.co"
              className="hover:underline text-xs break-all"
            >
              politica.universidadsaludable@correounivalle.edu.co
            </a>
          </p>

          <p className="flex items-center gap-2 leading-tight">
            <HiOfficeBuilding className="shrink-0 text-red-700" size={14} />
            <span className="text-xs">{t("footer.adress")}</span>
          </p>
        </div>

        {/* Right Section: Social Media Icons */}
        <div className="flex gap-2">
          <a
            href="https://www.youtube.com/@unisaludaleuv"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-md bg-red-700 text-white flex items-center justify-center hover:opacity-80 transition"
          >
            <span className="sr-only">YouTube</span>
            <SiYoutube size={14} />
          </a>
          <a
            href="https://www.facebook.com/unisaludableuv"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-md bg-red-700 text-white flex items-center justify-center hover:opacity-80 transition"
          >
            <span className="sr-only">Facebook</span>
            <SiFacebook size={14} />
          </a>
          <a
            href="https://www.instagram.com/unisaludableuv"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-md bg-red-700 text-white flex items-center justify-center hover:opacity-80 transition"
          >
            <span className="sr-only">Instagram</span>
            <SiInstagram size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
