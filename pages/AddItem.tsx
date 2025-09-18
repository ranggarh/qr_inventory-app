import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  Textarea,
  TextareaInput,
  Image,
  ScrollView,
  Toast,
  ToastTitle,
  useToast,
  Card,
  Heading,
  ChevronDownIcon,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Icon,
  CloseIcon,
} from "@gluestack-ui/themed";
import QRCode from "react-native-qrcode-svg";
import { launchImageLibrary } from "react-native-image-picker";
import { addItem } from "@/backend/actions/ItemActions";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type AddItemRouteProp = RouteProp<RootStackParamList, "AddItem">;

interface Barang {
  id: string;
  namaBarang: string;
  stok: number;
  deskripsi: string;
  kategori: string;
  harga: number;
  gambar: string;
  kodeBarang?: string; 
  kodeType?: string;    
  barcodeImg?: string;  
  timestamp: string;
}

interface KategoriBarang {
  id: number;
  nama: string;
  deskripsi: string;
}

const AddItemScreen: React.FC = () => {
  const toast = useToast();
  const route = useRoute<AddItemRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // ✅ Data hasil scan
  const scannedKode = route.params?.kodeBarang;
  const scannedType = route.params?.barcodeType;
  const prefilledData = route.params?.prefilledData; // Dari QR internal

  // Form states
  const [namaBarang, setNamaBarang] = useState<string>(prefilledData?.nama || "");
  const [stok, setStok] = useState<string>(prefilledData?.stok?.toString() || "");
  const [deskripsi, setDeskripsi] = useState<string>(prefilledData?.deskripsi || "");
  const [selectedKategori, setSelectedKategori] = useState<string>(prefilledData?.kategori?.toString() || "");
  const [harga, setHarga] = useState<string>(prefilledData?.harga?.toString() || "");
  const [gambar, setGambar] = useState<string>("");

  // UI states
  const [qrCodeData, setQrCodeData] = useState<string>("");
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [categories] = useState<KategoriBarang[]>([
    { id: 1, nama: "Akses Point", deskripsi: "Perangkat Elektronik" },
    { id: 2, nama: "Router", deskripsi: "Perangkat Jaringan" },
    { id: 3, nama: "Switch", deskripsi: "Perangkat Jaringan" },
    { id: 4, nama: "Kabel", deskripsi: "Accessories" },
  ]);

  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.8,
      },
      (response) => {
        if (response.assets && response.assets[0]) {
          setGambar(response.assets[0].uri || "");
        }
      }
    );
  };

  const generateQRCode = () => {
    if (!namaBarang || !stok || !selectedKategori || !harga) {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="error" variant="accent" sx={{ mt: 40, }}>
            <ToastTitle>Mohon lengkapi semua field yang wajib diisi</ToastTitle>
          </Toast>
        ),
      });
      return;
    }

    const tempId = Date.now();
    const qrData = JSON.stringify({
      id: tempId,
      nama: namaBarang,
      stok: parseInt(stok),
      deskripsi,
      harga: parseFloat(harga),
      kategori: parseInt(selectedKategori),
      timestamp: new Date().toISOString(),
    });

    setQrCodeData(qrData);
    setShowQRModal(true);
  };

  const handleSaveItem = async () => {
    if (!namaBarang || !stok || !selectedKategori || !harga) {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="error" variant="accent" sx={{ mt: 40, }}>
            <ToastTitle>Mohon lengkapi semua field yang wajib diisi</ToastTitle>
          </Toast>
        ),
      });
      return;
    }

    setLoading(true);

    try {
      const newItem: Omit<Barang, "id"> = {
        namaBarang,
        stok: parseInt(stok),
        deskripsi,
        kategori: selectedKategori, 
        harga: parseFloat(harga),
        gambar,
        timestamp: new Date().toISOString(),
      };

      // ✅ LOGIC: Tentukan cara menyimpan barcode/QR
      if (scannedKode && scannedType !== "qr") {
        // Dari barcode komersial (EAN, UPC, etc) → simpan sebagai kodeBarang
        newItem.kodeBarang = scannedKode;
        newItem.kodeType = scannedType;
        
        // ✅ PENTING: Tetap buat barcodeImg untuk konsistensi pencarian
        const qrDataForConsistency = JSON.stringify({
          id: Date.now(),
          nama: namaBarang,
          stok: parseInt(stok),
          deskripsi,
          harga: parseFloat(harga),
          kategori: parseInt(selectedKategori),
          timestamp: new Date().toISOString(),
        });
        newItem.barcodeImg = qrDataForConsistency;
        
      } else if (scannedKode && scannedType === "qr") {
        // Dari QR internal → gunakan data yang sudah di-scan
        newItem.barcodeImg = scannedKode;
        
      } else {
        // Input manual → gunakan QR yang di-generate
        newItem.barcodeImg = qrCodeData;
      }

      console.log("💾 Saving item:", newItem);

      const result = await addItem(newItem);

      if (result.success) {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast nativeID={`toast-${id}`} action="success" variant="accent" sx={{ mt: 40, }}>
              <ToastTitle>Item berhasil disimpan!</ToastTitle>
            </Toast>
          ),
        });
        navigation.navigate("Home");
        resetForm();
        setShowQRModal(false);
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error("❌ Save error:", error);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="error" variant="accent" sx={{ mt: 40, }}>
            <ToastTitle>Gagal menyimpan item</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNamaBarang("");
    setStok("");
    setDeskripsi("");
    setSelectedKategori("");
    setHarga("");
    setGambar("");
    setQrCodeData("");
  };

  const formatRupiah = (value: string) => {
    const number = value.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(parseInt(number) || 0);
  };

  const handleHargaChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setHarga(numericValue);
  };

  return (
    <ScrollView flex={1} backgroundColor="$backgroundLight0">
      <Box flex={1} p="$4">
        <VStack space="lg">
          <Heading size="xl" color="$textLight900">
            Tambah Item Baru
          </Heading>

          {/* ✅ Info scan result */}
          {scannedKode && (
            <Card p="$3" backgroundColor="$backgroundLight50">
              <VStack space="xs">
                <Text size="sm" color="$textLight700">
                  {scannedType === "qr" ? "QR Code" : "Barcode"} terdeteksi:
                </Text>
                <Text fontWeight="$bold" size="md" numberOfLines={2}>
                  {scannedKode}
                </Text>
                <Text size="xs" color="$textLight500">
                  Type: {scannedType}
                </Text>
              </VStack>
            </Card>
          )}

          {/* ✅ Prefilled data info */}
          {prefilledData && (
            <Card p="$3" backgroundColor="$success50" borderColor="$success200" borderWidth="$1">
              <VStack space="xs">
                <Text size="sm" color="$success700" fontWeight="$medium">
                  ✅ Data dari QR berhasil dimuat:
                </Text>
                <Text size="xs" color="$success600">
                  {prefilledData.nama} - Stok: {prefilledData.stok} - Rp {prefilledData.harga?.toLocaleString('id-ID')}
                </Text>
              </VStack>
            </Card>
          )}

          {/* Form Fields */}
          <VStack space="md">
            {/* Nama Barang */}
            <VStack space="xs">
              <Text size="sm" fontWeight="$medium" color="$textLight700">
                Nama Barang *
              </Text>
              <Input variant="outline" size="md">
                <InputField
                  placeholder="Masukkan nama barang"
                  value={namaBarang}
                  onChangeText={setNamaBarang}
                />
              </Input>
            </VStack>

            {/* Kategori */}
            <VStack space="xs">
              <Text size="sm" fontWeight="$medium" color="$textLight700">
                Kategori *
              </Text>
              <Select
                selectedValue={selectedKategori}
                onValueChange={setSelectedKategori}
              >
                <SelectTrigger variant="outline" size="md">
                  <SelectInput placeholder="Pilih kategori" />
                  <SelectIcon>
                    <Icon as={ChevronDownIcon} />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {categories.map((kategori) => (
                      <SelectItem
                        key={kategori.id}
                        label={kategori.nama}
                        value={kategori.id.toString()}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </VStack>

            {/* Stok dan Harga */}
            <HStack space="md">
              <VStack space="xs" flex={1}>
                <Text size="sm" fontWeight="$medium" color="$textLight700">
                  Stok *
                </Text>
                <Input variant="outline" size="md">
                  <InputField
                    placeholder="0"
                    value={stok}
                    onChangeText={setStok}
                    keyboardType="numeric"
                  />
                </Input>
              </VStack>

              <VStack space="xs" flex={1}>
                <Text size="sm" fontWeight="$medium" color="$textLight700">
                  Harga *
                </Text>
                <Input variant="outline" size="md">
                  <InputField
                    placeholder="0"
                    value={harga ? `Rp ${formatRupiah(harga)}` : ""}
                    onChangeText={handleHargaChange}
                    keyboardType="numeric"
                  />
                </Input>
              </VStack>
            </HStack>

            {/* Deskripsi */}
            <VStack space="xs">
              <Text size="sm" fontWeight="$medium" color="$textLight700">
                Deskripsi
              </Text>
              <Textarea size="md">
                <TextareaInput
                  placeholder="Masukkan deskripsi barang (opsional)"
                  value={deskripsi}
                  onChangeText={setDeskripsi}
                />
              </Textarea>
            </VStack>

            {/* Gambar */}
            <VStack space="xs">
              <Text size="sm" fontWeight="$medium" color="$textLight700">
                Gambar Barang
              </Text>
              <Button variant="outline" onPress={handleImagePicker}>
                <ButtonText>Pilih Gambar</ButtonText>
              </Button>
              {gambar && (
                <Box mt="$2">
                  <Image
                    source={{ uri: gambar }}
                    alt="Preview"
                    width={100}
                    height={100}
                  />
                </Box>
              )}
            </VStack>
          </VStack>

          {/* Action Buttons */}
          {!scannedKode ? (
            // ✅ Manual input → Generate QR dulu
            <Button
              size="lg"
              onPress={generateQRCode}
              backgroundColor="$primary500"
              mt="$4"
              mb={100}
            >
              <ButtonText>Generate QR Code & Preview</ButtonText>
            </Button>
          ) : (
            // ✅ Dari scan → Langsung simpan
            <Button
              size="lg"
              onPress={handleSaveItem}
              backgroundColor="$success500"
              mt="$4"
              mb={100}
              disabled={loading}
            >
              <ButtonText>
                {loading ? "Menyimpan..." : "Simpan Item"}
              </ButtonText>
            </Button>
          )}
        </VStack>
      </Box>

      {/* QR Code Modal (khusus manual) */}
      <Modal isOpen={showQRModal} onClose={() => setShowQRModal(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Preview QR Code</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody pb="$4">
            <VStack space="lg" alignItems="center">
              {/* Preview Barang */}
              <Card p="$4" backgroundColor="$backgroundLight50" width="100%">
                <VStack space="sm">
                  <Text fontWeight="$bold" size="lg">
                    {namaBarang}
                  </Text>
                  <HStack justifyContent="space-between">
                    <Text size="sm">Stok: {stok}</Text>
                    <Text size="sm" fontWeight="$medium">
                      Rp {formatRupiah(harga)}
                    </Text>
                  </HStack>
                  {deskripsi && (
                    <Text size="sm" color="$textLight600">
                      {deskripsi}
                    </Text>
                  )}
                </VStack>
              </Card>

              {/* QR Code */}
              {qrCodeData && (
                <VStack space="sm" alignItems="center">
                  <Text fontWeight="$medium">QR Code:</Text>
                  <Box p="$4" backgroundColor="$white" borderRadius="$md">
                    <QRCode
                      value={qrCodeData}
                      size={150}
                      color="black"
                      backgroundColor="white"
                    />
                  </Box>
                </VStack>
              )}

              {/* Action Buttons */}
              <HStack space="md" width="100%">
                <Button
                  flex={1}
                  variant="outline"
                  onPress={() => setShowQRModal(false)}
                >
                  <ButtonText>Batal</ButtonText>
                </Button>
                <Button
                  flex={1}
                  backgroundColor="$success500"
                  onPress={handleSaveItem}
                  disabled={loading}
                >
                  <ButtonText>
                    {loading ? "Menyimpan..." : "Simpan Item"}
                  </ButtonText>
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </ScrollView>
  );
};

export default AddItemScreen;