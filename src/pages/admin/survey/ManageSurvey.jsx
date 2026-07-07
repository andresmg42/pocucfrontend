import { useMemo, useState } from "react";
import FormsTable from "../../../components/admin/survey/FormsTable";

const MENU_ITEMS = [
  "Usuarios",
  "Campus",
  "Zonas",
  "Categorias",
  "Subcategorias",
  "Formularios",
  "Sesiones Formularios",
  "Visitas",
];

const CreateSurvey = () => {
  const [activeItem, setActiveItem] = useState(MENU_ITEMS[0]);
  const title = useMemo(() => activeItem || "Administracion", [activeItem]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-amber-50 to-sky-50">
      <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative flex w-full gap-6 px-6 pb-12 pt-10">
        <aside className="w-72 shrink-0 rounded-3xl border border-amber-100 bg-white/80 p-6 shadow-lg shadow-amber-100/60 backdrop-blur">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
              Administracion
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Panel de control
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Selecciona un modelo para administrar.
            </p>
          </div>

          <nav className="space-y-2">
            {MENU_ITEMS.map((item) => {
              const isActive = item === activeItem;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{item}</span>
                  <span
                    className={`text-xs ${
                      isActive ? "text-amber-200" : "text-slate-400"
                    }`}
                  >
                    {isActive ? "Activo" : "Ver"}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/60 backdrop-blur">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Area de trabajo
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                  {title}
                </h2>
                <p className="mt-3 max-w-xl text-sm text-slate-500">
                  Este panel esta listo para implementar las operaciones CRUD.
                  Selecciona un modulo en el menu para comenzar.
                </p>
              </div>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
                En blanco
              </span>
            </div>

            <div className="mt-8">
              {activeItem === "Formularios" ? (
                <FormsTable />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center">
                  <p className="text-sm font-medium text-slate-500">
                    Aqui apareceran los formularios, tablas y acciones.
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    Puedes empezar con la creacion, edicion y eliminacion de{" "}
                    {activeItem.toLowerCase()}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default CreateSurvey;
