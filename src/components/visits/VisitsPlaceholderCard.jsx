import React from 'react'

const VisitsPlaceholderCard = () => {
  return (
    <div
  role="status"
  className="
    flex 
    flex-col 
    space-y-4     
    rounded-xl 
    bg-white 
    p-5            
    shadow-md 
    animate-pulse  
    w-[40vh]
    "
    
>
  {/* Main Content Area Placeholder */}
  <div className="flex-grow">
    
    {/* Header: Title and Badge */}
    <div className="flex items-center justify-between">
      {/* Title Placeholder */}
      <div className="h-6 w-1/2 rounded bg-slate-200"></div>
      {/* Badge Placeholder */}
      <div className="h-5 w-20 rounded-full bg-slate-200"></div>
    </div>

    {/* Info Block Placeholder */}
    <div className="mt-2 space-y-2">
      
      {/* Line 1 Placeholder (Zona) */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-sm bg-slate-200"></div>
        <div className="h-4 w-1/2 rounded bg-slate-200"></div>
      </div>
      
      {/* Line 2 Placeholder (Fecha Inicio) */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-sm bg-slate-200"></div>
        <div className="h-4 w-3/4 rounded bg-slate-200"></div>
      </div>
      
      {/* Line 3 Placeholder (Fecha Finalización) */}
      {/* We include this to match the maximum possible height */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-sm bg-slate-200"></div>
        <div className="h-4 w-3/4 rounded bg-slate-200"></div>
      </div>

      {/* Line 4 Placeholder (URL) */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-sm bg-slate-200"></div>
        <div className="h-4 w-full rounded bg-slate-200"></div>
      </div>
    </div>
  </div>

  {/* Button Bar Placeholder */}
  {/* The 'mt-auto' and 'pt-4' classes are crucial to match the original layout */}
  <div className="mt-auto flex items-center justify-end gap-3 pt-4">
    <div className="h-9 w-9 rounded-full bg-slate-200"></div>
    <div className="h-9 w-9 rounded-full bg-slate-200"></div>
    
  </div>
</div>
  )
}

export default VisitsPlaceholderCard