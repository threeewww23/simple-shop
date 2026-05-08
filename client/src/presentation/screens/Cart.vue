<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/domain/services'
import { useTelegram } from '@/application/services'
import { Amount, List, ListItem, PageWithHeader, Placeholder, Section, Sections } from '@/presentation/components'

const DEFAULT_MANAGER_USERNAME = 'your_manager_username_here'
const MANAGER_USERNAME = (import.meta.env.VITE_MANAGER_USERNAME as string | undefined) ?? DEFAULT_MANAGER_USERNAME
const TELEGRAM_MESSAGE_LIMIT = 3500

const router = useRouter()
const { cartItems, totalPrice, totalCount, changeQuantity, removeItem, clearCart } = useCart()
const { setButtonLoader, showAlert, showBackButton, hideBackButton, hideMainButton, openTelegramLink } = useTelegram()

const isCartEmpty = computed(() => cartItems.value.length === 0)

function increaseQuantity(productId: number): void {
  const item = cartItems.value.find((cartItem) => cartItem.id === productId)

  if (item === undefined) {
    return
  }

  changeQuantity(productId, item.quantity + 1)
}

function decreaseQuantity(productId: number): void {
  const item = cartItems.value.find((cartItem) => cartItem.id === productId)

  if (item === undefined) {
    return
  }

  changeQuantity(productId, item.quantity - 1)
}

function goToCatalog(): void {
  void router.push('/')
}

async function checkout(): Promise<void> {
  setButtonLoader(true)

  if (isCartEmpty.value) {
    showAlert('Корзина пуста')
    setButtonLoader(false)
    return
  }

  const receiptItems = cartItems.value.map((item, index) => formatReceiptItem(item, index))

  const orderText = [
    'Новый заказ:',
    ...receiptItems,
    `Итого: ${totalPrice.value}₽`,
  ].join('\n')

  let safeOrderText = orderText

  while (encodeURIComponent(safeOrderText).length > TELEGRAM_MESSAGE_LIMIT && safeOrderText.length > 0) {
    safeOrderText = Array.from(safeOrderText).slice(0, -1).join('')
  }

  if (safeOrderText !== orderText) {
    showAlert('Текст заказа был сокращён, чтобы соответствовать лимитам Telegram')
  }

  const managerUsername = MANAGER_USERNAME.replace(/^@+/, '').trim()

  if (managerUsername.length === 0 || managerUsername === DEFAULT_MANAGER_USERNAME) {
    showAlert('Не настроен username менеджера')
    setButtonLoader(false)
    return
  }

  const telegramLink = `https://t.me/${managerUsername}?text=${encodeURIComponent(safeOrderText)}`

  setButtonLoader(false)

  if (!openTelegramLink(telegramLink)) {
    const openedWindow = window.open(telegramLink, '_blank')

    if (openedWindow === null) {
      showAlert('Не удалось открыть Telegram. Разрешите всплывающие окна и попробуйте снова')
      return
    }
  }

  clearCart()
  void router.push('/')
}

function formatReceiptItem(
  item: {
    title: string;
    price: number;
    quantity: number;
  },
  index: number,
): string {
  const itemTotal = item.price * item.quantity
  return `${index + 1}. ${item.title}\n${item.quantity} x ${item.price}₽ = ${itemTotal}₽`
}

onMounted(() => {
  hideMainButton()
  showBackButton(() => {
    void router.push('/')
  })
})

onBeforeUnmount(() => {
  hideMainButton()
  hideBackButton()
})
</script>

<template>
  <PageWithHeader class="page">
    <template #header>
      <ListItem
        title="Корзина"
        :subtitle="`Товаров: ${totalCount}`"
        to="/"
        nowrap
      />
    </template>
    <template #content>
      <Sections class="cart-page">
        <template v-if="!isCartEmpty">
          <Section
            title="Товары"
            padded
          >
            <List gapped>
              <ListItem
                v-for="item in cartItems"
                :id="item.id"
                :key="item.id"
                :avatar="{ src: item.picture, placeholder: item.title, pictureThumb: item.pictureThumb }"
                :title="item.title"
                :subtitle="item.subtitle"
                standalone
                big-avatar
              >
                <template #right>
                  <div class="cart-item-right">
                    <div class="quantity-controls">
                      <button
                        type="button"
                        class="quantity-button"
                        @click="decreaseQuantity(item.id)"
                      >
                        −
                      </button>
                      <span class="quantity-value">{{ item.quantity }}</span>
                      <button
                        type="button"
                        class="quantity-button"
                        @click="increaseQuantity(item.id)"
                      >
                        +
                      </button>
                    </div>
                    <Amount>{{ item.price * item.quantity }}₽</Amount>
                    <button
                      type="button"
                      class="remove-button"
                      @click="removeItem(item.id)"
                    >
                      Удалить
                    </button>
                  </div>
                </template>
              </ListItem>
            </List>
          </Section>

          <Section
            title="Сумма заказа"
            padded
          >
            <List
              with-background
              standalone
            >
              <ListItem label="Количество товаров">
                <template #right>
                  <Amount>{{ totalCount }}</Amount>
                </template>
              </ListItem>
              <ListItem label="Итого">
                <template #right>
                  <Amount>{{ totalPrice }}₽</Amount>
                </template>
              </ListItem>
            </List>
          </Section>

          <Section padded>
            <button
              type="button"
              class="checkout-button"
              @click="checkout"
            >
              Оформить заказ
            </button>
          </Section>
        </template>

        <template v-else>
          <Placeholder
            title="Корзина пуста"
            caption="Добавьте кроссовки из каталога"
            compact
          >
            <template #picture>
              🛒
            </template>
          </Placeholder>

          <Section padded>
            <button
              type="button"
              class="checkout-button"
              @click="goToCatalog"
            >
              Перейти в каталог
            </button>
          </Section>
        </template>
      </Sections>
    </template>
  </PageWithHeader>
</template>

<style scoped>
.cart-page {
  padding-bottom: 16px;
}

.cart-item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.quantity-button {
  border: none;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: var(--color-bg-secondary);
  color: var(--color-text);
  font-size: 16px;
  cursor: pointer;
}

.quantity-value {
  min-width: 20px;
  text-align: center;
}

.remove-button {
  border: none;
  background: transparent;
  color: var(--color-link);
  font-size: 13px;
  cursor: pointer;
}

.checkout-button {
  width: 100%;
  height: 48px;
  border: none;
  border-radius: var(--size-border-radius-big);
  background: var(--color-button);
  color: var(--color-button-text);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
</style>
