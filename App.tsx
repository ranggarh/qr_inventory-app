import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
  ScanBarcodeIcon,
  UserCircle as ProfileIcon,
} from "lucide-react-native";
import { Home } from "./pages/Home";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "./types";
import AddItemScreen from "./pages/AddItem";
import ScanQRScreen from "./pages/ScanQr";
import ItemList from "./pages/ItemList";
import ItemDetail from "./pages/ItemDetail";
import EditItemScreen from "./pages/EditItem";
import LoginScreen from "./pages/auth/Login";
import RegisterScreen from "./pages/auth/Register";
import { getStoredUser } from "./backend/actions/authActions";

// Placeholder component untuk Stats
const StatsScreen = () => (
  <Box
    flex={1}
    bg="$backgroundLight50"
    justifyContent="center"
    alignItems="center"
    p="$4"
  >
    <Text size="lg" fontWeight="$bold" color="$textDark900">
      Statistik
    </Text>
    <Text size="md" color="$textLight500" mt="$2">
      Halaman statistik akan segera hadir
    </Text>
  </Box>
);

const Stack = createNativeStackNavigator<RootStackParamList>();

// Main Tab Navigator Component
const MainTabNavigator = ({ route, onLogout }: any) => {
  const [activeTab, setActiveTab] = useState<string>("home");

  // Listen untuk perubahan dari navigation params
  React.useEffect(() => {
    if (route?.params?.activeTab) {
      setActiveTab(route.params.activeTab);
    }
  }, [route?.params?.activeTab]);

  const tabs = [
    { id: "home", label: "Beranda", icon: HomeIcon, component: () => <Home onLogout={onLogout} /> },
    { id: "items", label: "Barang", icon: Package2, component: ItemList },
    {
      id: "scan",
      label: "Scan",
      icon: ScanBarcodeIcon,
      component: ScanQRScreen,
    },
    { id: "stats", label: "Statistik", icon: PieChart, component: StatsScreen },
    { id: "profile", label: "Profile", icon: ProfileIcon, component: Home },
  ];

  const currentTab = tabs.find((tab) => tab.id === activeTab);
  const CurrentComponent = currentTab?.component || Home;

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
            shadowColor="$black"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.3}
            shadowRadius={6}
            elevation={8}
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
      <Pressable key={tab.id} onPress={() => setActiveTab(tab.id)}>
        <VStack alignItems="center" py="$3" px="$2">
          <Icon
            as={tab.icon}
            size="sm"
            color={activeTab === tab.id ? "$primary500" : "$textLight400"}
          />
          <Text
            size="xs"
            color={activeTab === tab.id ? "$primary500" : "$textLight400"}
            mt="$1"
            fontWeight={activeTab === tab.id ? "$semibold" : "$normal"}
          >
            {tab.label}
          </Text>
        </VStack>
      </Pressable>
    );
  };

  return (
    <Box flex={1}>
      {/* Main Content Area */}
      <Box flex={1} mb="$20">
        <CurrentComponent />
      </Box>

      {/* Fixed Bottom Tab Bar */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        bg="$white"
        px="$4"
        py="$2"
        shadowColor="$black"
        shadowOffset={{ width: 0, height: -2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={10}
      >
        <HStack justifyContent="space-around" alignItems="center">
          {tabs.map(renderTab)}
        </HStack>
      </Box>
    </Box>
  );
};

// Stack Navigator untuk modal screens
const AppNavigator = ({
  isLoggedIn,
  onAuthSuccess,
}: {
  isLoggedIn: boolean;
  onAuthSuccess: () => void;
}) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onAuthSuccess={onAuthSuccess} />}
          </Stack.Screen>
          <Stack.Screen name="Register">
            {(props) => (
              <RegisterScreen {...props} onAuthSuccess={onAuthSuccess} />
            )}
          </Stack.Screen>
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs">
            {(props) => (
              <MainTabNavigator {...props} onLogout={onAuthSuccess} />
            )}
          </Stack.Screen>
          <Stack.Screen name="AddItem" component={AddItemScreen} />
          <Stack.Screen name="ItemDetail" component={ItemDetail} />
          <Stack.Screen name="EditItem" component={EditItemScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const checkUser = async () => {
    const user = await getStoredUser();
    setIsLoggedIn(!!user);
  };

  useEffect(() => {
    checkUser();
  }, []);

  if (isLoggedIn === null) {
    return null;
  }
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" />
          <AppNavigator isLoggedIn={isLoggedIn} onAuthSuccess={checkUser} />
        </SafeAreaView>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
