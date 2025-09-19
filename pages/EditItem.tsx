import React, { useState } from "react";
import {
  Box,
  VStack,
  Input,
  InputField,
  Button,
  ButtonText,
  Textarea,
  TextareaInput,
  ScrollView,
  Text,
  Toast,
  ToastTitle,
  useToast,
} from "@gluestack-ui/themed";
import { updateItem } from "../backend/actions/ItemActions";
import Header from "@/component-app/Header";

const EditItemScreen = ({ route, navigation }: any) => {
  const { item } = route.params;

  const [namaBarang, setNamaBarang] = useState(item.namaBarang);
  const [harga, setHarga] = useState(String(item.harga));
  const [stok, setStok] = useState(String(item.stok));
  const [kategori, setKategori] = useState(item.kategori);
  const [deskripsi, setDeskripsi] = useState(item.deskripsi);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!namaBarang || !harga || !stok || !kategori) {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast
            nativeID={`toast-${id}`}
            action="error"
            variant="accent"
            sx={{ mt: 40 }}
          >
            <ToastTitle>Mohon lengkapi semua field yang wajib</ToastTitle>
          </Toast>
        ),
      });
      return;
    }

    setLoading(true);

    try {
      const result = await updateItem(item.id, {
        namaBarang,
        harga: Number(harga),
        stok: Number(stok),
        kategori: String(kategori), // Pastikan kategori berupa string
        deskripsi,
        gambar: item.gambar || "", // Pertahankan gambar yang ada
        barcodeImg: item.barcodeImg || "", // Pertahankan barcode yang ada
      });

      if (result.success) {
        toast.show({
          placement: "top",

          render: ({ id }) => (
            <Toast
              nativeID={`toast-${id}`}
              action="success"
              variant="accent"
              sx={{
                mt: 40,
              }}
            >
              <ToastTitle>Perubahan berhasil disimpan!</ToastTitle>
            </Toast>
          ),
        });
        navigation.navigate("MainTabs");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Update gagal:", error);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast
            nativeID={`toast-${id}`}
            action="error"
            variant="accent"
            sx={{ mt: 40 }}
          >
            <ToastTitle>Gagal menyimpan perubahan</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Edit Barang" />
      <ScrollView style={{ flex: 1, padding: 16 }} bgColor="$white">
        <VStack space="md">
          <Box>
            <Text size="sm" fontWeight="$medium" color="$textLight700">
              Nama Barang
            </Text>
            <Input>
              <InputField value={namaBarang} onChangeText={setNamaBarang} />
            </Input>
          </Box>

          <Box>
            <Text size="sm" fontWeight="$medium" color="$textLight700">
              Harga
            </Text>
            <Input>
              <InputField
                value={harga}
                keyboardType="numeric"
                onChangeText={setHarga}
              />
            </Input>
          </Box>

          <Box>
            <Text size="sm" fontWeight="$medium" color="$textLight700">
              Stok
            </Text>
            <Input>
              <InputField
                value={stok}
                keyboardType="numeric"
                onChangeText={setStok}
              />
            </Input>
          </Box>

          <Box>
            <Text size="sm" fontWeight="$medium" color="$textLight700">
              Kategori
            </Text>
            <Input>
              <InputField value={kategori} onChangeText={setKategori} />
            </Input>
          </Box>

          <Box>
            <Text size="sm" fontWeight="$medium" color="$textLight700">
              Deskripsi
            </Text>
            <Textarea>
              <TextareaInput
                value={deskripsi}
                onChangeText={setDeskripsi}
                multiline
              />
            </Textarea>
          </Box>

          <Button
            onPress={handleSave}
            disabled={loading}
            backgroundColor="$success500"
          >
            <ButtonText>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </>
  );
};

export default EditItemScreen;
