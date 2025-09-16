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