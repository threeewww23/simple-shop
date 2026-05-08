<script setup lang="ts">
import { Amount, List, ListItem, Placeholder, Section, Sections } from '@/presentation/components'
import { hotels } from '@/infra/store/hotels/mock/hotels'
import { useTelegram } from '@/application/services'
import { onBeforeUnmount, onMounted } from 'vue'

const { hideMainButton, expand } = useTelegram()

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
      <List gapped>
        <ListItem
          v-for="product in hotels"
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
    </Section>
  </Sections>
</template>
