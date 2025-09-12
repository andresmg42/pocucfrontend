import {create} from 'zustand'

import React from 'react'

const usePageStore=create((set)=>({
        addTrigger:true,
        setAddTrigger:(boolean)=>set({addTrigger:boolean}),
        addTriggerVisit:true,
        setAddTriggerVisit:(boolean)=>set({addTriggerVisit:boolean}),
    }));

export default usePageStore;