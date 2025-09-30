import {create} from 'zustand'

import React from 'react'

const usePageStore=create((set)=>({
        addTrigger:true,
        setAddTrigger:(boolean)=>set({addTrigger:boolean}),
        addTriggerVisit:true,
        setAddTriggerVisit:(boolean)=>set({addTriggerVisit:boolean}),
        visitTrigger:true,
        setVisitTrigger:(boolean)=>set({visitTrigger:boolean}),
        editTrigger:false,
        setEditTrigger:(boolean)=>set({editTrigger:boolean}),
        session:null,
        setSession:(session)=>set({session:session}),
        update:false,
        setUpdate:(boolean)=>set({update:boolean}),
        visit:null,
        setVisit:(visit)=>set({visit:visit}),
        updateVisit:false,
        setUpdateVisit:(boolean)=>set({updateVisit:boolean})
        
    }));

export default usePageStore;