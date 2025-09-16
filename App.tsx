import React, { useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import { RootStackParamList, TabType } from './types';
import { useNavigation } from '@react-navigation/native';
import AddItemScreen from './pages/AddItem'; 
import ScanQRScreen from './pages/ScanQr';
import ItemList from "./pages/ItemList";
import ItemDetail from "./pages/ItemDetail";


// Placeholder components - create these components in your pages folder
const ItemsScreen = () => <Box flex={1} bg="$white" />;
const StatsScreen = () => <Box flex={1} bg="$white" />;
const MenuScreen = () => <Box flex={1} bg="$white" />;

const Stack = createNativeStackNavigator<RootStackParamList>();

interface BottomTabBarProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomTabBar = ({ navigation, activeTab, setActiveTab }: BottomTabBarProps) => {
  const tabs: TabType[] = [
    { id: "home", label: "Beranda", icon: HomeIcon, screen: "Home" },
    { id: "items", label: "Barang", icon: Package2, screen: "Items" },
    { id: "scan", label: "Scan", icon: ScanBarcodeIcon, screen: "Scan" },
    { id: "stats", label: "Statistik", icon: PieChart, screen: "Stats" },
    { id: "menu", label: "Menu", icon: Menu, screen: "Menu" },
  ];

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab.id);
    navigation.navigate(tab.screen);
  };

  const renderTab = (tab: TabType) => {
    const isScan = tab.id === "scan";

    if (isScan) {
      return (
        <Pressable
          key={tab.id}
          onPress={() => handleTabPress(tab)}
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
            <Text size="xs" color="$white" mt="$1">
              {tab.label}
            </Text>
          </Box>
        </Pressable>
      );
    }

    return (
      <Pressable key={tab.id} onPress={() => handleTabPress(tab)}>
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
      px="$4"
      py="$2"
    >
      <HStack justifyContent="space-around" alignItems="center">
        {tabs.map(renderTab)}
      </HStack>
    </Box>
  );
};
interface MainLayoutProps {
  navigation?: NativeStackNavigationProp<RootStackParamList>;
}

const MainLayout: React.FC<MainLayoutProps> = () => { 
  const [activeTab, setActiveTab] = useState<string>("home");

  return (
    <Box flex={1}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Items" component={ItemList} />
        <Stack.Screen name="Scan" component={ScanQRScreen} />
        <Stack.Screen name="Stats" component={StatsScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="AddItem" component={AddItemScreen} options={{ headerShown: true, title: 'Tambah Barang' }}/>
        <Stack.Screen name="ItemDetail" component={ItemDetail} options={{ headerShown: true, title: 'Detail Barang' }}/>
      </Stack.Navigator>
      <BottomTabBar 
        navigation={useNavigation()} // Use useNavigation hook instead
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
    </Box>
  );
};

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" backgroundColor="#23b160" />
          <MainLayout />
        </SafeAreaView>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}