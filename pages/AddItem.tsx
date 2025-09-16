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

// Types
interface Barang {
  id: number;
  namaBarang: string;
  stok: number;
  deskripsi: string;
  kategori: number;
  harga: number;
  gambar: string;
  barcodeImg: string;
}

interface KategoriBarang {
  id: number;
  nama: string;
  deskripsi: string;
}

const AddItemScreen: React.FC = () => {
  const toast = useToast();

  // Form states
  const [namaBarang, setNamaBarang] = useState<string>("");
  const [stok, setStok] = useState<string>("");
  const [deskripsi, setDeskripsi] = useState<string>("");
  const [selectedKategori, setSelectedKategori] = useState<string>("");
  const [harga, setHarga] = useState<string>("");
  const [gambar, setGambar] = useState<string>("");

  // UI states
  const [qrCodeData, setQrCodeData] = useState<string>("");
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Sample categories (nanti diganti dengan data dari Firebase)
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
          <Toast nativeID={`toast-${id}`} action="error" variant="accent">
            <ToastTitle>Mohon lengkapi semua field yang wajib diisi</ToastTitle>
          </Toast>
        ),
      });
      return;
    }

    // Generate temporary ID for preview
    const tempId = Date.now();

    const itemData: Barang = {
      id: tempId,
      namaBarang,
      stok: parseInt(stok),
      deskripsi,
      kategori: parseInt(selectedKategori),
      harga: parseFloat(harga),
      gambar,
      barcodeImg: "",
    };

    // Create QR code data (bisa JSON atau format lain sesuai kebutuhan)
    const qrData = JSON.stringify({
      id: itemData.id,
      nama: itemData.namaBarang,
      stok: itemData.stok,
      deskripsi: itemData.deskripsi,
      harga: itemData.harga,
      kategori: itemData.kategori,
      timestamp: new Date().toISOString(),
    });

    setQrCodeData(qrData);
    setShowQRModal(true);
  };

  const handleSaveItem = async () => {
    setLoading(true);

    try {
      const newItem = {
        namaBarang,
        stok: parseInt(stok),
        deskripsi,
        kategori: selectedKategori,
        harga: parseFloat(harga),
        gambar,
        barcodeImg: qrCodeData, 
        timestamp: new Date().toISOString(),
      };

      const result = await addItem(newItem);

      if (result.success) {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast nativeID={`toast-${id}`} action="success" variant="accent">
              <ToastTitle>Item berhasil disimpan!</ToastTitle>
            </Toast>
          ),
        });
        resetForm();
        setShowQRModal(false);
      } else {
        throw result.error;
      }
    } catch (error) {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="error" variant="accent">
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

          {/* Generate QR Button */}
          <Button
            size="lg"
            onPress={generateQRCode}
            backgroundColor="$primary500"
            mt="$4"
          >
            <ButtonText>Generate QR Code & Preview</ButtonText>
          </Button>
        </VStack>
      </Box>

      {/* QR Code Modal */}
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
              {/* Item Preview */}
              <Card p="$4" backgroundColor="$backgroundLight50" width="100%">
                <VStack space="sm">
                  <Text fontWeight="$bold" size="lg">
                    {namaBarang}
                  </Text>
                  <Text size="sm" color="$textLight600">
                    Kategori:{" "}
                    {
                      categories.find(
                        (k) => k.id.toString() === selectedKategori
                      )?.nama
                    }
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
