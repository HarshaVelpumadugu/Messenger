import { useState, useEffect } from 'react';
import useConversation from '../zustand/useConversation';
import toast from 'react-hot-toast';

const BASE_URL = "https://messenger-backend-1-wfgx.onrender.com/api";

export const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/messages/${selectedConversation._id}`, {
          method: "GET",
          credentials: "include", // ✅ allow cookie
        });

        const text = await res.text(); // fallback to text to avoid parse error

        if (!res.ok) {
          throw new Error(text || "Failed to fetch messages");
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Invalid JSON response from server");
        }

        if (data.error) {
          throw new Error(data.error);
        }

        setMessages(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) {
      getMessages();
    }
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading };
};

export default useGetMessages;
