import React from 'react'

const SurveyCardPlaceholder = () => {
  return (
    
    <div
  role="status" // Informs assistive tech this is a loading status
  className="
    flex 
    flex-col 
    overflow-hidden // Ensures content respects the rounded corners
    rounded-xl 
    bg-white 
    shadow-md 
    border
    border-transparent
    animate-pulse // The key animation class
  "
>
  {/* Image Placeholder */}
  <div className="h-48 w-full bg-slate-200"></div>

  {/* Content Section Placeholder */}
  <div className="flex flex-grow flex-col p-5">
    
    {/* Title Placeholder */}
    {/* Taller (h-6) and shorter (w-3/4) to mimic a title */}
    <div className="h-6 w-3/4 rounded bg-slate-200"></div>
    
    {/* Topic Placeholder */}
    <div className="mt-2 flex items-center gap-2">
      {/* Icon Placeholder */}
      <div className="h-4 w-4 rounded-sm bg-slate-200"></div>
      {/* Text Placeholder (short) */}
      <div className="h-4 w-1/3 rounded bg-slate-200"></div>
    </div>
    
    {/* Description Placeholder */}
    {/* We mimic 3 lines, with the last line being shorter */}
    <div className="mt-3 flex-grow space-y-2">
      <div className="h-4 w-full rounded bg-slate-200"></div>
      <div className="h-4 w-full rounded bg-slate-200"></div>
      <div className="h-4 w-5/6 rounded bg-slate-200"></div> {/* Last line is shorter */}
    </div>
  </div>
</div>
  
  )
}

export default SurveyCardPlaceholder