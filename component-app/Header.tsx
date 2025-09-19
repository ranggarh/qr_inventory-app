import React from "react";
import { Box, HStack, Icon, Text, Pressable } from "@gluestack-ui/themed";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

interface CustomHeaderProps {
  title: string;
  onBack?: () => void; // opsional, jika ingin custom aksi back
}

const Header: React.FC<CustomHeaderProps> = ({ title, onBack }) => {
  const navigation = useNavigation();

  return (
    <HStack
      alignItems="center"
      justifyContent="center"
      px="$3"
      py="$3"
      bgColor="$white"
      position="relative"
      style={{
        shadowColor: "#000", // warna shadow
        shadowOffset: { width: 0, height: 2 }, // posisi shadow
        shadowOpacity: 0.1, // transparansi shadow
        shadowRadius: 3.5, // blur shadow
        elevation: 4, // Android
        zIndex: 10, // biar menumpuk di atas konten
      }}
    >
      <Pressable
        onPress={onBack ? onBack : () => navigation.goBack()}
        style={{
          position: "absolute",
          left: 12,
          zIndex: 1,
          padding: 4,
        }}
        hitSlop={10}
      >
        <Icon as={ArrowLeft} size="lg" color="$textDark900" />
      </Pressable>
      <Text
        fontWeight="$bold"
        fontSize="$lg"
        flex={1}
        textAlign="center"
        numberOfLines={1}
        color="$black"
      >
        {title}
      </Text>
      {/* Spacer kanan agar judul tetap di tengah */}
      <Box style={{ width: 36, position: "absolute", right: 12 }} />
    </HStack>
  );
};

export default Header;
