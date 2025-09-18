import { ref, push, set, get, child, update } from "firebase/database";
import { db } from "../conn/db";

export interface Barang {
  id?: string;
  namaBarang: string;
  stok: number;
  deskripsi: string;
  harga: number;
  kategori: string;
  timestamp: string;
  barcodeImg?: string;
  gambar?: string;
}

export const addItem = async (itemData: Omit<Barang, "id">) => {
  try {
    const newItemRef = push(ref(db, "barang"));
    await set(newItemRef, {
      ...itemData,
      id: newItemRef.key,
      timestamp: new Date().toISOString(),
    });
    return { success: true, id: newItemRef.key };
  } catch (error) {
    console.error("Gagal Menambahkan Barang:", error);
    return { success: false, error };
  }
};

export const getItems = async () => {
  try {
    const snapshot = await get(child(ref(db), "barang"));
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    } else {
      return [];
    }
  } catch (error) {
    console.error("Gagal Menampilkan Barang:", error);
    return [];
  }
};

export const getItemById = async (id: string): Promise<Barang | null> => {
  try {
    const snapshot = await get(child(ref(db), `barang/${id}`));
    if (snapshot.exists()) {
      const data = snapshot.val();

      // kalau ada barcodeImg, coba parse ke object biar bisa dipakai lagi
      if (data.barcodeImg) {
        try {
          const parsed = JSON.parse(data.barcodeImg);
          return {
            ...data,
            ...parsed,
          } as Barang;
        } catch (e) {
          console.warn("barcodeImg bukan JSON valid:", e);
        }
      }

      return data as Barang;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Gagal mengambil detail barang:", error);
    return null;
  }
};

export const updateItem = async (id: string, updatedData: Partial<Barang>) => {
  try {
    const itemRef = ref(db, `barang/${id}`);
    await update(itemRef, {
      ...updatedData,
      timestamp: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error("Gagal update barang:", error);
    return { success: false, error };
  }
};