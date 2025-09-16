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
import { StyleSheet, Dimensions} from "react-native";

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
  const [scannedData, setScannedData] = useState<string>("");

  // UI states
  const [loading, setLoading] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [itemDetail, setItemDetail] = useState<ItemDetail | null>(null);
  const [scanCount, setScanCount] = useState<number>(0);
  const [rawScanData, setRawScanData] = useState<ScannedItemData | null>(null);

  const handleBarCodeScanned = async ({
    type,
    data,
  }: BarcodeScanningResult): Promise<void> => {
    if (!isScanning) return;

    setIsScanning(false);
    setScannedData(data);
    setScanCount((prev) => prev + 1);

    // Process scanned data
    await processScannedData(data);
  };

  const processScannedData = async (data: string): Promise<void> => {
    setLoading(true);

    try {
      // Parse QR code data dari AddItemScreen
      let parsedData: ScannedItemData;

      try {
        parsedData = JSON.parse(data) as ScannedItemData;

        // Validasi struktur data QR
        if (!parsedData.id || !parsedData.nama || !parsedData.kategori) {
          throw new Error("Invalid QR format");
        }
      } catch (parseError) {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast nativeID={`toast-${id}`} action="error" variant="accent">
              <ToastTitle>Format QR Code tidak valid</ToastTitle>
            </Toast>
          ),
        });
        setIsScanning(true);
        return;
      }

      setRawScanData(parsedData);

      // TODO: Fetch item detail dari Firebase berdasarkan parsedData.id
      // const itemDetail = await fetchItemFromFirebase(parsedData.id);

      // Simulate API call untuk demo
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Replace dengan actual Firebase query
      // if (itemDetail) {
      //   setItemDetail(itemDetail);
      //   setShowResultModal(true);
      //   onScanSuccess?.(parsedData);
      // } else {
      //   // Item tidak ditemukan
      // }


      // Untuk demo, tampilkan data yang di-scan
      setShowResultModal(true);
      onScanSuccess?.(parsedData);

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="success" variant="accent">
            <ToastTitle>QR Code berhasil di-scan!</ToastTitle>
          </Toast>
        ),
      });
    } catch (error) {
      console.error("Error processing scanned data:", error);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="error" variant="accent">
            <ToastTitle>Gagal memproses QR Code</ToastTitle>
          </Toast>
        ),
      });
      setIsScanning(true);
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = (): void => {
    setIsScanning(true);
    setScannedData("");
    setShowResultModal(false);
    setItemDetail(null);
    setRawScanData(null);
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
          barcodeTypes: ["qr"], 
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
                  Scan QR Code
                </Text>
                <Text color="$white" fontSize="$sm" opacity={0.8}>
                  Arahkan kamera ke QR code barang
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
                ? "Memproses..."
                : isScanning
                ? "Memindai QR Code..."
                : "Scan berhasil!"}
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
              >
                <ButtonText color="$white">Flip</ButtonText>
              </Button>

              {loading ? (
                <HStack space="sm" alignItems="center">
                  <Spinner color="$white" />
                  <Text color="$white">Memproses...</Text>
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
              >
                <ButtonText color="$white">Tutup</ButtonText>
              </Button>
            </HStack>
          </Box>
        </Box>
      </CameraView>

      {/* Result Modal */}
      <Modal isOpen={showResultModal} onClose={() => setShowResultModal(false)}>
        <ModalBackdrop />
        <ModalContent maxWidth="90%" bg="$backgroundLight0">
          <ModalHeader
            borderBottomWidth="$1"
            borderBottomColor="$borderLight200"
          >
            <Heading size="lg" color="$textLight900">
              QR Code Hasil Scan
            </Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} color="$textLight500" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody pb="$4">
            {rawScanData && (
              <VStack space="md">
                <Card p="$4" bg="$backgroundLight50" borderRadius="$lg">
                  <VStack space="sm">
                    <HStack justifyContent="space-between">
                      <VStack space="xs" flex={1}>
                        <Heading size="md" color="$textLight900">
                          {rawScanData.nama}
                        </Heading>
                        <Text size="sm" color="$textLight600">
                          ID: {rawScanData.id}
                        </Text>
                        <Text size="sm" color="$textLight600">
                          Stok: {rawScanData.stok}
                        </Text>
                        <Text size="sm" color="$textLight600">
                          Harga: Rp {rawScanData.harga?.toLocaleString("id-ID")}
                        </Text>
                        <Text size="sm" color="$textLight600">
                          Kategori ID: {rawScanData.kategori}
                        </Text>
                      </VStack>
                      <Badge bg="$success500"   borderRadius="$md">
                        <BadgeText color="$white" fontSize="$xs">
                          VALID
                        </BadgeText>
                      </Badge>
                    </HStack>

                    <Text size="xs" color="$textLight500" mt="$2">
                      Di-scan pada:{" "}
                      {new Date(rawScanData.timestamp).toLocaleString("id-ID")}
                    </Text>
                  </VStack>
                </Card>

                <Card
                  p="$3"
                  bg="$info50"
                  borderRadius="$lg"
                  borderWidth="$1"
                  borderColor="$info200"
                >
                  <Text size="sm" color="$info700">
                    💡 Data QR berhasil di-scan!
                  </Text>
                </Card>

                <HStack space="md">
                  <Button
                    flex={1}
                    variant="outline"
                    onPress={resetScanner}
                    borderColor="$primary500"
                  >
                    <ButtonText color="$primary500">Scan Lagi</ButtonText>
                  </Button>
                  <Button
                    flex={1}
                    bg="$primary500"
                    onPress={() => {
                      // TODO: Navigate to item detail atau lakukan aksi lain
                      console.log("Action for item:", rawScanData);
                      setShowResultModal(false);
                    }}
                  >
                    <ButtonText color="$white">Lihat Detail</ButtonText>
                  </Button>
                </HStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
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
