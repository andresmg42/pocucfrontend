import { create } from "zustand";
import {  onAuthStateChanged,
    signInWithPopup,
    signOut,
    GoogleAuthProvider} from "firebase/auth";
import { auth } from "../../firebase.config";

const useAuthStore = create((set) => {
  const observeAuthState = () => {
    onAuthStateChanged(auth, (user) => {
      user ? set({ userLogged: user }) : set({ userLogged: null });
    });
  };

  observeAuthState();

  return {
    userLogged: null,

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
        localStorage.removeItem('user_id')
      } catch (error) {
        console.error("Error loggin out:", error);
      }
    },

  };
});

export default useAuthStore;
