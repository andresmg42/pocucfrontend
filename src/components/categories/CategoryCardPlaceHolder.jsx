import React from 'react'

const CategoryCardPlaceHolder = () => {
  return (
    <div
  role="status"
  className="
    flex 
    flex-col 
    overflow-hidden 
    rounded-xl 
    bg-white 
    shadow-md 
    border
    border-transparent
    animate-pulse
  "
>
  {/* Image Placeholder */}
  <div className="h-48 w-full bg-slate-200"></div>

  {/* Content Section Placeholder */}
  {/* The 'flex-grow' and 'p-5' are crucial to match the original */}
  <div className="flex flex-grow flex-col p-5">
    
    {/* Title Placeholder */}
    <div className="h-6 w-3/4 rounded bg-slate-200"></div>

    {/* This wrapper pushes the button to the bottom */}
    {/* Replicates 'mt-auto pt-5' from your original card */}
    <div className="mt-auto pt-5">
      
      {/* Button Placeholder */}
      {/* 'h-10' mimics the 'py-2.5' + text height of your button */}
      <div className="h-10 w-full rounded-lg bg-slate-200"></div>
    
    </div>
  </div>
</div>
  )
}

export default CategoryCardPlaceHolder