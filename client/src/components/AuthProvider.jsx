import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { setAuthToken } from "@/lib/api";

export default function AuthProvider({ children }) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    async function updateToken() {
      if (!isSignedIn) {
        setAuthToken(null);
        return;
      }

      const token = await getToken();

      setAuthToken(token);
    }

    updateToken();
  }, [isSignedIn, getToken]);

  return children;
}