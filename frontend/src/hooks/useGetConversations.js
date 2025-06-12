const BASE_URL = "https://messenger-j1ha.onrender.com/api";

import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";

const useGetConversations = () =>{
    const[loading,setLoading]=useState(false);
    const[conversations,setConversations]=useState([]);

    useEffect(()=> {
        const getConversations= async() => {
            setLoading(true);
            try{
                const res= await fetch (`${BASE_URL}/users`);
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
