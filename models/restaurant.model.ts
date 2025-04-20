export interface Restaurant {
  restaurantId: string;
  name: string;
  location: string;
  menuItems: MenuItem[];
}

export interface MenuItem {
  menuId: string;
  itemName: string;
  price: number;
  description: string;
  restaurantId: string;
}
