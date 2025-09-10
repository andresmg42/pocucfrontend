import React, { useEffect, useState } from 'react'
import api from '../../api/user.api'

const SessionList = ({survey_id}) => {

    const [sessions,setSessions]=useState([])

    useEffect(()=>{
        try {
            res= api.get(`observer/sessions/?survey_id=${survey_id}`)
            console.log(res)
            
        }
        catch (error){
            console.log('error in SessionList',error)
        }
    },[])
  return (
    <div>


    </div>
  )
}

export default SessionList