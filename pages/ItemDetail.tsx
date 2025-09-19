import React, { useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Divider,
  Image,
  Card,
  Icon,
  Button,
  ButtonText,
  Modal,
  ModalBackdrop,
  ModalFooter,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Toast,
  ToastTitle,
  useToast,
} from "@gluestack-ui/themed";
import { ImageOff } from "lucide-react-native";
import { ScrollView } from "react-native";
import QRCode from "react-native-qrcode-svg";
import type { RootStackParamList } from "../types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { deleteItem } from "../backend/actions/ItemActions";
import Header from "@/component-app/Header";

const ItemDetail = ({ route }: any) => {
  const { item } = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const toast = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  // QR value decode/encode
  let qrValue = "";
  try {
    qrValue = JSON.stringify(JSON.parse(item.barcodeImg));
  } catch (e) {
    qrValue = item.barcodeImg;
  }

  const handleDelete = async () => {
    setLoadingDelete(true);
    const result = await deleteItem(item.id);
    setLoadingDelete(false);
    setShowDeleteModal(false);

    if (result.success) {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast
            nativeID={`toast-${id}`}
            action="success"
            variant="accent"
            sx={{ mt: 40 }}
          >
            <ToastTitle>Barang berhasil dihapus!</ToastTitle>
          </Toast>
        ),
      });
      navigation.navigate("MainTabs");
    } else {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast
            nativeID={`toast-${id}`}
            action="error"
            variant="accent"
            sx={{ mt: 40 }}
          >
            <ToastTitle>Gagal menghapus barang</ToastTitle>
          </Toast>
        ),
      });
    }
  };

  return (
    <>
      <Header title="Detail Barang" />
      <ScrollView
        style={{ flex: 1, backgroundColor: "white" }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <VStack space="lg">
          {/* QR Code */}
          <VStack alignItems="center" mt="$5" mb="$10">
            <Text fontWeight="$semibold" mb="$2">
              QR Code Barang
            </Text>
            <QRCode value={qrValue} size={180} />
          </VStack>
          {/* Gambar Produk */}
          <HStack>
            {item.gambar ? (
              <Image
                source={{ uri: item.gambar }}
                alt={item.namaBarang}
                style={{
                  width: "30%",
                  height: 100,
                  borderRadius: 16,
                }}
                resizeMode="cover"
              />
            ) : (
              <Box
                w="30%"
                h={100}
                borderRadius="$xl"
                bg="$backgroundLight100"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={ImageOff} size="xl" color="$textLight400" />
              </Box>
            )}

            {/* Info Barang */}
            <VStack space="sm" ml="$4" flex={1} justifyContent="center">
              <Text fontSize="$xl" fontWeight="$bold" color="$textDark900">
                {item.namaBarang}
              </Text>
              <Text fontSize="$lg" fontWeight="$bold" color="$primary500">
                Rp {item.harga.toLocaleString("id-ID")}
              </Text>
            </VStack>
          </HStack>

          <Divider my="$3" />

          {/* Detail Barang */}
          <Card p="$4" borderRadius="$xl" mb="$10" bg="$primary500">
            <VStack space="md">
              <HStack justifyContent="space-between">
                <Text fontWeight="$semibold" color="$white">
                  Stok :
                </Text>
                <Text color="$white">{item.stok} pcs</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text fontWeight="$semibold" color="$white">
                  Kategori :
                </Text>
                <Text color="$white">{item.kategori}</Text>
              </HStack>
              <VStack>
                <Text fontWeight="$semibold" color="$white" mb="$1">
                  Deskripsi :
                </Text>
                <Text color="$white">{item.deskripsi}</Text>
              </VStack>
            </VStack>
          </Card>
          <HStack space="md" justifyContent="center">
            <Button
              flex={1}
              onPress={() => navigation.navigate("EditItem", { item })}
            >
              <ButtonText>Edit Barang</ButtonText>
            </Button>
            <Button
              flex={1}
              onPress={() => setShowDeleteModal(true)}
              backgroundColor="$red600"
            >
              <ButtonText>Hapus Barang</ButtonText>
            </Button>
          </HStack>
        </VStack>
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        >
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Text fontWeight="$bold" fontSize="$lg">
                Konfirmasi Hapus
              </Text>
              <ModalCloseButton />
            </ModalHeader>
            <Divider my={"$2"} />
            <ModalBody>
              <Text>Apakah Anda yakin ingin menghapus barang ini?</Text>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                mr="$2"
                onPress={() => setShowDeleteModal(false)}
              >
                <ButtonText>Batal</ButtonText>
              </Button>
              <Button
                backgroundColor="$red600"
                onPress={handleDelete}
                disabled={loadingDelete}
              >
                <ButtonText>
                  {loadingDelete ? "Menghapus..." : "Hapus"}
                </ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </ScrollView>
    </>
  );
};

export default ItemDetail;
