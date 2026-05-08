<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useCart, useHotel } from '@/domain/services'
import { useTelegram } from '@/application/services'
import { PageWithHeader, Placeholder, Section, Sections, List, ListItem, Amount, Avatar, Text } from '@/presentation/components'
import { useRouter } from 'vue-router'

const props = defineProps({
  id: Number,
}) as {
  id: number | undefined;
}

const productId = computed(() => props.id)
const { hotel } = useHotel(productId)
const product = computed(() => hotel.value)
const { addItem, getItemQuantity, totalCount } = useCart()
const { showAlert, showBackButton, hideBackButton, hideMainButton } = useTelegram()
const router = useRouter()

function addToCart(): void {
  if (product.value === undefined) {
    showAlert('Товар не найден')
    return
  }

  addItem(product.value)
  showAlert('Товар добавлен в корзину')
}

function goToCart(): void {
  void router.push('/cart')
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
  <div>
    <PageWithHeader
      v-if="product"
      class="page"
    >
      <template #header>
        <ListItem
          title="Каталог"
          subtitle="Кроссовки"
          to="/"
          nowrap
        />
      </template>
      <template #content>
        <Sections class="form">
          <Section standalone>
            <Placeholder
              :title="product.title"
              :caption="product.subtitle"
              standalone
            >
              <template #picture>
                <Avatar
                  :src="product.picture"
                  :picture-thumb="product.pictureThumb"
                  big
                />
              </template>
            </Placeholder>
          </Section>

          <Section
            title="Описание"
            padded
          >
            <Text>
              {{ product.description }}
            </Text>
          </Section>

          <Section
            title="Цена"
            padded
          >
            <List
              with-background
              standalone
            >
              <ListItem label="Цена">
                <template #right>
                  <Amount>{{ product.price }}₽</Amount>
                </template>
              </ListItem>
              <ListItem label="В корзине">
                <template #right>
                  <Amount>{{ getItemQuantity(product.id) }}</Amount>
                </template>
              </ListItem>
            </List>
          </Section>

          <Section padded>
            <button
              type="button"
              class="buy-button"
              @click="addToCart"
            >
              Добавить в корзину
            </button>
          </Section>

          <Section padded>
            <button
              type="button"
              class="cart-button"
              @click="goToCart"
            >
              Перейти в корзину ({{ totalCount }})
            </button>
          </Section>
        </Sections>
      </template>
    </PageWithHeader>

    <Placeholder
      v-else
      title="Товар не найден"
      caption="Вернитесь в каталог и выберите модель"
      compact
    >
      <template #picture>
        👟
      </template>
    </Placeholder>
  </div>
</template>

<style scoped>
.buy-button {
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

.cart-button {
  width: 100%;
  height: 44px;
  border: none;
  border-radius: var(--size-border-radius-big);
  background: var(--color-bg-secondary);
  color: var(--color-text);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.form {
  padding-bottom: 16px;
}
</style>
