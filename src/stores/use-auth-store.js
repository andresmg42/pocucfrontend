import { create } from "zustand";
import api from "../api/user.api";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase.config";
import { Header } from "@table-library/react-table-library";

const useAuthStore = create((set) => {
  const observeAuthState = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        set({ userLogged: user, isLoading: false });
        try {
          const token = await user.getIdToken();
          const res_role = await api.get("/users/get_role_status", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          set({ role: res_role?.data });
        } catch (error) {
          console.log("Error fetching user role", error);
          set({ role: null });
        }
      } else {
        set({ userLogged: null, isLoading: false });
      }
    });
  };

  observeAuthState();

  return {
    userLogged: null,
    isLoading: true,
    role: {},

    loginGooglePopUp: async () => {
      const provider = new GoogleAuthProvider();

      try {
        const res = await signInWithPopup(auth, provider);
        return res;
      } catch (error) {
        console.log("Error loggin in :", error);
      }
    },

    logout: async () => {
      try {
        await signOut(auth);
        set({ userLogged: null });
        localStorage.removeItem("user_id");
      } catch (error) {
        console.error("Error loggin out:", error);
      }
    },
  };
});

export default useAuthStore;
