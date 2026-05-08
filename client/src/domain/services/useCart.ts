import { createSharedComposable } from '@vueuse/core'
import { computed, reactive, type ComputedRef } from 'vue'
import type Hotel from '@/domain/entities/Hotel'

export interface CartItem {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  picture: string;
  pictureThumb?: string;
  quantity: number;
}

interface useCartComposableState {
  cartItems: ComputedRef<CartItem[]>;
  totalPrice: ComputedRef<number>;
  totalCount: ComputedRef<number>;
  addItem: (product: Hotel) => void;
  removeItem: (productId: number) => void;
  changeQuantity: (productId: number, quantity: number) => void;
  getItemQuantity: (productId: number) => number;
  clearCart: () => void;
}

const cartState = reactive({
  items: [] as CartItem[],
})

export const useCart = createSharedComposable((): useCartComposableState => {
  const cartItems = computed(() => cartState.items)

  const totalPrice = computed(() => {
    return cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  const totalCount = computed(() => {
    return cartState.items.reduce((sum, item) => sum + item.quantity, 0)
  })

  function getItemQuantity(productId: number): number {
    const item = cartState.items.find((cartItem) => cartItem.id === productId)
    return item?.quantity ?? 0
  }

  function addItem(product: Hotel): void {
    const existingItem = cartState.items.find((item) => item.id === product.id)

    if (existingItem !== undefined) {
      existingItem.quantity += 1
      return
    }

    cartState.items.push({
      id: product.id,
      title: product.title,
      subtitle: product.subtitle,
      price: product.price,
      picture: product.picture,
      pictureThumb: product.pictureThumb,
      quantity: 1,
    })
  }

  function removeItem(productId: number): void {
    cartState.items = cartState.items.filter((item) => item.id !== productId)
  }

  function changeQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    const existingItem = cartState.items.find((item) => item.id === productId)

    if (existingItem === undefined) {
      return
    }

    existingItem.quantity = quantity
  }

  function clearCart(): void {
    cartState.items = []
  }

  return {
    cartItems,
    totalPrice,
    totalCount,
    addItem,
    removeItem,
    changeQuantity,
    getItemQuantity,
    clearCart,
  }
})
