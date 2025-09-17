import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  Toast,
  ToastTitle,
  useToast,
  Card,
  Heading,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Icon,
  CloseIcon,
  Spinner,
  Badge,
  BadgeText,
} from "@gluestack-ui/themed";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { StyleSheet, Dimensions } from "react-native";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { query, orderByChild, equalTo } from "firebase/database";
import { db } from "../backend/conn/db";

// Types
interface ScannedItemData {
  id: number;
  nama: string;
  kategori: number;
  stok?: number;
  harga?: number;
  timestamp: string;
}

interface ItemDetail {
  id: number;
  namaBarang: string;
  stok: number;
  deskripsi: string;
  kategori: number;
  harga: number;
  gambar: string;
  barcodeImg: string;
  kodeBarang?: string;
  kategoriNama?: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface ScanQRScreenProps {
  onScanSuccess?: (data: ScannedItemData) => void;
  onClose?: () => void;
}

const ScanQRScreen: React.FC<ScanQRScreenProps> = ({
  onScanSuccess,
  onClose,
}) => {
  const toast = useToast();
  const cameraRef = useRef<CameraView>(null);

  // Camera states
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [isScanning, setIsScanning] = useState<boolean>(true);

  // UI states
  const [loading, setLoading] = useState<boolean>(false);
  const [scanCount, setScanCount] = useState<number>(0);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleBarCodeScanned = async ({ type, data }: BarcodeScanningResult) => {
    if (!isScanning) return;
    setIsScanning(false);
    setLoading(true);
    setScanCount((prev) => prev + 1);

    console.log("🔍 Scanning:", { type, data });

    try {
      const itemsRef = ref(db, "barang");

      // 1️⃣ QR Internal
      try {
        const parsed = JSON.parse(data);
        if (parsed && (parsed.id || parsed.nama)) {
          console.log("📱 QR Internal detected:", parsed);

          const allItemsSnapshot = await get(itemsRef);

          if (allItemsSnapshot.exists()) {
            const allItems = allItemsSnapshot.val();

            const foundItem = Object.values(allItems).find((item: any) => {
              if (item.barcodeImg) {
                try {
                  const qrData = JSON.parse(item.barcodeImg);
                  return (
                    (parsed.id && qrData.id === parsed.id) ||
                    (parsed.nama && qrData.nama === parsed.nama) ||
                    (parsed.nama &&
                      qrData.nama?.toLowerCase() === parsed.nama?.toLowerCase())
                  );
                } catch (e) {
                  return false;
                }
              }

              return (
                (parsed.id && item.id === parsed.id) ||
                (parsed.nama && item.namaBarang === parsed.nama) ||
                (parsed.nama &&
                  item.namaBarang?.toLowerCase() === parsed.nama?.toLowerCase())
              );
            });

            if (foundItem) {
              console.log("✅ QR Item found:", foundItem.namaBarang);

              // Simplified toast - no template literals in JSX
              try {
                toast.show({
                  placement: "top",
                  render: ({ id }) => (
                    <Toast
                      nativeID={String(id)}
                      action="success"
                      variant="accent"
                    >
                      <ToastTitle>Item QR ditemukan!</ToastTitle>
                    </Toast>
                  ),
                });
              } catch (toastError) {
                console.log("Toast error, continuing...");
              }

              navigation.navigate("ItemDetail", { item: foundItem });
              return;
            }
          }

          console.log("⚠️ QR valid but not in DB");

          try {
            toast.show({
              placement: "top",
              render: ({ id }) => (
                <Toast nativeID={String(id)} action="warning" variant="accent">
                  <ToastTitle>Item belum terdaftar</ToastTitle>
                </Toast>
              ),
            });
          } catch (toastError) {
            console.log("Toast error, continuing...");
          }

          navigation.navigate("AddItem", {
            kodeBarang: data,
            barcodeType: "qr",
            prefilledData: parsed,
          });
          return;
        }
      } catch (parseError) {
        console.log("📊 Not JSON QR, checking barcode...");
      }

      // 2️⃣ Barcode komersial
      console.log("🏷️ Searching by kodeBarang:", data);

      const allItemsSnapshot = await get(itemsRef);
      if (allItemsSnapshot.exists()) {
        const allItems = Object.values(allItemsSnapshot.val()) as any[];

        const foundByBarcode = allItems.find((item: any) => {
          return item.kodeBarang === data;
        });

        if (foundByBarcode) {
          console.log("✅ Barcode found:", foundByBarcode.namaBarang);

          // Simplified toast
          try {
            toast.show({
              placement: "top",
              render: ({ id }) => (
                <Toast nativeID={String(id)} action="success" variant="accent">
                  <ToastTitle>Barcode ditemukan!</ToastTitle>
                </Toast>
              ),
            });
          } catch (toastError) {
            console.log("Toast error, continuing...");
          }

          navigation.navigate("ItemDetail", { item: foundByBarcode });
          return;
        }

        // 3️⃣ Cek barcodeImg
        console.log("🔍 Checking barcodeImg...");

        const foundByQR = allItems.find((item: any) => {
          if (!item.barcodeImg) return false;

          try {
            const qrData = JSON.parse(item.barcodeImg);
            return (
              qrData.id?.toString() === data ||
              qrData.nama === data ||
              qrData.nama?.toLowerCase() === data.toLowerCase()
            );
          } catch {
            return item.barcodeImg === data;
          }
        });

        if (foundByQR) {
          console.log("✅ QR match found:", foundByQR.namaBarang);

          try {
            toast.show({
              placement: "top",
              render: ({ id }) => (
                <Toast nativeID={String(id)} action="success" variant="accent">
                  <ToastTitle>QR Code ditemukan!</ToastTitle>
                </Toast>
              ),
            });
          } catch (toastError) {
            console.log("Toast error, continuing...");
          }

          navigation.navigate("ItemDetail", { item: foundByQR });
          return;
        }
      }

      // 4️⃣ Not found
      console.log("❌ Not found, creating new");

      try {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast nativeID={String(id)} action="info" variant="accent">
              <ToastTitle>Item baru terdeteksi</ToastTitle>
            </Toast>
          ),
        });
      } catch (toastError) {
        console.log("Toast error, continuing...");
      }

      navigation.navigate("AddItem", {
        kodeBarang: data,
        barcodeType: type,
        prefilledData: null,
      });
    } catch (error) {
      console.error("❌ Scan error:", error);

      try {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast nativeID={String(id)} action="error" variant="accent">
              <ToastTitle>Gagal memproses scan</ToastTitle>
            </Toast>
          ),
        });
      } catch (toastError) {
        console.log("Toast error, continuing...");
      }

      setIsScanning(true);
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = (): void => {
    setIsScanning(true);
  };

  const toggleCameraFacing = (): void => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleClose = (): void => {
    onClose?.();
  };

  // Permission handling
  if (!permission) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        p="$4"
        bg="$backgroundLight0"
      >
        <Spinner size="large" />
        <Text mt="$4" color="$textLight700">
          Memuat kamera...
        </Text>
      </Box>
    );
  }

  if (!permission.granted) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        p="$4"
        bg="$backgroundLight0"
      >
        <VStack space="lg" alignItems="center">
          <Heading size="xl" textAlign="center" color="$textLight900">
            Izin Kamera Diperlukan
          </Heading>
          <Text textAlign="center" color="$textLight600" px="$4">
            Aplikasi membutuhkan akses kamera untuk memindai QR code barang
            inventory
          </Text>
          <Button onPress={requestPermission} size="lg" bg="$primary500">
            <ButtonText color="$white">Berikan Izin Kamera</ButtonText>
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="$black">
      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
        barcodeScannerSettings={{
          barcodeTypes: [
            "qr", // QR Code
            "ean13", // Barcode retail (13 digit, paling umum di Indonesia)
            "ean8", // Versi pendek EAN
            "upc_a", // Barcode retail versi Amerika
            "upc_e",
            "code128", // Dipakai di logistik / label
            "code39", // Alternatif barcode
          ],
        }}
      >
        {/* Overlay */}
        <Box style={styles.overlay}>
          {/* Header */}
          <Box style={styles.header} bg="rgba(0,0,0,0.6)">
            <HStack
              justifyContent="space-between"
              alignItems="center"
              p="$4"
              pt="$12"
            >
              <VStack>
                <Text color="$white" fontSize="$lg" fontWeight="$bold">
                  Scan QR/Barcode
                </Text>
                <Text color="$white" fontSize="$sm" opacity={0.8}>
                  {loading
                    ? "Memproses..."
                    : isScanning
                    ? "Arahkan ke kode yang akan di-scan"
                    : "Scan berhasil!"}
                </Text>
              </VStack>
              <Badge bg="$primary500" borderRadius="$full">
                <BadgeText color="$white" fontSize="$sm">
                  {scanCount}
                </BadgeText>
              </Badge>
            </HStack>
          </Box>

          {/* Scan Area */}
          <Box style={styles.scanArea}>
            <Box style={styles.scanFrame}>
              {/* Corner indicators */}
              <Box style={[styles.corner, styles.topLeft]} />
              <Box style={[styles.corner, styles.topRight]} />
              <Box style={[styles.corner, styles.bottomLeft]} />
              <Box style={[styles.corner, styles.bottomRight]} />

              {/* Scanning indicator */}
              {isScanning && <Box style={styles.scanLine} bg="$primary500" />}
            </Box>

            <Text
              color="$white"
              textAlign="center"
              mt="$6"
              px="$4"
              fontSize="$md"
            >
              {loading
                ? "Mencari di database..."
                : isScanning
                ? "Posisikan kode dalam frame"
                : "Berhasil di-scan!"}
            </Text>
          </Box>

          {/* Controls */}
          <Box style={styles.controls} bg="rgba(0,0,0,0.6)">
            <HStack
              justifyContent="space-around"
              alignItems="center"
              p="$4"
              pb="$8"
            >
              <Button
                variant="outline"
                onPress={toggleCameraFacing}
                borderColor="$white"
                disabled={loading}
              >
                <ButtonText color="$white">Flip</ButtonText>
              </Button>

              {loading ? (
                <HStack space="sm" alignItems="center">
                  <Spinner color="$white" size="small" />
                  <Text color="$white">Mencari...</Text>
                </HStack>
              ) : (
                <Button
                  bg="$primary500"
                  onPress={resetScanner}
                  disabled={isScanning}
                  opacity={isScanning ? 0.5 : 1}
                >
                  <ButtonText color="$white">Scan Lagi</ButtonText>
                </Button>
              )}

              <Button
                variant="outline"
                onPress={handleClose}
                borderColor="$white"
                disabled={loading}
              >
                <ButtonText color="$white">Tutup</ButtonText>
              </Button>
            </HStack>
          </Box>
        </Box>
      </CameraView>
    </Box>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  scanArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: "relative",
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 2,
    borderRadius: 12,
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#007AFF",
    borderWidth: 4,
  },
  topLeft: {
    top: -4,
    left: -4,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: -4,
    right: -4,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: -4,
    left: -4,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: -4,
    right: -4,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 12,
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    top: "50%",
    opacity: 0.8,
  },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ScanQRScreen;
