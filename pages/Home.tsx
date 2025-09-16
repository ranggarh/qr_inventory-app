import {
  SafeAreaView,
  ScrollView,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  Card,
  Box,
  StatusBar,
  LinearGradient,
  Badge,
} from "@gluestack-ui/themed";
import {
  Plus,
  Package,
  CircleUserIcon,
  CheckCircle,
  AlertTriangle,
  ShoppingCart,
  Archive,
  // TrendingUp,
} from "lucide-react-native";
import { inventoryData, categoryCards } from "../data/dummyData";
import { CategoryCardData } from "../types";
import ListItem from "../component-app/ListItem";

const HeaderSection = () => {
  return (
    <HStack justifyContent="space-between" alignItems="center" mb="$6">
      <VStack>
        <Text size="sm" color="$textLight500">
          Rabu, 13 Apr 23
        </Text>
        <Text size="xl" fontWeight="$bold" color="$textDark900">
          Selamat datang, Rangga!
        </Text>
      </VStack>
      <Button
        size="sm"
        variant="solid"
        bg="$primary500"
        borderRadius="$full"
        w="$10"
        h="$10"
        mt="$4"
      >
        <Icon as={CircleUserIcon} size="sm" color="$white" />
      </Button>
    </HStack>
  );
};

const InventorySummaryCard = () => {
  const lowStockItems = 12;
  const totalValue = inventoryData.totalValue;
  const monthlyGrowth = 8.5;

  return (
    <VStack space="md" mb="$6">
      <Card bg="$primary500" size="lg" variant="elevated" overflow="hidden">
        <Box p="$2">
          <HStack alignItems="center" justifyContent="space-between" mb="$4">
            <HStack alignItems="center">
              <Box
                bg="rgba(255,255,255,0.2)"
                borderRadius="$full"
                p="$3"
                mr="$3"
              >
                <Icon as={Package} size="lg" color="$white" />
              </Box>
              <VStack>
                <Text size="lg" color="$white" fontWeight="$bold">
                  Ringkasan Inventaris
                </Text>
                <HStack alignItems="center" space="xs">
                  {/* <Icon as={TrendingUp} size="xs" color="$green300" /> */}
                  <Text size="xs" color="$green300" fontWeight="$medium">
                    +{monthlyGrowth}% bulan ini
                  </Text>
                </HStack>
              </VStack>
            </HStack>

            <Badge
              bg="rgba(255,255,255,0.2)"
              borderRadius="$full"
              px="$3"
              py="$1"
            >
              <Text size="xs" color="$white" fontWeight="$bold">
                Live
              </Text>
            </Badge>
          </HStack>

          {/* Stats Grid */}
          <HStack justifyContent="space-between">
            <VStack alignItems="center" flex={1}>
              <Text size="xs" color="rgba(255,255,255,0.8)" mb="$1">
                Kategori
              </Text>
              <Text size="2xl" color="$white" fontWeight="$bold">
                {inventoryData.totalCategories}
              </Text>
              <Text size="xs" color="rgba(255,255,255,0.6)">
                Aktif
              </Text>
            </VStack>

            <Box w="$0.5" bg="rgba(255,255,255,0.2)" />

            <VStack alignItems="center" flex={1}>
              <Text size="xs" color="rgba(255,255,255,0.8)" mb="$1">
                Total Item
              </Text>
              <Text size="2xl" color="$white" fontWeight="$bold">
                {inventoryData.totalItems}
              </Text>
              <Text size="xs" color="rgba(255,255,255,0.6)">
                Unit
              </Text>
            </VStack>

            <Box w="$0.5" bg="rgba(255,255,255,0.2)" />

            <VStack alignItems="center" flex={1}>
              <Text size="xs" color="rgba(255,255,255,0.8)" mb="$1">
                Nilai Total
              </Text>
              <Text size="lg" color="$white" fontWeight="$bold">
                {totalValue > 1000000000
                  ? `${(totalValue / 1000000000).toFixed(1)}B`
                  : totalValue > 1000000
                  ? `${(totalValue / 1000000).toFixed(1)}M`
                  : `${(totalValue / 1000).toFixed(0)}K`}
              </Text>
              <Text size="xs" color="rgba(255,255,255,0.6)">
                Rupiah
              </Text>
            </VStack>
          </HStack>
        </Box>
      </Card>

      {/* Quick Stats Cards */}
      <HStack space="md">
        <Card flex={1} bg="$white" variant="elevated">
          <Box p="$4">
            <HStack alignItems="center" space="sm" mb="$2">
              <Box bg="$green100" borderRadius="$full" p="$2">
                <Icon as={CheckCircle} size="sm" color="$green600" />
              </Box>
              <Text size="sm" color="$textLight600" fontWeight="$medium">
                Stok Normal
              </Text>
            </HStack>
            <Text size="xl" color="$green600" fontWeight="$bold">
              {inventoryData.totalItems - lowStockItems}
            </Text>
            <Text size="xs" color="$textLight500">
              Item tersedia
            </Text>
          </Box>
        </Card>

        <Card flex={1} bg="$white" variant="elevated">
          <Box p="$4">
            <HStack alignItems="center" space="sm" mb="$2">
              <Box bg="$orange100" borderRadius="$full" p="$2">
                <Icon as={AlertTriangle} size="sm" color="$orange600" />
              </Box>
              <Text size="sm" color="$textLight600" fontWeight="$medium">
                Stok Rendah
              </Text>
            </HStack>
            <Text size="xl" color="$orange600" fontWeight="$bold">
              {lowStockItems}
            </Text>
            <Text size="xs" color="$textLight500">
              Perlu restock
            </Text>
          </Box>
        </Card>
      </HStack>
    </VStack>
  );
};

const FloatingActionButton = () => {
  return (
    <Box
      position="absolute"
      bottom="$20"
      right="$4"
      w={50}
      h={50}
      borderRadius="$full"
      overflow="hidden"
      elevation={8}
      shadowColor="$primary500"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.3}
      shadowRadius={8}
    >
      <Box w={50} h={50} bg="$primary500" justifyContent="center" alignItems="center">
        <Icon as={Plus} size="lg" color="$white" />
      </Box>
    </Box>
  );
};

export const Home = () => {
  return (
    <SafeAreaView flex={1} bg="$backgroundLight50">
      <StatusBar barStyle="dark-content" backgroundColor="#fafafa" />

      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        backgroundColor="$white"
      >
        <VStack p="$4" pb="$24">
          <HeaderSection />
          <InventorySummaryCard />
          <ListItem />
        </VStack>
      </ScrollView>

      <FloatingActionButton />
    </SafeAreaView>
  );
};
