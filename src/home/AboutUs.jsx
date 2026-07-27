import React from "react";

const AboutUs = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#FBF7F0] px-6 py-10 sm:py-12 md:py-14">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Work+Sans:wght@300;400;500;600&display=swap');

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>

      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full border border-[#C9A15A]/25"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full border border-[#6E8B74]/20"
      />

      <div className="relative mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        {/* Left */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <span className="mb-3 font-['Work_Sans',sans-serif] text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A15A]">
            Vicerrectoría de Bienestar Universitario
          </span>

          <h1 className="font-['Fraunces',serif] text-3xl font-semibold leading-tight text-red-700 sm:text-4xl md:text-[2.7rem]">
            Política Institucional
            <br className="hidden sm:block" />
            Universidad Saludable
          </h1>

          <h2 className="mt-2 font-['Fraunces',serif] text-xl italic text-[#6E8B74]">
            Estratégicamente Humana
          </h2>

          <div className="mt-5 h-px w-16 bg-[#C9A15A]/60" />

          {/* Mobile image */}
          <div className="my-6 flex justify-center md:hidden">
            <SpiralImage />
          </div>

          <p className="mt-5 max-w-xl text-justify font-['Work_Sans',sans-serif] text-[15px] leading-8 text-[#2B2420]/90">
            La Política Universidad Saludable, de la Vicerrectoría de Bienestar
            Universitario de la Universidad del Valle, establece el marco
            normativo y estratégico que orienta el fortalecimiento de entornos
            saludables, seguros, incluyentes, sostenibles y la promoción de una
            cultura del cuidado de la salud mental, física, social y ambiental,
            la espiritualidad y el bien común, por lo cual, impulsa acciones
            psicosociales, educativas y participativas que promueven la
            corresponsabilidad, la interculturalidad, el diálogo de saberes y la
            participación de la comunidad universitaria en el cuidado cotidiano
            de la vida, el bienestar y la convivencia.
          </p>

          <a
            href="https://linktr.ee/unisaludable"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex items-center gap-3 rounded-full border border-[#7A1F2B]/20 bg-white py-2.5 pl-2.5 pr-5 font-['Work_Sans',sans-serif] text-sm font-medium text-[#7A1F2B] shadow-sm transition hover:border-[#7A1F2B]/40 hover:shadow-md"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-700 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <rect x="3" y="3" width="7" height="7" rx="1.2" />
                <rect x="14" y="3" width="7" height="7" rx="1.2" />
                <rect x="3" y="14" width="7" height="7" rx="1.2" />
                <rect x="14" y="14" width="7" height="7" rx="1.2" />
              </svg>
            </span>
            <div className="text-red-700">
              Conoce la Tabla Periódica Univalluna
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-red-700"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Desktop image */}
        <div className="hidden justify-center md:flex">
          <SpiralImage />
        </div>
      </div>
    </section>
  );
};

const SpiralImage = () => (
  <div className="relative mx-auto flex aspect-square w-[min(30rem,48vw)] items-center justify-center">
    <div className="absolute inset-0 animate-[spin-slow_60s_linear_infinite] motion-reduce:animate-none rounded-full border-2 border-dashed border-[#7A1F2B]/25" />
    <div className="absolute inset-3 animate-[spin-slow-reverse_42s_linear_infinite] motion-reduce:animate-none rounded-full border border-[#6E8B74]/35" />
    <div className="absolute inset-6 rounded-full bg-gradient-to-br from-[#FBF7F0] to-[#F1E9DA] shadow-inner" />

    <img
      src="aboutus/Espiral-Unisaludable_2006.png"
      alt="Espiral Unisaludable"
      className="relative z-10 w-[95%] drop-shadow-md"
    />
  </div>
);

export default AboutUs;
