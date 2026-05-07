<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useHotel, useTripDetails } from '@/domain/services'
import { useTelegram } from '@/application/services'
import { PageWithHeader, Placeholder, Icon, Section, Sections, List, ListItem, Amount, Avatar, FixedFooter } from '@/presentation/components'
import { amenities } from '@/infra/store/hotels/mock/amenities'
import { formatDate } from '@/infra/utils/date'
import { spaced } from '@/infra/utils/number'
import { useRouter } from 'vue-router'

const DEFAULT_MANAGER_USERNAME = 'your_manager_username_here'
const MANAGER_USERNAME = (import.meta.env.VITE_MANAGER_USERNAME as string | undefined) ?? DEFAULT_MANAGER_USERNAME
const TELEGRAM_MESSAGE_LIMIT = 3500

const props = defineProps({
  /**
   * Selected hotel identifier (got from route params)
   */
  hotelId: Number,

  /**
   * Identifier of the selected room in a hotel (got from route params)
   */
  roomId: Number,
}) as {
  hotelId: number | undefined;
  roomId: number | undefined;
}

/**
 * Selected hotel identifier
 */
const hotelId = computed(() => props.hotelId)

/**
 * Identifier of the selected room in a hotel
 */
const roomId = computed(() => props.roomId)

const { days, trip } = useTripDetails()
const { hotel } = useHotel(hotelId)
const { setButtonLoader, showAlert, openTelegramLink, showMainButton, hideMainButton, showBackButton, hideBackButton } = useTelegram()
const router = useRouter()

/**
 * Selected room data
 */
const room = computed(() => {
  if (hotel.value === undefined) {
    return undefined
  }

  return hotel.value.rooms.find(room => room.id === roomId.value)
})

/**
 * Total price for the selected room for the selected days
 * Does not include service fee
 */
const roomAmount = computed(() => {
  if (room.value === undefined) {
    return 0
  }

  const transfer = 100

  return room.value.price * days.value + transfer
})

/**
 * Main button click handler
 */
async function buttonClicked(): Promise<void> {
  setButtonLoader(true)

  if (room.value === undefined || hotel.value === undefined) {
    showAlert('Room not found')
    setButtonLoader(false)

    return
  }

  const orderText = [
    'New Booking:',
    `Hotel: ${hotel.value.title}`,
    `Room: ${room.value.title}`,
    `Dates: ${formatDate(trip.startDate, true)} — ${formatDate(trip.endDate, true)}`,
    `Nights: ${days.value}`,
    `Room Price: ${room.value.price}$ × ${days.value} = ${room.value.price * days.value}$`,
    'Transfer: 100$',
    `Total: ${roomAmount.value}$`,
  ].join('\n')

  let safeOrderText = orderText

  while (encodeURIComponent(safeOrderText).length > TELEGRAM_MESSAGE_LIMIT && safeOrderText.length > 0) {
    safeOrderText = Array.from(safeOrderText).slice(0, -1).join('')
  }

  if (safeOrderText !== orderText) {
    showAlert('Booking text was shortened to fit Telegram limits')
  }

  const managerUsername = MANAGER_USERNAME.replace(/^@+/, '').trim()

  if (managerUsername.length === 0 || managerUsername === DEFAULT_MANAGER_USERNAME) {
    showAlert('Manager username is not configured')
    setButtonLoader(false)
    return
  }

  const telegramLink = `https://t.me/${managerUsername}?text=${encodeURIComponent(safeOrderText)}`

  setButtonLoader(false)

  if (openTelegramLink(telegramLink)) {
    return
  }

  window.open(telegramLink, '_blank')
}

/**
 * We show footer after some delay, so this variable contains the state of footer visibility
 */
const isPriceFooterShowed = ref(false)
const footerShowingDelay = ref<ReturnType<typeof setTimeout>>()

onMounted(() => {
  /**
   * Show main Telegram CTA
   */
  showMainButton('Book now', () => {
    void buttonClicked()
  })

  showBackButton(() => {
    void router.push(`/hotel/${hotelId.value}`)
  })

  footerShowingDelay.value = setTimeout(() => {
    isPriceFooterShowed.value = true
  }, 300)
})

onBeforeUnmount(() => {
  hideMainButton()
  hideBackButton()

  clearTimeout(footerShowingDelay.value)
})
</script>

<template>
  <div>
    <PageWithHeader
      v-if="room && hotel"
      class="page"
    >
      <template #header>
        <ListItem
          :avatar="{src: hotel.picture, placeholder: hotel.title, pictureThumb: hotel.pictureThumb}"
          :title="hotel.title"
          :subtitle="hotel.subtitle"
          :to="`/hotel/${hotel.id}`"
          nowrap
        />
      </template>
      <template #content>
        <Sections class="form">
          <Section standalone>
            <Placeholder
              :title="room.title"
              :caption="room.subtitle"
              standalone
            >
              <template #picture>
                <Avatar
                  :src="room.picture"
                  :picture-thumb="room.pictureThumb"
                  big
                />
              </template>
            </Placeholder>
          </Section>

          <Section
            padded
            title="Price"
          >
            <List
              with-background
              standalone
            >
              <ListItem
                label="Room price"
              >
                <template #right>
                  <span>{{ Math.max(1, days) }} × {{ room.price }}$</span>
                </template>
              </ListItem>
              <ListItem
                label="Breakfast"
              >
                <template #right>
                  <span>Included</span>
                </template>
              </ListItem>
              <ListItem
                label="Transfer"
              >
                <template #right>
                  <Amount>100$</Amount>
                </template>
              </ListItem>
            </List>
          </Section>
          <Section
            title="Amenities"
            padded
          >
            <List
              with-background
              standalone
            >
              <ListItem
                v-for="(amenity, index) in amenities"
                :key="'amenity' + index"
                :icon="amenity.icon"
                :label="amenity.name"
                right-icon="checkmark"
              />
            </List>
          </Section>
        </Sections>
      </template>
    </PageWithHeader>
    <FixedFooter>
      <div
        v-if="room && isPriceFooterShowed"
        class="price"
      >
        <ListItem
          title="Total Price"
          :subtitle="`For ${days} night${days > 1 ? 's' : ''} stand`"
        >
          <template #picture>
            <Icon
              name="card"
            />
          </template>
          <template #right>
            <Amount>
              {{ spaced(roomAmount) }}$
            </Amount>
          </template>
        </ListItem>
      </div>
    </FixedFooter>
  </div>
</template>

<style scoped>
.price {
  margin: calc(var(--size-cell-h-margin) / 2);
  padding: 4px;
  background-color: var(--color-overlay-floating);
  color: #fff;
  backdrop-filter: blur(14px);
  border-radius: var(--size-border-radius-big);
  animation: fade-in 200ms ease;
  will-change: opacity;

  &:deep(.number){
    font-size: 22px;
    gap: 4px;
  }

  &:deep(.topline){
    margin-bottom: 4px;
  }

  &:deep(.icon){
    width: 20px;
    display: block;
    animation: shake 500ms cubic-bezier(0.19, 1, 0.22, 1) 100ms;
    will-change: transform;
  }

  &:deep(svg){
    fill: currentColor;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}

@keyframes shake {
  0% {
    transform: rotate(-10deg) scale(0.2);
  }

  30% {
    transform: rotate(5deg) scale(1);
  }

  50% {
    transform: rotate(-5deg) scale(1.1);
  }

  75% {
    transform: rotate(5deg) scale(1);
  }

  100% {
    transform: none;
  }
}

.form {
  padding-bottom: 84px;
}
</style>
