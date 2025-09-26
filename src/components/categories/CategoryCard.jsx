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
    try {

      const resp=await api.delete(`response/delete_responses_by_category/?category_id=${category_id}&visit_id=${visit_id}`)
      setIsEliminated(prev=>!prev)
      toast.success('responses of the form deleted successfully')
      
    } catch (error) {

      console.log('error in handleDeleteForm from CategoryCard.jsx',error)
      
    }
  }

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
      {!isCompleted?
      <button
        
        
        onClick={() => {
          navigate(`form/${category.id}`);
        }}
        type="button"
        class={`focus:outline-none text-white bg-green-700 hover:bg-green-800  my-8  focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800`}
      >
        Iniciar
      </button>
      :

      <button
        
        
        onClick={() => {
          handleDeleteForm(category.id)
        }}
        type="button"
        class={`focus:outline-none text-white bg-red-700 hover:bg-red-800  my-8  focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800`}
      >
        Eliminar Envio
      </button>

      }
      
    </div>
  );
};

export default CategoryCard;
