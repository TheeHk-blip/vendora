import { useSyncExternalStore } from "react";
import { CartItem } from "../types/cartItem";
import { setCookie, getCookie } from "cookies-next";

type CartState = readonly CartItem[];
type Listener = () => void;

const SERVER_SNAPSHOT: CartState = [];

class CartStore {
  private cart: CartState = [];
  private initialized = false;
  private listeners = new Set<Listener>();

  private ensureInitialized() {
    if (this.initialized || typeof window === "undefined") return;
    const saved = getCookie("shopping_cart");
    this.cart = saved ? JSON.parse(saved as string) : [];
    this.initialized = true;
  }

  public addItem = (newItem: CartItem): void => {
    const existing = this.cart.find(i => i.variantId === newItem.variantId);

    if (existing) {
      this.cart = this.cart.map(item =>
        item.variantId === newItem.variantId
        ? {...item, quantity:item.quantity + newItem.quantity}
        : item
      );
    } else {
      this.cart = [...this.cart, newItem];            
    }

    setCookie("shopping_cart", JSON.stringify(this.cart), {maxAge: 60 * 60 * 24});
    this.notify();
  };

  public removeItem = (variantId:  string): void => {
    this.cart = this.cart.filter((item) => item.variantId !== variantId);    
    setCookie("shopping_cart", JSON.stringify(this.cart))

    this.notify();
  };

  public updateQuantity = (variantId: string, newQuantity: number, maxStock?: number): void => {
    if (newQuantity < 1) return;

    if (maxStock !== undefined && newQuantity > maxStock) {
      return;
    }
    this.cart = this.cart.map(item => 
      item.variantId === variantId
      ? {...item, quantity: newQuantity}
      : item
    );

    setCookie("shopping_cart", JSON.stringify(this.cart), {maxAge: 60 * 60 * 24});
    this.notify();
  }

  public clearCart = (): void => {
    this.cart = [];
    this.notify();
  }

  public subscribe = (listener: Listener): () => void => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  public getSnapshot = (): CartState => {
    this.ensureInitialized();
    return this.cart;
  };

  public getServerSnapshot = (): CartState => {
    return SERVER_SNAPSHOT;
  };

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const cartStore = new CartStore();

export function useCart() {
  return useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  )
}