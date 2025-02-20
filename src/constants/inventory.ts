export const InventoryStatus = {
  Available: 'AVAILABLE',
  OutOfStock: 'OUT_OF_STOCK',
  OnOrder: 'ON_ORDER',
  Discontinued: 'DISCONTINUED',
} as const;

export type InventoryStatus = typeof InventoryStatus[keyof typeof InventoryStatus]; 