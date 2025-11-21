import { useNavigate } from "react-router"

const SurveyCard = ({survey}) => {

  const navigate=useNavigate();
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        navigate(`surveysession/${survey.id}`);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          navigate(`surveysession/${survey.id}`);
        }
      }}
      className={
        "flex flex-col h-full w-full overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1.5 border border-transparent hover:border-indigo-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      }
    >
  {/* Image Section with Placeholder Fallback */}
      {survey.image_url ? (
        <img
          src={survey.image_url}
          alt={survey.name}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-slate-200">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  )}

  {/* Content Section */}
  <div className="flex flex-1 flex-col p-5">
    <h2 className="text-lg font-bold uppercase tracking-tight text-slate-800">
      {survey.name}
    </h2>
    
    <div className="mt-2 text-sm text-slate-500 flex items-center gap-2">
      {/* Icon for Topic */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" />
      </svg>
      <span>Tema: {survey.topic}</span>
    </div>
    
    {/* Truncate long descriptions to keep card heights consistent */}
    <p className="mt-3 flex-grow text-slate-600 line-clamp-3">
      {survey.description}
    </p>
  </div>
</div>
  )
}

export default SurveyCard