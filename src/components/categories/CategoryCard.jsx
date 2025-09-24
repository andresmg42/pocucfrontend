import { Navigate, useNavigate } from "react-router";

const CategoryCard = ({ category, surveysession_id }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white p-3 hover:bg-gray-200 transition duration-300 ease-in-out
        hover:cursor-pointer"
    >
      {category.image != null && (
        <img
          src={category.image}
          alt={category.name}
          className="w-32 h-[120px] object-cover mb-3 rounded-md"
        />
      )}
      <h1 className="font-bold uppercase text-black">{category.name}</h1>
      <button
        onClick={() => {
          navigate(`form/${category.id}`);
        }}
        type="button"
        class="focus:outline-none text-white bg-green-700 my-8 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Iniciar Formulario
      </button>
    </div>
  );
};

export default CategoryCard;
