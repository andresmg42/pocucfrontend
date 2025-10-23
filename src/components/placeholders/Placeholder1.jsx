import React from 'react'

const Placeholder1 = ({page_name,plural_page_name,onButtonClick,Trigger}) => {

  return (
    <div className="w-full max-w-md">
    <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center shadow-sm">
        
        
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mb-6">
            
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M11.5 21h-5.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4" />
                <path d="M16 3v4" />
                <path d="M8 3v4" />
                <path d="M4 11h16" />
                <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                <path d="M20.2 20.2l1.8 1.8" />
            </svg>
        </div>

        
        <h3 className="text-2xl font-bold text-gray-800">{`${plural_page_name} no encotradas`}</h3>

        
        <p className="mt-2 text-gray-500 max-w-sm mx-auto">
            {`Parece que no hay ${plural_page_name} aqui todavia. Empieza creando una.`}
        </p>

        
        <div className="mt-8">
            <button 
            onClick={onButtonClick}
            
            type="button" className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200">
                
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                   <path d="M12 5l0 14"></path>
                   <path d="M5 12l14 0"></path>
                </svg>
                {`Crear una Nueva ${page_name}`}
            </button>
        </div>

    </div>
</div>
  )
}

export default Placeholder1