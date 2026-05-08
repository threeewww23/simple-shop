<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useHotel } from '@/domain/services'
import { useTelegram } from '@/application/services'
import { PageWithHeader, Placeholder, Section, Sections, List, ListItem, Amount, Avatar, Text } from '@/presentation/components'
import { useRouter } from 'vue-router'

const DEFAULT_MANAGER_USERNAME = 'your_manager_username_here'
const MANAGER_USERNAME = (import.meta.env.VITE_MANAGER_USERNAME as string | undefined) ?? DEFAULT_MANAGER_USERNAME
const TELEGRAM_MESSAGE_LIMIT = 3500

const props = defineProps({
  id: Number,
}) as {
  id: number | undefined;
}

const productId = computed(() => props.id)
const { hotel: product } = useHotel(productId)
const { setButtonLoader, showAlert, showBackButton, hideBackButton, hideMainButton, openTelegramLink } = useTelegram()
const router = useRouter()

async function buttonClicked(): Promise<void> {
  setButtonLoader(true)

  if (product.value === undefined) {
    showAlert('Товар не найден')
    setButtonLoader(false)

    return
  }

  const orderText = [
    'Новый заказ:',
    `Модель: ${product.value.title}`,
    `Описание: ${product.value.subtitle}`,
    `Цена: ${product.value.price}₽`,
    'Количество: 1',
    `Итого: ${product.value.price}₽`,
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
    window.open(telegramLink, '_blank')
  }
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
              <ListItem label="Итого">
                <template #right>
                  <Amount>{{ product.price }}₽</Amount>
                </template>
              </ListItem>
            </List>
          </Section>

          <Section padded>
            <button
              type="button"
              class="buy-button"
              @click="buttonClicked"
            >
              Купить
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

.form {
  padding-bottom: 16px;
}
</style>
