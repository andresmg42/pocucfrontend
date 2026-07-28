import { create } from "zustand";
import api from "../api/user.api";
import {
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase.config";
import { Header } from "@table-library/react-table-library";

const useAuthStore = create((set) => {
  const observeAuthState = () => {
    return onIdTokenChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();

          set({ token: token });

          const resback = await api.post("/observer/create/", {
            name: user.displayName,
            email: user.email,
          });
          localStorage.setItem("user_id", resback.data.user.id);

          const res_role = await api.get("/users/get_role_status");

          set({
            role: res_role?.data,
            userLogged: user,
            isLoading: false,
          });
        } catch (error) {
          console.log("Error fetching user role", error);
          set({
            userLogged: null,
            isLoading: false,
            role: {},
            token: null,
          });
        }
      } else {
        set({ userLogged: null, isLoading: false, role: {}, token: null });
      }
    });
  };

  return {
    observeAuthState,
    userLogged: null,
    isLoading: true,
    role: {},
    token: null,

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
        set({ userLogged: null, token: null, role: null, isLoading: false });
        localStorage.removeItem("user_id");
      } catch (error) {
        console.error("Error loggin out:", error);
      }
    },
  };
});

export default useAuthStore;
