import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  HStack,
  VStack,
  Icon,
  ScrollView,
  Pressable,
  Image,
  Divider,
  Spinner,
} from "@gluestack-ui/themed";
import { ChevronRight, ImageOff } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { getItems, Barang } from "@/backend/actions/ItemActions";

// Data kategori
const categories = [
  { id: "all", name: "Semua", color: "$primary500" },
  { id: "laptop", name: "Laptop", color: "$primary500" },
  { id: "hp", name: "HP", color: "$primary500" },
  { id: "mouse", name: "Mouse", color: "$primary500" },
  { id: "printer", name: "Printer", color: "$primary500" },
];

const ListItem = () => {
  const [items, setItems] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Fetch data dari Firebase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getItems();
        setItems(data as Barang[]);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter item sesuai kategori
  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.kategori === selectedCategory);

  // Ambil maksimal 5 item
  const displayedItems = filteredItems.slice(0, 5);

  // Function untuk handle navigation ke detail
  const handleItemPress = (item: Barang) => {
    navigation.navigate("ItemDetail", { item });
  };

  // Function untuk navigasi ke tab barang
  const handleViewAllPress = () => {
    navigation.navigate("MainTabs", { activeTab: "items" });
  };

  return (
    <Box mb="$6">
      <HStack justifyContent="space-between" alignItems="center" mb="$2">
        <Text fontWeight="$bold" size="lg" color="$textDark900">
          Daftar Barang
        </Text>
        {filteredItems.length > 5 && (
          <Pressable onPress={handleViewAllPress}>
            <Text size="sm" color="$primary500" fontWeight="$semibold">
              Lihat Semua
            </Text>
          </Pressable>
        )}
      </HStack>

      {/* Kategori horizontal */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} mb="$4">
        <HStack space="md">
          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              mr="$2"
            >
              <VStack
                alignItems="center"
                px="$3"
                py="$2"
                bg={selectedCategory === cat.id ? cat.color : "$white"}
                borderRadius="$lg"
                shadowColor="$black"
                shadowOffset={{ width: 0, height: 1 }}
                shadowOpacity={0.05}
                shadowRadius={1}
                elevation={1}
                style={{
                  minWidth: 70,
                }}
              >
                <Text
                  size="xs"
                  color={
                    selectedCategory === cat.id ? "$white" : "$textDark900"
                  }
                  fontWeight={selectedCategory === cat.id ? "$bold" : "$normal"}
                >
                  {cat.name}
                </Text>
              </VStack>
            </Pressable>
          ))}
        </HStack>
      </ScrollView>

      {/* List item vertical */}
      {loading ? (
        <Box justifyContent="center" alignItems="center" py="$6">
          <Spinner size="large" color="$primary500" />
          <Text size="sm" color="$textLight500" mt="$2">
            Memuat data...
          </Text>
        </Box>
      ) : displayedItems.length === 0 ? (
        <Box justifyContent="center" alignItems="center" py="$6">
          <Text color="$textLight500" textAlign="center">
            Tidak ada barang di kategori ini.
          </Text>
        </Box>
      ) : (
        <VStack space="sm">
          {displayedItems.map((item, index) => (
            <Pressable
              key={item.id || index}
              onPress={() => handleItemPress(item)}
            >
              <HStack
                alignItems="center"
                bg="$white"
                borderRadius="$lg"
                px="$3"
                py="$3"
                shadowColor="$black"
                shadowOffset={{ width: 0, height: 1 }}
                shadowOpacity={0.05}
                shadowRadius={2}
                elevation={1}
              >
                <Box
                  w={50}
                  h={50}
                  borderRadius="$md"
                  overflow="hidden"
                  mr="$3"
                  bg="$backgroundLight100"
                  justifyContent="center"
                  alignItems="center"
                >
                  {item.gambar ? (
                    <Image
                      source={{ uri: item.gambar }}
                      alt={item.namaBarang}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 8,
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Icon as={ImageOff} size="lg" color="$textLight400" />
                  )}
                </Box>
                <VStack flex={1}>
                  <Text fontWeight="$bold" size="md" color="$textDark900">
                    {item.namaBarang}
                  </Text>
                  <Text size="xs" color="$textLight500" mt="$1">
                    {item.deskripsi}
                  </Text>
                  <HStack justifyContent="space-between" alignItems="center" mt="$1">
                    <Text size="sm" color="$primary500" fontWeight="$semibold">
                      Stok: {item.stok} pcs
                    </Text>
                    <Text size="sm" color="$textDark700" fontWeight="$bold">
                      Rp. {item.harga?.toLocaleString("id-ID")}
                    </Text>
                  </HStack>
                </VStack>
                <Icon
                  as={ChevronRight}
                  size="sm"
                  color="$textLight400"
                  ml="$2"
                />
              </HStack>
            </Pressable>
          ))}
        </VStack>
      )}

      {/* Show message if there are more items */}
      {!loading && filteredItems.length > 5 && (
        <Pressable onPress={handleViewAllPress} mt="$3">
          <Box
            bg="$backgroundLight100"
            borderRadius="$lg"
            py="$3"
            alignItems="center"
          >
            <Text size="sm" color="$primary500" fontWeight="$semibold">
              Dan {filteredItems.length - 5} barang lainnya...
            </Text>
          </Box>
        </Pressable>
      )}
    </Box>
  );
};

export default ListItem;