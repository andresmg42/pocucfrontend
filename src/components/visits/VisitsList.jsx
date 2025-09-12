

const VisitsList = ({surveysession_id}) => {

    const [visits,setVisits]=useState([])
    
    const [loading,setLoading]=useState(true);

    const {userLogged}=useAuthStore();

    useEffect(()=>{
        async function getVisits(){

          try {
            const res= await api.get(`visit/sessionvisits?surveysession_id=${surveysession_id}`)
            console.log('esta es la respuesta en visit',res)
            setVisits(res.data)
            
           
            
        }
        catch (error){
            console.log('error in SessionList',error)
        }
        finally{
          setLoading(false)
        }
        }
        getVisits();
    },[userLogged])

    

    if (loading){
      return <div className="text-center p-10 text-white">Loading users...</div>;
    }

    const handleClickRow= (id)=>{
        console.log('id session:',id)


    }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Lista de Visitas
      </h1>
      {/* Wrapper for responsive table */}
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="py-3 px-6">ID</th>
              <th scope="col" className="py-3 px-6">Numero de Sesion</th>
              <th scope="col" className="py-3 px-6">Numemro de Visita</th>
              <th scope="col" className="py-3 px-6">Fecha de Visita</th>
              <th scope="col" className="py-3 px-6">Hora de Inicio</th>
              <th scope="col" className="py-3 px-6">Hora de Finalizacion</th>
              <th scope="col" className="py-3 px-6">Estado</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr 
              onClick={()=>handleClickRow(visit.id)}
              key={visit.id} className="bg-white border-b hover:bg-gray-100">
                {/* ID is bolded to make it stand out */}
                <th   scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                  {visit.id}
                </th>
                <td className="py-4 px-6">{visit.surveysession}</td>
                <td className="py-4 px-6">{visit.visit_number}</td>
                <td className="py-4 px-6">{visit.visit_date}</td>
                <td className="py-4 px-6">{visit.start_time}</td>
                <td className="py-4 px-6">{visit.end_time}</td>
                <td className="py-4 px-6">{visit.complete}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}

export default VisitsList;