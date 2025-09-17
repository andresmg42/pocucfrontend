import { Navigate, useNavigate } from "react-router"

const CategoryCard = ({category,surveysession_id}) => {

  const navigate=useNavigate();
  return (
    <div className="bg-white p-3 hover:bg-gray-200 transition duration-300 ease-in-out
        hover:cursor-pointer"

        onClick={()=>{
            navigate(`form/${category.id}/${surveysession_id}`)
        }}
        >
            
            {category.image!=null && (
               <img 
               src={category.image} 
               alt={category.name}
               className="w-32 h-[120px] object-cover mb-3 rounded-md"
           />
            )}
            <h1 className="font-bold uppercase text-black">{category.name}</h1>
            
            
        </div>
  )
}

export default CategoryCard