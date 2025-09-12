import React, { useEffect, useState } from 'react'
import api from '../../api/user.api'
import useAuthStore from '../../stores/use-auth-store'

const SessionList = ({survey_id}) => {

    const [sessions,setSessions]=useState([])
    const {userLogged}=useAuthStore();

    useEffect(()=>{
        async function getSession(){
          
          try {
            const res= await api.get(`surveysession/get_survey_session_by_id?survey_id=${survey_id}&email=${userLogged.email}`)
            console.log('esta es la respuesta en sessionlist',res)
            
        }
        catch (error){
            console.log('error in SessionList',error)
        }
        }
        getSession();
    },[])
  return (
    <div>


    </div>
  )
}

export default SessionList