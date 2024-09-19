import { useState} from "react"; 
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useLogout = () => {
  const[loading,setLoading] =useState(false);
  const{setAuthUser}= useAuthContext();
  const logout = async() =>{
    setLoading(true);
    try{
        const res=await fetch("/api/auth/logout",{
            method:"POST",
            headers:{"Content-Type":"application/json"}
       });
       if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'An unexpected error occurred');
        toast.error(errorData.error);
       }
        const data = await res.json();
        toast.success('Logged out successfully!');
        localStorage.removeItem("chat-user");
        setAuthUser(null);
    }
    catch(err){
        toast.error(err.message);
    }
    finally{
        setLoading(false);
    }
  }
  return {loading,logout};
}
export default useLogout;
