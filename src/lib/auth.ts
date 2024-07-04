import { auth, provider } from "@/firebase";
import { signInWithPopup, type User } from "firebase/auth";

export const getUser = async (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubsribe = auth.onAuthStateChanged(
      (user) => {
        resolve(user);
        unsubsribe();
      },
      (error) => {
        reject(error);
        unsubsribe();
      },
    );
  });
};

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return user;
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.log(error);
  }
};
