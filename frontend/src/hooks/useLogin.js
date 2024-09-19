import { useState } from "react";

import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useLogin= ()=>{
    const[loading,setLoading]=useState(false);
    const{setAuthUser}=useAuthContext();
    const login=async(username,password)=>{
        const success=handleInputErrors({username,password});
        if(!success) {
            return;
        }
        setLoading(true);
        try{
            const res=await fetch("/api/auth/login",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({username,password})
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'An unexpected error occurred');
                toast.error(errorData.error);
            }
            const data = await res.json();
            toast.success('Logged in successfully!');
            localStorage.setItem("chat-user",JSON.stringify(data));
            setAuthUser(data);
        }
        catch(err){
            toast.error(err.message);
        }
        finally{
            setLoading(false);
        }
    }
    return{loading,login};
}
export default useLogin;

function handleInputErrors({username,password}){
    if(!username || !password){
        toast.error('All fields are required');
        return false;
    }
    if(password.length<6){
        toast.error('password must be atleast 6 characters');
        return false;
    }
    return true;
}