import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from 'react-hot-toast';

const BASE_URL = "https://messenger-backend-1-wfgx.onrender.com/api";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    const sendMessage = async (message) => {
        if (!selectedConversation) return;

        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/messages/send/${selectedConversation._id}`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ message })
            });

            const text = await res.text(); // fallback if not JSON

            if (!res.ok) {
                throw new Error(text || "Message send failed");
            }

            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                throw new Error("Invalid response from server");
            }

            setMessages([...messages, data]);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading };
};

export default useSendMessage;
