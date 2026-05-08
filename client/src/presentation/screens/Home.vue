<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Amount, Input, List, ListItem, Placeholder, Section, Sections } from '@/presentation/components'
import { products } from '@/infra/store/hotels/mock/hotels'
import { useTelegram } from '@/application/services'
import { useCart } from '@/domain/services'

const { hideMainButton, expand } = useTelegram()
const { totalCount } = useCart()
const router = useRouter()
const searchQuery = ref('')
const minPriceQuery = ref('')
const maxPriceQuery = ref('')

const minPrice = computed(() => {
  const parsed = Number(minPriceQuery.value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
})

const maxPrice = computed(() => {
  const parsed = Number(maxPriceQuery.value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
})

const filteredProducts = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLowerCase()
  return products.filter((product) => {
    const titleMatches = product.title.toLowerCase().includes(normalizedQuery)
    const minPriceMatches = minPrice.value === undefined || product.price >= minPrice.value
    const maxPriceMatches = maxPrice.value === undefined || product.price <= maxPrice.value

    return titleMatches && minPriceMatches && maxPriceMatches
  })
})

function goToCart(): void {
  void router.push('/cart')
}

onMounted(() => {
  expand()
  hideMainButton()
})

onBeforeUnmount(() => {
  hideMainButton()
})
</script>

<template>
  <Sections>
    <Placeholder
      title="Каталог"
      caption="Кроссовки"
      compact
    >
      <template #picture>
        👟
      </template>
    </Placeholder>

    <Section padded>
      <button
        type="button"
        class="cart-button"
        @click="goToCart"
      >
        Корзина ({{ totalCount }})
      </button>
    </Section>

    <Section
      title="Поиск и фильтр"
      padded
    >
      <div class="filters">
        <Input
          v-model="searchQuery"
          placeholder="Поиск по названию"
          left-icon="search"
        />
        <div class="price-filters">
          <Input
            v-model="minPriceQuery"
            placeholder="От"
          />
          <Input
            v-model="maxPriceQuery"
            placeholder="До"
          />
        </div>
      </div>
    </Section>

    <Section padded>
      <List gapped>
        <ListItem
          v-for="product in filteredProducts"
          :id="product.id"
          :key="product.id"
          :avatar="{ src: product.picture, placeholder: product.title, pictureThumb: product.pictureThumb }"
          :title="product.title"
          :subtitle="product.subtitle"
          :to="`/product/${product.id}`"
          big-avatar
          standalone
        >
          <template #right>
            <Amount>
              {{ product.price }}₽
            </Amount>
          </template>
        </ListItem>
      </List>

      <Placeholder
        v-if="filteredProducts.length === 0"
        title="Ничего не найдено"
        caption="Попробуйте изменить параметры поиска"
        compact
      >
        <template #picture>
          🔎
        </template>
      </Placeholder>
    </Section>
  </Sections>
</template>

<style scoped>
.cart-button {
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

.filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.price-filters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
</style>
