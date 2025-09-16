import React, { useState } from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Icon,
  Pressable,
} from "@gluestack-ui/themed";
import {
  Home as HomeIcon,
  Package2,
  PieChart,
  Menu,
  ScanBarcodeIcon,
} from "lucide-react-native";
import { Home } from "./pages/Home";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BottomTabBar = () => {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "Beranda", icon: HomeIcon },
    { id: "items", label: "Barang", icon: Package2 },
    { id: "scan", label: "Scan", icon: ScanBarcodeIcon },
    { id: "stats", label: "Statistik", icon: PieChart },
    { id: "menu", label: "Menu", icon: Menu },
  ];

  const renderTab = (tab: (typeof tabs)[0]) => {
    const isScan = tab.id === "scan";

    if (isScan) {
      return (
        <Pressable
          key={tab.id}
          onPress={() => setActiveTab(tab.id)}
          style={{ marginTop: -30 }}
        >
          <Box
            bg="$primary500"
            w="$16"
            h="$16"
            borderRadius="$full"
            justifyContent="center"
            alignItems="center"
          >
            <Icon as={tab.icon} size="xl" color="$white" />
            <Text
              size="xs"
              color="$white"
              mt="$1"
            >
              {tab.label}
            </Text>
          </Box>
        </Pressable>
      );
    }

    return (
      <Pressable key={tab.id} onPress={() => setActiveTab(tab.id)}>
        <VStack alignItems="center" py="$2">
          <Icon
            as={tab.icon}
            size="sm"
            color={activeTab === tab.id ? "$primary500" : "$textLight400"}
          />
          <Text
            size="xs"
            color={activeTab === tab.id ? "$primary500" : "$textLight400"}
            mt="$1"
          >
            {tab.label}
          </Text>
        </VStack>
      </Pressable>
    );
  };

  return (
    <Box
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      bg="$white"
      // borderTopWidth={1}
      // borderTopColor="$borderLight200"
      px="$4"
      py="$2"
    >
      <HStack justifyContent="space-around" alignItems="center">
        {tabs.map(renderTab)}
      </HStack>
    </Box>
  );
};

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#23b160" />
        <Box flex={1}>
          <Home />
          <BottomTabBar />
        </Box>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}
