import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const BASE_URL = "https://messenger-j1ha.onrender.com/api";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (username, password) => {
    const success = handleInputErrors({ username, password });
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // If you're using cookies/session
        body: JSON.stringify({ username, password }),
      });

      const text = await res.text(); // fallback if not JSON

      if (!res.ok) {
        throw new Error(text || "Login failed");
      }

      let data;
      try {
        data = JSON.parse(text); // only try JSON if valid
      } catch (err) {
        throw new Error("Invalid response from server");
      }

      toast.success("Logged in successfully!");
      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;

function handleInputErrors({ username, password }) {
  if (!username || !password) {
    toast.error("All fields are required");
    return false;
  }
  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }
  return true;
}
