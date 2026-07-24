import React from "react";
import { NavLink } from "react-router";
import { SiYoutube, SiFacebook, SiInstagram, SiX } from "react-icons/si";
import { HiGlobeAlt, HiPhone, HiMail, HiOfficeBuilding } from "react-icons/hi";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-red-700 text-white w-full">
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
          <h3 className="font-extrabold text-base md:text-lg leading-tight mb-0.5">
            {t("footer.wellBeingVR")}
          </h3>
          <p className="font-bold text-xs md:text-sm mb-1.5">
            {t("footer.institutionalPolicie")}
          </p>

          <p className="flex items-center gap-2 leading-tight">
            <HiGlobeAlt className="shrink-0" size={14} />
            <a
              href="http://dintev.univalle.edu.co"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-xs"
            >
              {t("footer.website")}
            </a>
          </p>

          <p className="flex items-center gap-2 leading-tight">
            <HiPhone className="shrink-0" size={14} />
            <span className="text-xs">{t("footer.phone")}</span>
          </p>

          <p className="flex items-center gap-2 leading-tight">
            <HiMail className="shrink-0" size={14} />
            <a
              href="mailto:campusvirtual@correounivalle.edu.co"
              className="hover:underline text-xs break-all"
            >
              {t("footer.email")}
            </a>
          </p>

          <p className="flex items-center gap-2 leading-tight">
            <HiOfficeBuilding className="shrink-0" size={14} />
            <span className="text-xs">{t("footer.adress")}</span>
          </p>
        </div>

        {/* Right Section: Social Media Icons */}
        <div className="flex gap-2">
          <a
            href="https://www.youtube.com/user/univallecol"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-md bg-white text-[#C8102E] flex items-center justify-center hover:opacity-80 transition"
          >
            <span className="sr-only">YouTube</span>
            <SiYoutube size={14} />
          </a>
          <a
            href="https://www.facebook.com/universidadunivalle"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-md bg-white text-[#C8102E] flex items-center justify-center hover:opacity-80 transition"
          >
            <span className="sr-only">Facebook</span>
            <SiFacebook size={14} />
          </a>
          <a
            href="https://twitter.com/univalleoficial"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-md bg-white text-[#C8102E] flex items-center justify-center hover:opacity-80 transition"
          >
            <span className="sr-only">Twitter</span>
            <SiX size={13} />
          </a>
          <a
            href="https://www.instagram.com/univalleoficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-md bg-white text-[#C8102E] flex items-center justify-center hover:opacity-80 transition"
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
