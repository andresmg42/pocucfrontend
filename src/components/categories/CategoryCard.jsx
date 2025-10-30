import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import api from "../../api/user.api";
import { useState } from "react";
import toast from "react-hot-toast";

const CategoryCard = ({ category, surveysession_id, visit_id }) => {
  const navigate = useNavigate();
  const [isCompleted,setIsCompleted]=useState(false);
  const [isEliminated,setIsEliminated]=useState(false);

  useEffect(()=>{

    async function get_category_is_completed(){
      try {
      const res=await api.get(`category/category_completed?category_id=${category.id}&visit_id=${visit_id}`)
      console.log('respuesta de category card', res.data.is_completed)
      
      setIsCompleted(res.data.is_completed)
      
      
    } catch (error) {
      console.log('error in category_completed fetch',error)     
    }

    }

    get_category_is_completed();
    
  },[isEliminated])

  const handleDeleteForm= async (category_id)=>{

    const confirmed = window.confirm("Esta seguro de que desea eliminar este formulario?");

    if (confirmed){
      try {

      const resp=await api.delete(`response/delete_responses_by_category/?category_id=${category_id}&visit_id=${visit_id}`)
      setIsEliminated(prev=>!prev)
      toast.success('responses of the form deleted successfully')
      
    } catch (error) {

      console.log('error in handleDeleteForm from CategoryCard.jsx',error)
      
    }
    }
  }

  return (
   <div
  className="
    flex 
    flex-col 
    overflow-hidden // Ensures content respects the rounded corners
    rounded-xl 
    bg-white 
    shadow-md 
    transition-all 
    duration-300 
    ease-in-out 
    hover:shadow-xl 
    hover:-translate-y-1.5
    border
    border-transparent
    hover:border-indigo-500
    
  "
>
  {/* Image Section with a Placeholder Fallback */}
  {category.image ? (
    <img
      src={category.image}
      alt={category.name}
      className="h-48 w-full object-cover"
    />
  ) : (
    // A placeholder for categories without an image
    <div className="flex h-48 w-full items-center justify-center bg-slate-200">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  )}

  {/* Content Section */}
  <div className="flex flex-grow flex-col p-5">
    <h2 className="text-lg font-bold uppercase tracking-tight text-slate-800">
      {category.name}
    </h2>

    {/* This wrapper pushes the button to the bottom */}
    <div className="mt-auto pt-5">
      {!isCompleted ? (
        <button
          onClick={() => {
            navigate(`form/${category.id}/${category.name}/`);
          }}
          type="button"
          className="w-full rounded-lg bg-green-600 px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          Iniciar
        </button>
      ) : (
        <button
          onClick={() => {
            handleDeleteForm(category.id);
          }}
          type="button"
          className="w-full rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          Eliminar Envio
        </button>
      )}
    </div>
  </div>
</div>
  );
};

export default CategoryCard;
