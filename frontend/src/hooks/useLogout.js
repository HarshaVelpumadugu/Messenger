import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

// ✅ Your backend URL
const BASE_URL = "https://messenger-j1ha.onrender.com/api";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ If you're using cookies for auth
      });

      // ✅ Use text fallback to avoid JSON parse errors
      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || "Logout failed");
      }

      toast.success("Logged out successfully!");
      localStorage.removeItem("chat-user");
      setAuthUser(null);
    } catch (err) {
      toast.error(err.message || "Logout error");
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};

export default useLogout;
