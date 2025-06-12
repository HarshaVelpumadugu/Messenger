import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const BASE_URL = "https://messenger-j1ha.onrender.com/api";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/users`);
        const contentType = res.headers.get("content-type");

        if (!res.ok) {
          throw new Error("Server responded with an error");
        }

        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Expected JSON but got HTML or something else");
        }

        const data = await res.json();

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
