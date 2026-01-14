import { HttpTypes } from "@medusajs/types";

export type Product = HttpTypes.StoreProduct;
export type ProductVariant = HttpTypes.StoreProductVariant;
export type Cart = HttpTypes.StoreCart;
export type CartLineItem = HttpTypes.StoreCartLineItem;
export type Region = HttpTypes.StoreRegion;

export interface PaginatedResponse<T> {
    data: T[];
    count: number;
    offset: number;
    limit: number;
}
