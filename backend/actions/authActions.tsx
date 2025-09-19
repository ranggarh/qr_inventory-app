import { ref, set } from "firebase/database";
import { db, auth } from "../../backend/conn/db";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    await AsyncStorage.setItem("user", JSON.stringify(res.user));
    return res.user;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const registerUser = async (email: string, password: string, nama: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    // Simpan ke realtime database di node "users"
    await set(ref(db, "users/" + res.user.uid), {
      uid: res.user.uid,
      email: email,
      nama: nama,
      createdAt: new Date().toISOString(),
    });

    await AsyncStorage.setItem("user", JSON.stringify(res.user));
    return res.user;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const logoutUser = async () => {
  await signOut(auth);
  await AsyncStorage.removeItem("user");
};

export const getStoredUser = async () => {
  const userData = await AsyncStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
};
