import React, { useEffect, useState } from 'react'
import api from '../../api/user.api'
import { useParams } from 'react-router'
import CategoryCard from '../../components/categories/CategoryCard'
import CategoryCardPlaceHolder from '../../components/categories/CategoryCardPlaceHolder'

const Category = () => {

    const {surveysession_id,visit_id}=useParams();

    const [loading,setLoading]=useState(true);

    const [categories,setCategories]=useState([])

    useEffect(()=>{
        async function getCategories(){
            try {
                const res=await api.get(`category/list?surveysession_id=${surveysession_id}`)
                console.log('response from category page:',res)
                setCategories(res.data)

            } catch (error) {
                console.log('error in getCategories',error)
                setLoading(false)
                
            }finally{
              setLoading(false)
            }
        }
    getCategories()

    },[])

  

  return (

    <div className="flex-1 flex ">
      

      <div className="md:w-1/2">
      {!loading?
        <div className="grid grid-cols-1 m-10 md:grid-cols-2 gap-3 ">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} visit_id={visit_id} surveysession_id={surveysession_id}/>
          ))}
        </div>
        :

        <div className="grid grid-cols-1 m-10 md:grid-cols-2 gap-3 ">

          <CategoryCardPlaceHolder/>
          <CategoryCardPlaceHolder/>


          
        </div>


      }
        
      </div>

      <div className="bt-green-700 md:w-1/2 bg-[url('/categorias/categorias.png')] bg-no-repeat bg-cover bg-center"></div>

    </div>

  )
}

export default Category