import React from "react";
import { View, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";

const ItemDetail = ({ route }: any) => {
  const { item } = route.params;

  // Pastikan QR valuenya benar
  let qrValue = "";
  try {
    qrValue = JSON.stringify(JSON.parse(item.barcodeImg));
  } catch (e) {
    qrValue = item.barcodeImg;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        {item.namaBarang}
      </Text>
      <Text>Harga: Rp {item.harga}</Text>
      <Text>Stok: {item.stok}</Text>
      <Text>Deskripsi: {item.deskripsi}</Text>

      <View style={{ marginTop: 20, alignItems: "center" }}>
        <QRCode value={qrValue} size={150} />
      </View>
    </View>
  );
};

export default ItemDetail;
