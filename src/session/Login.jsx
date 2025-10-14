import useAuthStore from "../stores/use-auth-store";
import api from "../api/user.api";
import { useNavigate } from "react-router";

function Login() {

const {
  loginGooglePopUp,
  userLogged
}=useAuthStore();

const navigate=useNavigate();

const handleGoogleLogin=async ()=>{
  try{
    const res=await loginGooglePopUp();
    console.log('this is the user loggin',res.user)
    
    if (res.user){

      
       const {displayName,email}=res.user
       const resback= await api.post('/observer/create/',{name:displayName,email:email})
       localStorage.setItem('user_id',resback.data.user.id)
       navigate('/')
    }
    else{
      console.log('the user is not loged')
    }    
   
  }

  catch(error){

  console.log(error)
  
}
} 



  
  console.log("Home print");
  return (
    <div className="flex items-center justify-center">
  {/* The container remains transparent, only the content inside is visible */}
  <div className="w-[400px] p-8">
    
    <h2 className="text-2xl font-bold tracking-tight text-slate-800 text-center mb-6">
      Iniciar Sesión
    </h2>

    <button
      type="button"
      title="Iniciar sesión con Google"
      onClick={handleGoogleLogin}
      className="
        group
        flex
        w-full
        items-center
        justify-center
        gap-3
        rounded-lg
        bg-white
        px-6
        py-3
        text-base
        font-semibold
        text-slate-700
        shadow-md
        transition-all
        duration-300
        ease-in-out
        hover:shadow-lg
        hover:-translate-y-0.5
        focus:outline-none
        focus:ring-2
        focus:ring-slate-400
        focus:ring-offset-2
      "
    >
      {/* The icon now has a subtle grow animation on hover */}
      <img 
        src="/logo/google.svg" 
        alt="Google" 
        className="
          h-6 
          w-6 
          transition-transform 
          duration-300 
          group-hover:scale-110
        " 
      />
      <span>Iniciar sesión con Google</span>
    </button>
  </div>
</div>
  );
}

export default Login;