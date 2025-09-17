export interface InventoryData {
  totalCategories: number;
  totalFolders: number;
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  moveItems: number;
  upcomingItems: number;
  qtyChangeItems: number;
}

export interface CategoryCardData {
  id: number;
  title: string;
  subtitle: string;
  count: number;
  unit: string;
  icon: any;
  color: string;
  badge?: string | null;
}

export type RootStackParamList = {
  Home: undefined;
  Items: undefined;
  Scan: undefined;
  Stats: undefined;
  Menu: undefined;
  // AddItem: undefined;
  AddItem: { kodeBarang: string; barcodeType: string ; prefilledData: any;}; // ✅ AddItem butuh params

  ItemDetail: undefined;
};

export type TabType = {
  id: string;
  label: string;
  icon: any;
  screen: keyof RootStackParamList;
};
