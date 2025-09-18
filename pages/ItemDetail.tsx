import React from "react";
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
} from "@gluestack-ui/themed";
import { ImageOff } from "lucide-react-native";
import { ScrollView } from "react-native";
import QRCode from "react-native-qrcode-svg";
import type { RootStackParamList } from "../types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

const ItemDetail = ({ route }: any) => {
  const { item } = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // QR value decode/encode
  let qrValue = "";
  try {
    qrValue = JSON.stringify(JSON.parse(item.barcodeImg));
  } catch (e) {
    qrValue = item.barcodeImg;
  }

  return (
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
        <Button onPress={() => navigation.navigate("EditItem", { item })}>
          <ButtonText>Edit Barang</ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
};

export default ItemDetail;
