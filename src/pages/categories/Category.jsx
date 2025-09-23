import React, { useEffect, useState } from 'react'
import api from '../../api/user.api'
import { useParams } from 'react-router'
import CategoryCard from '../../components/categories/CategoryCard'

const Category = () => {

    const {surveysession_id}=useParams();

    const [categories,setCategories]=useState([])

    useEffect(()=>{
        async function getCategories(){
            try {
                const res=await api.get(`category/list?surveysession_id=${surveysession_id}`)
                console.log('response from category page:',res)
                setCategories(res.data)

            } catch (error) {
                console.log('error in getCategories',error)
                
            }
        }
    getCategories()

    },[])

  return (
   <div className='grid grid-cols-3 gap-3'>
    {categories.map(category=>
        (
            <CategoryCard key={category.id} category={category} surveysession_id={surveysession_id}/>
        )
    )}
   </div>
  )
}

export default Category