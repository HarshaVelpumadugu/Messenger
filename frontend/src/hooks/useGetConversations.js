import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";

const BASE_URL = "https://messenger-backend-1-wfgx.onrender.com/api";
const useGetConversations = () =>{
    const[loading,setLoading]=useState(false);
    const[conversations,setConversations]=useState([]);

    useEffect(()=> {
        const getConversations= async() => {
            setLoading(true);
            try{
                const res= await fetch ('/users');
                const data= await res.json();
                if(data.error){
                    throw new Error(data.error);
                }
                setConversations(data);
            }
            catch(err){
                toast.error(err.message);
            }
            finally{
                setLoading(false);
            }
        }
        getConversations();
    },[]);
    return {loading,conversations};
};

export default useGetConversations;
