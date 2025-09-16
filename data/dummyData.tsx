import {
  AlertTriangle,
  TrendingUp,
  Calendar,
  BarChart3,
} from 'lucide-react-native';
import { InventoryData, CategoryCardData } from '../types';

export const inventoryData: InventoryData = {
  totalCategories: 24,
  totalFolders: 15,
  totalItems: 479,
  totalValue: 1057.50,
  lowStockItems: 18,
  moveItems: 8,
  upcomingItems: 4,
  qtyChangeItems: 32,
};

export const categoryCards: CategoryCardData[] = [
  {
    id: 1,
    title: 'Stok Rendah',
    subtitle: 'Barang dengan stok yang sudah menipis',
    count: inventoryData.lowStockItems,
    unit: 'Barang',
    icon: AlertTriangle,
    color: '#FF6B6B',
    badge: 'Baru',
  },
  {
    id: 2,
    title: 'Perpindahan',
    subtitle: 'Lacak inventaris yang dipindahkan',
    count: inventoryData.moveItems,
    unit: 'Pesanan',
    icon: TrendingUp,
    color: '#4ECDC4',
    badge: 'Baru',
  },
  {
    id: 3,
    title: 'Mendatang',
    subtitle: 'Barang dalam inventaris yang akan datang',
    count: inventoryData.upcomingItems,
    unit: 'Barang',
    icon: Calendar,
    color: '#45B7D1',
    badge: null,
  },
  {
    id: 4,
    title: 'Perubahan Qty',
    subtitle: 'Semua masuk dan keluar untuk inventaris',
    count: inventoryData.qtyChangeItems,
    unit: 'Barang',
    icon: BarChart3,
    color: '#96CEB4',
    badge: null,
  },
];