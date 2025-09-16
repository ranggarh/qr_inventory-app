import React, { useState } from "react";
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
} from "@gluestack-ui/themed";
import { ChevronRight } from "lucide-react-native";

// Data dummy kategori
const categories = [
  { id: "all", name: "Semua", color: "$primary500" },
  { id: "laptop", name: "Laptop", color: "$primary500" },
  { id: "hp", name: "HP", color: "$primary500" },
  { id: "mouse", name: "Mouse", color: "$primary500" },
  { id: "printer", name: "Printer", color: "$primary500" },
];

// Data dummy item
const items = [
  {
    id: "1",
    name: "Laptop Lenovo Thinkpad",
    category: "laptop",
    code: "INV-001",
    qty: 10,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "2",
    name: "HP Samsung Galaxy",
    category: "hp",
    code: "INV-002",
    qty: 7,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "3",
    name: "Mouse Logitech",
    category: "mouse",
    code: "INV-003",
    qty: 15,
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "4",
    name: "Printer Epson L3110",
    category: "printer",
    code: "INV-004",
    qty: 3,
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "5",
    name: "Laptop Asus Vivobook",
    category: "laptop",
    code: "INV-005",
    qty: 5,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "6",
    name: "HP iPhone 13",
    category: "hp",
    code: "INV-006",
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
  },
];

const ListItem = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter item sesuai kategori
  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  // Ambil maksimal 5 item
  const displayedItems = filteredItems.slice(0, 5);

  return (
    <Box mb="$6">
      <Text fontWeight="$bold" size="lg" mb="$2" color="$textDark900">
        Daftar Barang
      </Text>
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
      
      {/* List item vertical - replaced FlatList with ScrollView + map */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {displayedItems.length === 0 ? (
          <Text color="$textLight500" alignSelf="center" mt="$4">
            Tidak ada barang di kategori ini.
          </Text>
        ) : (
          <VStack>
            {displayedItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <HStack
                  alignItems="center"
                  bg="$white"
                  borderRadius="$lg"
                  px="$3"
                  py="$2"
                >
                  <Box
                    w={50}
                    h={50}
                    borderRadius="$md"
                    overflow="hidden"
                    mr="$3"
                    bg="$white"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Image
                      source={{ uri: item.image }}
                      alt={item.name}
                      style={{ width: 50, height: 50, borderRadius: 12 }}
                      resizeMode="cover"
                    />
                  </Box>
                  <VStack flex={1}>
                    <Text fontWeight="$bold" size="md" color="$textDark900">
                      {item.name}
                    </Text>
                    <Text size="xs" color="$textLight500">
                      {item.code}
                    </Text>
                    <Text size="sm" mt="$1" color="$primary500" fontWeight="$bold">
                      Qty: {item.qty}
                    </Text>
                  </VStack>
                  <Icon as={ChevronRight} size="sm" color="$textLight400" ml="$2" />
                </HStack>
                {index < displayedItems.length - 1 && (
                  <Divider bg="$backgroundLight200" my="$2" />
                )}
              </React.Fragment>
            ))}
          </VStack>
        )}
      </ScrollView>
    </Box>
  );
};

export default ListItem;