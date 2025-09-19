import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  HStack,
  VStack,
  Icon,
  Pressable,
  Image,
  Divider,
  Input,
  InputField,
  ScrollView,
  Spinner,
} from "@gluestack-ui/themed";
import { FlatList } from "react-native";
import { ChevronRight, Search, ImageOff } from "lucide-react-native";
import { getItems, Barang } from "@/backend/actions/ItemActions";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

const categories = [
  { id: "all", name: "Semua", color: "$primary500" },
  { id: "laptop", name: "Laptop", color: "$primary500" },
  { id: "hp", name: "HP", color: "$primary500" },
  { id: "mouse", name: "Mouse", color: "$primary500" },
  { id: "printer", name: "Printer", color: "$primary500" },
];

const ItemList = () => {
  const [items, setItems] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Fetch data dari Firebase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getItems();
      setItems(data as Barang[]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter by category & search
  const filteredItems = items.filter((item) => {
    const matchCategory =
      selectedCategory === "all" || item.kategori === selectedCategory;
    const matchSearch =
      item.namaBarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const renderItem = ({ item }: { item: Barang }) => (
    <Pressable
      onPress={() => navigation.navigate("ItemDetail", { item } as any)}
    >
      <HStack
        alignItems="center"
        bg="$white"
        // borderRadius="$lg"
        px="$3"
        py="$3"
        shadowColor="$black"
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.05}
        shadowRadius={2}
        // elevation={1}
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
        <Icon as={ChevronRight} size="sm" color="$textLight400" ml="$2" />
      </HStack>
    </Pressable>
  );

  return (
    <Box p="$4" bgColor="$white" mb={10}>
      <Text fontWeight="$bold" size="lg" mb="$3" color="$textDark900">
        Daftar Barang
      </Text>

      {/* Search Bar */}
      <HStack
        alignItems="center"
        borderRadius="$lg"
        bgColor="$backgroundLight100"
        px="$3"
        mb="$4"
      >
        <Icon as={Search} size="sm" color="$textLight500" mr="$2" />
        <Input flex={1} borderWidth={0} p={0}>
          <InputField
            placeholder="Cari barang..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            bgColor="$backgroundLight100"
          />
        </Input>
      </HStack>

      {/* Kategori */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} mb="$4">
        <HStack space="md">
          {categories.map((cat) => (
            <Pressable key={cat.id} onPress={() => setSelectedCategory(cat.id)}>
              <VStack
                alignItems="center"
                px="$3"
                py="$2"
                bg={selectedCategory === cat.id ? cat.color : "$white"}
                borderRadius="$lg"
                style={{ minWidth: 70 }}
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

      {/* List Items */}
      {loading ? (
        <Box justifyContent="center" alignItems="center">
          <Spinner size="large" color="$primary500" />
          <Text size="sm" color="$textLight500" >
            Memuat data...
          </Text>
        </Box>
      ) : filteredItems.length === 0 ? (
        <Text color="$textLight500" alignSelf="center" mt="$4">
          Tidak ada barang ditemukan.
        </Text>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id ?? Math.random().toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <Divider bg="$backgroundLight200" my="$2" />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Box>
  );
};

export default ItemList;
