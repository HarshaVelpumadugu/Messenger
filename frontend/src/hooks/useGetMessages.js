import {useState,useEffect} from 'react'
import useConversation from '../zustand/useConversation';
import toast from 'react-hot-toast';

export const useGetMessages = () => {
  const [loading,setLoading]=useState(false);
  const {messages,setMessages,selectedConversation}=useConversation();
  useEffect(()=>{
    const getMessages=async()=>{
        setLoading(true);
        try{
            const res= await fetch(`/api/messages/${selectedConversation._id}`);
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'An unexpected error occurred');
                toast.error(errorData.error);
            }
            const data=await res.json();
            if(data.error){
                throw new Error(data.error);
            }
            setMessages(data);
        }
        catch(err){
            toast.error(err.message);
        }
        finally{
            setLoading(false);
        }
    }
    if(selectedConversation?._id) {
        getMessages();
    }
  },[selectedConversation._id,setMessages])
  return {messages,loading};
}
export default useGetMessages;