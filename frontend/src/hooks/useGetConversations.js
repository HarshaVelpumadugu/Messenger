import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const BASE_URL = "https://messenger-backend-1-wfgx.onrender.com/api";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/users`, {
          method: "GET",
          credentials: "include",
        });

        const text = await res.text();

        if (!res.ok) {
          throw new Error(text || "Failed to fetch conversations");
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

        setConversations(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, conversations };
};

export default useGetConversations;
