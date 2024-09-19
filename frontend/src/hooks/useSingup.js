import {useState} from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
const useSignup=() =>{
    const[loading,setLoading]=useState(false);
    const {setAuthUser}=useAuthContext();
    const signup= async({fullName,username,password,confirmPassword,gender})=> {
        const success=handleInputErrors({fullName,username,password,confirmPassword,gender})
        if(!success) {
            return;
        }
        setLoading(true);
        try{
            const res=await fetch("/api/auth/signup",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({fullName,username,password,confirmPassword,gender})
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'An unexpected error occurred');
                toast.error(errorData.error);
            }
            const data = await res.json();
            console.log(data);
            toast.success('Signup successful!');
            localStorage.setItem("chat-user",JSON.stringify(data))
            setAuthUser(data);
        }
        catch(err){
            toast.error(err.message);
        }
        finally{
            setLoading(false);
        }
    };
    return{loading,signup};
};

export default useSignup;

function handleInputErrors({fullName,username,password,confirmPassword,gender}){
    if(!fullName || !username || !password || !confirmPassword || !gender){
        toast.error('All fields are required');
        return false;
    }
    if(password !== confirmPassword){
        toast.error('passwords do not match');
        return false;
    }
    if(password.length<6){
        toast.error('password must be atleast 6 characters');
        return false;
    }
    return true;
}